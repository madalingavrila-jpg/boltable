import { config } from "../config.js";
let cachedToken = null;
async function getAccessToken() {
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
    const response = await fetch(`${config.salesforce.loginUrl.replace(/\/$/, "")}/services/oauth2/token`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
    });
    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Salesforce auth failed (${response.status}): ${text}`);
    }
    const payload = (await response.json());
    cachedToken = {
        value: payload.access_token,
        instanceUrl: payload.instance_url,
        expiresAt: now + 55 * 60 * 1000,
    };
    return { token: payload.access_token, instanceUrl: payload.instance_url };
}
export async function runSoql(query) {
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
    return (await response.json());
}
export async function countLeads(filter) {
    const result = await runSoql(`SELECT COUNT() FROM Lead WHERE ${filter}`);
    return result.totalSize;
}
export async function fetchRecentLeads(limit = 10) {
    const result = await runSoql(`SELECT Id, Name, Company, City, Status, CreatedDate FROM Lead ORDER BY CreatedDate DESC LIMIT ${limit}`);
    return result.records;
}
export async function fetchRecentAccounts(limit = 10) {
    const result = await runSoql(`SELECT Id, Name, BillingCity, CreatedDate FROM Account WHERE CreatedDate = LAST_N_DAYS:7 ORDER BY CreatedDate DESC LIMIT ${limit}`);
    return result.records;
}
//# sourceMappingURL=salesforce.js.map