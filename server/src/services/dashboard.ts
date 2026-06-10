import {
  LOOKER_ACTIVE_CITIES_EXPLORE,
  LOOKER_ACTIVE_CITIES_FIELD,
  LOOKER_AVG_ORDER_FIELD,
  LOOKER_CITY_FIELD,
  LOOKER_COUNTRY_FIELD,
  LOOKER_DATE_FIELD,
  LOOKER_ACTIVE_VENDORS_FIELD,
  LOOKER_GMV_FIELD,
  LOOKER_ORDER_COUNT_FIELD,
  readNumber,
  runLookerQuery,
} from "../clients/looker.js";
import {
  countLeads,
  fetchRecentAccounts,
  fetchRecentLeads,
} from "../clients/salesforce.js";
import { config, lookerConfigured, salesforceConfigured } from "../config.js";
import type {
  ActivityItem,
  ChartDay,
  CityRow,
  DashboardMetric,
  DashboardModel,
  DataSourceStatus,
} from "../../../types/dashboard.js";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function pctChange(current: number, previous: number): number {
  if (previous <= 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

function formatSignedPct(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function formatEur(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatEurPrecise(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInteger(value: number): string {
  return new Intl.NumberFormat("en-IE").format(Math.round(value));
}

function formatCompactEur(value: number): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function dayLabelFromIso(date: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  return DAY_LABELS[parsed.getDay()] ?? date.slice(5);
}

function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function cityStatus(growthPct: number): { status: string; color: "primary" | "error" } {
  if (growthPct >= 8) return { status: "Optimal", color: "primary" };
  if (growthPct >= 0) return { status: "Stable", color: "primary" };
  return { status: "Review", color: "error" };
}

function leadIcon(status: string | null): {
  icon: string;
  iconBg: string;
  iconColor: string;
} {
  if (status === "Converted") {
    return {
      icon: "verified",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
    };
  }
  if (status === "Lead Check") {
    return {
      icon: "group_add",
      iconBg: "bg-tertiary-container/20",
      iconColor: "text-tertiary",
    };
  }
  return {
    icon: "add_business",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
  };
}

async function queryScalar(
  field: string,
  filter: string,
): Promise<number> {
  const rows = await runLookerQuery({
    fields: [field],
    filters: { [LOOKER_DATE_FIELD]: filter },
    limit: 1,
  });
  return rows.length ? readNumber(rows[0], field) : 0;
}

async function buildLookerSections(sources: DataSourceStatus): Promise<{
  metrics: DashboardMetric[];
  weeklyRevenue: ChartDay[];
  cities: CityRow[];
}> {
  const [
    revenue30d,
    revenuePrev30d,
    activeVendors,
    activeVendorsPrev,
    activeCitiesRows,
    dailyRows,
    cityCurrentRows,
    cityPrevRows,
  ] = await Promise.all([
    queryScalar(LOOKER_GMV_FIELD, "30 days"),
    queryScalar(LOOKER_GMV_FIELD, "60 days ago for 30 days"),
    queryScalar(LOOKER_ACTIVE_VENDORS_FIELD, "30 days"),
    queryScalar(LOOKER_ACTIVE_VENDORS_FIELD, "60 days ago for 30 days"),
    runLookerQuery({
      explore: LOOKER_ACTIVE_CITIES_EXPLORE,
      fields: [LOOKER_ACTIVE_CITIES_FIELD],
      filters: { [LOOKER_ACTIVE_CITIES_FIELD]: "Yes" },
      limit: 5000,
    }),
    runLookerQuery({
      fields: [LOOKER_DATE_FIELD, LOOKER_GMV_FIELD],
      filters: { [LOOKER_DATE_FIELD]: "7 days" },
      sorts: [`${LOOKER_DATE_FIELD} asc`],
      limit: 7,
    }),
    runLookerQuery({
      fields: [
        LOOKER_CITY_FIELD,
        LOOKER_COUNTRY_FIELD,
        LOOKER_GMV_FIELD,
        LOOKER_ORDER_COUNT_FIELD,
        LOOKER_AVG_ORDER_FIELD,
      ],
      filters: { [LOOKER_DATE_FIELD]: "7 days" },
      sorts: [`${LOOKER_GMV_FIELD} desc`],
      limit: 10,
    }),
    runLookerQuery({
      fields: [LOOKER_CITY_FIELD, LOOKER_GMV_FIELD],
      filters: { [LOOKER_DATE_FIELD]: "14 days ago for 7 days" },
      limit: 500,
    }),
  ]);

  sources.looker = "ok";

  const revenueGrowth = pctChange(revenue30d, revenuePrev30d);
  const vendorGrowth = pctChange(activeVendors, activeVendorsPrev);
  const activeCities = activeCitiesRows.length;

  const prevByCity = new Map<string, number>();
  for (const row of cityPrevRows) {
    const city = String(row[LOOKER_CITY_FIELD] ?? "");
    if (!city) continue;
    prevByCity.set(city, readNumber(row, LOOKER_GMV_FIELD));
  }

  const dailyValues = dailyRows.map((row) => readNumber(row, LOOKER_GMV_FIELD));
  const maxDaily = Math.max(...dailyValues, 1);
  const avgDaily =
    dailyValues.reduce((sum, value) => sum + value, 0) /
    Math.max(dailyValues.length, 1);

  const weeklyRevenue: ChartDay[] = dailyRows.map((row) => {
    const actual = readNumber(row, LOOKER_GMV_FIELD);
    const date = String(row[LOOKER_DATE_FIELD] ?? "");
    return {
      label: dayLabelFromIso(date),
      actualHeight: `${Math.max(8, Math.round((actual / maxDaily) * 100))}%`,
      targetHeight: `${Math.max(8, Math.round((avgDaily / maxDaily) * 100))}%`,
      tooltip: formatCompactEur(actual),
    };
  });

  const cities: CityRow[] = cityCurrentRows.slice(0, 8).map((row) => {
    const city = String(row[LOOKER_CITY_FIELD] ?? "Unknown");
    const country = String(row[LOOKER_COUNTRY_FIELD] ?? "");
    const revenueValue = readNumber(row, LOOKER_GMV_FIELD);
    const prevRevenue = prevByCity.get(city) ?? 0;
    const growthPct = pctChange(revenueValue, prevRevenue);
    const avgOrder = readNumber(row, LOOKER_AVG_ORDER_FIELD);
    const status = cityStatus(growthPct);

    return {
      name: country ? `${city}, ${country}` : city,
      revenue: formatEur(revenueValue),
      revenueValue,
      growth: formatSignedPct(growthPct),
      growthType: growthPct >= 0 ? "up" : "down",
      avgOrder: formatEurPrecise(avgOrder),
      status: status.status,
      statusColor: status.color,
    };
  });

  const metrics: DashboardMetric[] = [
    {
      icon: "payments",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
      trend: revenueGrowth >= 0 ? "up" : "down",
      trendIcon: revenueGrowth >= 0 ? "trending_up" : "trending_down",
      trendValue: formatSignedPct(revenueGrowth),
      label: "Total Revenue",
      value: formatEur(revenue30d),
      subtitle: `vs. ${formatCompactEur(revenuePrev30d)} prior 30 days`,
    },
    {
      icon: "restaurant",
      iconBg: "bg-secondary-container/20",
      iconColor: "text-secondary",
      trend: vendorGrowth >= 0 ? "up" : "down",
      trendIcon: vendorGrowth >= 0 ? "trending_up" : "trending_down",
      trendValue: formatSignedPct(vendorGrowth),
      label: "Active Partners",
      value: formatInteger(activeVendors),
      subtitle: `Across ${formatInteger(activeCities)} active cities`,
    },
    {
      icon: "group_add",
      iconBg: "bg-tertiary-container/20",
      iconColor: "text-tertiary",
      trend: "up",
      trendIcon: "trending_up",
      trendValue: "—",
      label: "New Leads (MTD)",
      value: "—",
      subtitle: "Loaded from Salesforce",
    },
    {
      icon: "insights",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: revenueGrowth >= 0 ? "up" : "down",
      trendIcon: revenueGrowth >= 0 ? "add" : "remove",
      trendValue: formatSignedPct(revenueGrowth),
      label: "Market Growth %",
      value: formatSignedPct(revenueGrowth),
      subtitle: "30-day GMV vs previous 30 days",
    },
  ];

  return { metrics, weeklyRevenue, cities };
}

async function applySalesforceMetrics(
  metrics: DashboardMetric[],
  sources: DataSourceStatus,
): Promise<ActivityItem[]> {
  const [leadsMtd, leadsPrevMonth, recentLeads, recentAccounts] =
    await Promise.all([
      countLeads("CreatedDate = THIS_MONTH"),
      countLeads("CreatedDate = LAST_MONTH"),
      fetchRecentLeads(6),
      fetchRecentAccounts(4),
    ]);

  sources.salesforce = "ok";

  const leadGrowth = pctChange(leadsMtd, leadsPrevMonth);
  const leadMetric = metrics.find((metric) => metric.label === "New Leads (MTD)");
  if (leadMetric) {
    leadMetric.value = formatInteger(leadsMtd);
    leadMetric.trend = leadGrowth >= 0 ? "up" : "down";
    leadMetric.trendIcon = leadGrowth >= 0 ? "trending_up" : "trending_down";
    leadMetric.trendValue = formatSignedPct(leadGrowth);
    leadMetric.subtitle = `vs. ${formatInteger(leadsPrevMonth)} last month`;
  }

  const activities: ActivityItem[] = [];

  for (const lead of recentLeads) {
    const company = lead.Company?.trim() || lead.Name;
    const icon = leadIcon(lead.Status);
    activities.push({
      ...icon,
      title:
        lead.Status === "Converted"
          ? `"${company}" converted to partner.`
          : `New lead "${company}" received.`,
      meta: `${relativeTime(lead.CreatedDate)} • ${lead.City?.trim() || "Salesforce"}`,
      createdAt: lead.CreatedDate,
    });
  }

  for (const account of recentAccounts) {
    activities.push({
      icon: "storefront",
      iconBg: "bg-secondary-container/20",
      iconColor: "text-secondary",
      title: `"${account.Name}" onboarded as restaurant partner.`,
      meta: `${relativeTime(account.CreatedDate)} • ${account.BillingCity?.trim() || "New account"}`,
      createdAt: account.CreatedDate,
    });
  }

  activities.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return activities.slice(0, 8);
}

function placeholderModel(
  sources: DataSourceStatus,
  error?: string,
): DashboardModel {
  const message =
    error ??
    "Configure LOOKER_* and SALESFORCE_* secrets in Boltable to load live metrics.";

  return {
    updatedAt: new Date().toISOString(),
    sources,
    metrics: [
      {
        icon: "payments",
        iconBg: "bg-primary-container/20",
        iconColor: "text-primary",
        trend: "up",
        trendIcon: "trending_up",
        trendValue: "—",
        label: "Total Revenue",
        value: "—",
        subtitle: message,
      },
      {
        icon: "restaurant",
        iconBg: "bg-secondary-container/20",
        iconColor: "text-secondary",
        trend: "up",
        trendIcon: "trending_up",
        trendValue: "—",
        label: "Active Partners",
        value: "—",
        subtitle: message,
      },
      {
        icon: "group_add",
        iconBg: "bg-tertiary-container/20",
        iconColor: "text-tertiary",
        trend: "down",
        trendIcon: "trending_down",
        trendValue: "—",
        label: "New Leads (MTD)",
        value: "—",
        subtitle: message,
      },
      {
        icon: "insights",
        iconBg: "bg-primary/10",
        iconColor: "text-primary",
        trend: "up",
        trendIcon: "add",
        trendValue: "—",
        label: "Market Growth %",
        value: "—",
        subtitle: message,
      },
    ],
    weeklyRevenue: [],
    cities: [],
    activities: [],
  };
}

let cachedModel: { expiresAt: number; value: DashboardModel } | null = null;

export async function loadDashboardModel(): Promise<DashboardModel> {
  const now = Date.now();
  if (cachedModel && cachedModel.expiresAt > now) {
    return cachedModel.value;
  }

  const sources: DataSourceStatus = {
    looker: lookerConfigured() ? "ok" : "missing_credentials",
    salesforce: salesforceConfigured() ? "ok" : "missing_credentials",
  };

  if (!lookerConfigured() && !salesforceConfigured()) {
    const model = placeholderModel(sources);
    cachedModel = { value: model, expiresAt: now + 15_000 };
    return model;
  }

  try {
    let metrics: DashboardMetric[] = [];
    let weeklyRevenue: ChartDay[] = [];
    let cities: CityRow[] = [];
    let activities: ActivityItem[] = [];

    if (lookerConfigured()) {
      try {
        ({ metrics, weeklyRevenue, cities } = await buildLookerSections(sources));
      } catch (error) {
        sources.looker = "error";
        sources.lookerMessage =
          error instanceof Error ? error.message : "Looker query failed";
      }
    }

    if (salesforceConfigured()) {
      try {
        activities = await applySalesforceMetrics(metrics, sources);
      } catch (error) {
        sources.salesforce = "error";
        sources.salesforceMessage =
          error instanceof Error ? error.message : "Salesforce query failed";
      }
    }

    if (!metrics.length) {
      const model = placeholderModel(sources, sources.lookerMessage);
      cachedModel = { value: model, expiresAt: now + 15_000 };
      return model;
    }

    const model: DashboardModel = {
      updatedAt: new Date().toISOString(),
      metrics,
      weeklyRevenue,
      cities,
      activities,
      sources,
    };

    cachedModel = { value: model, expiresAt: now + config.cacheTtlMs };
    return model;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dashboard load failed";
    const model = placeholderModel(sources, message);
    cachedModel = { value: model, expiresAt: now + 15_000 };
    return model;
  }
}
