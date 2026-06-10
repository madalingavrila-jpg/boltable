import { config } from "../config.js";

type SoqlResult<T> = {
  totalSize: number;
  done: boolean;
  records: T[];
};

let cachedToken: { value: string; instanceUrl: string; expiresAt: number } | null =
  null;

async function getAccessToken(): Promise<{ token: string; instanceUrl: string }> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return { token: cachedToken.value, instanceUrl: cachedToken.instanceUrl };
  }

  const password = `${config.salesforce.password}${config.salesforce.securityToken}`;
  const body = new URLSearchParams({
    grant_type: "password",
    client_id: config.salesforce.clientId,
    client_secret: config.salesforce.clientSecret,
    username: config.salesforce.username,
    password,
  });

  const response = await fetch(
    `${config.salesforce.loginUrl.replace(/\/$/, "")}/services/oauth2/token`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Salesforce auth failed (${response.status}): ${text}`);
  }

  const payload = (await response.json()) as {
    access_token: string;
    instance_url: string;
    issued_at?: string;
  };

  cachedToken = {
    value: payload.access_token,
    instanceUrl: payload.instance_url,
    expiresAt: now + 55 * 60 * 1000,
  };

  return { token: payload.access_token, instanceUrl: payload.instance_url };
}

export async function runSoql<T = Record<string, unknown>>(
  query: string,
): Promise<SoqlResult<T>> {
  const { token, instanceUrl } = await getAccessToken();
  const url = new URL("/services/data/v64.0/query", instanceUrl);
  url.searchParams.set("q", query);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Salesforce query failed (${response.status}): ${text}`);
  }

  return (await response.json()) as SoqlResult<T>;
}

export type SalesforceLead = {
  Id: string;
  Name: string;
  Company: string | null;
  City: string | null;
  Status: string | null;
  CreatedDate: string;
};

export type SalesforceAccount = {
  Id: string;
  Name: string;
  BillingCity: string | null;
  CreatedDate: string;
};

export async function countLeads(filter: string): Promise<number> {
  const result = await runSoql(`SELECT COUNT() FROM Lead WHERE ${filter}`);
  return result.totalSize;
}

export async function fetchRecentLeads(limit = 10): Promise<SalesforceLead[]> {
  const result = await runSoql<SalesforceLead>(
    `SELECT Id, Name, Company, City, Status, CreatedDate FROM Lead ORDER BY CreatedDate DESC LIMIT ${limit}`,
  );
  return result.records;
}

export async function fetchRecentAccounts(
  limit = 10,
): Promise<SalesforceAccount[]> {
  const result = await runSoql<SalesforceAccount>(
    `SELECT Id, Name, BillingCity, CreatedDate FROM Account WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate DESC LIMIT ${limit}`,
  );
  return result.records;
}
