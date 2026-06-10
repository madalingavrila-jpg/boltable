import { readFile } from "node:fs/promises";
import path from "node:path";
import { config } from "../config.js";
import type {
  ActivityItem,
  ChartDay,
  CityRow,
  DashboardMetric,
  DashboardModel,
  DashboardRawData,
  DataSourceStatus,
  LeadViewRow,
  OnboardingStageView,
  PartnerViewRow,
  PerformanceCategoryView,
  PerformanceKpiView,
  PerformanceRegionView,
  TrendDirection,
} from "../../../types/dashboard.js";


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

function trendDirection(value: number): TrendDirection {
  return value >= 0 ? "up" : "down";
}

function cityStatus(growthPct: number): { status: string; color: "primary" | "error" } {
  if (growthPct >= 8) return { status: "Optimal", color: "primary" };
  if (growthPct >= 0) return { status: "Stable", color: "primary" };
  return { status: "Review", color: "error" };
}

function activityIcon(type: string, icon?: string): Pick<ActivityItem, "icon" | "iconBg" | "iconColor"> {
  if (icon === "verified" || icon === "group_add") {
    return icon === "verified"
      ? {
          icon: "verified",
          iconBg: "bg-primary-container/20",
          iconColor: "text-primary",
        }
      : {
          icon: "group_add",
          iconBg: "bg-tertiary-container/20",
          iconColor: "text-tertiary",
        };
  }

  if (type === "account" || icon === "storefront") {
    return {
      icon: "storefront",
      iconBg: "bg-secondary-container/20",
      iconColor: "text-secondary",
    };
  }

  return {
    icon: "add_business",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
  };
}

function parseCsvRow(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === "," && !inQuotes) {
      values.push(current.trim());
      current = "";
      continue;
    }
    current += char;
  }

  values.push(current.trim());
  return values;
}

async function loadRawFromSheet(url: string): Promise<DashboardRawData> {
  const response = await fetch(url, {
    headers: { Accept: "text/csv, application/json" },
  });

  if (!response.ok) {
    throw new Error(`Sheet fetch failed (${response.status})`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as DashboardRawData;
  }

  const text = await response.text();
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    throw new Error("Published sheet CSV is empty");
  }

  const headers = parseCsvRow(lines[0]).map((header) => header.toLowerCase());
  const row = parseCsvRow(lines[1]);
  const record = Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]));

  return {
    updatedAt: record.updatedat || new Date().toISOString(),
    metrics: {
      totalRevenue: {
        value: Number(record.totalrevenue ?? 0),
        previousValue: Number(record.totalrevenueprev ?? 0),
        currency: "EUR",
        changePercent: Number(record.totalrevenuechange ?? 0),
        period: "30d",
      },
      activePartners: {
        value: Number(record.activepartners ?? 0),
        previousValue: Number(record.activepartnersprev ?? 0),
        changePercent: Number(record.activepartnerschange ?? 0),
      },
      activeCities: Number(record.activecities ?? 0),
      newLeadsMtd: {
        value: Number(record.newleadsmtd ?? 0),
        previousValue: Number(record.newleadsprev ?? 0),
        changePercent: Number(record.newleadschange ?? 0),
      },
      marketGrowth: {
        value: Number(record.marketgrowth ?? 0),
      },
    },
    weeklyRevenue: [],
    topCities: [],
    recentActivities: [],
  };
}

async function loadRawData(): Promise<{ data: DashboardRawData; source: DataSourceStatus }> {
  if (config.dashboardSheetUrl) {
    try {
      const data = await loadRawFromSheet(config.dashboardSheetUrl);
      return {
        data,
        source: { source: "sheet", path: config.dashboardSheetUrl },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sheet load failed";
      throw new Error(message);
    }
  }

  const filePath = path.join(config.rootDir, "data", "dashboard.json");
  const raw = await readFile(filePath, "utf8");
  return {
    data: JSON.parse(raw) as DashboardRawData,
    source: { source: "json", path: "data/dashboard.json" },
  };
}

function buildMetrics(data: DashboardRawData): DashboardMetric[] {
  const { metrics } = data;
  const revenueChange = metrics.totalRevenue.changePercent;
  const partnerChange = metrics.activePartners.changePercent;
  const leadChange = metrics.newLeadsMtd.changePercent;
  const marketGrowth = metrics.marketGrowth.value;

  return [
    {
      icon: "payments",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
      trend: trendDirection(revenueChange),
      trendIcon: revenueChange >= 0 ? "trending_up" : "trending_down",
      trendValue: formatSignedPct(revenueChange),
      label: "Total Revenue",
      value: formatEur(metrics.totalRevenue.value),
      subtitle: metrics.totalRevenue.previousValue
        ? `vs. ${formatCompactEur(metrics.totalRevenue.previousValue)} prior 30 days`
        : `${metrics.totalRevenue.period} GMV`,
    },
    {
      icon: "restaurant",
      iconBg: "bg-secondary-container/20",
      iconColor: "text-secondary",
      trend: trendDirection(partnerChange),
      trendIcon: partnerChange >= 0 ? "trending_up" : "trending_down",
      trendValue: formatSignedPct(partnerChange),
      label: "Active Partners",
      value: formatInteger(metrics.activePartners.value),
      subtitle: `Across ${formatInteger(metrics.activeCities)} active cities`,
    },
    {
      icon: "group_add",
      iconBg: "bg-tertiary-container/20",
      iconColor: "text-tertiary",
      trend: trendDirection(leadChange),
      trendIcon: leadChange >= 0 ? "trending_up" : "trending_down",
      trendValue: formatSignedPct(leadChange),
      label: "New Leads (MTD)",
      value: formatInteger(metrics.newLeadsMtd.value),
      subtitle: metrics.newLeadsMtd.previousValue
        ? `vs. ${formatInteger(metrics.newLeadsMtd.previousValue)} last month`
        : "Month to date",
    },
    {
      icon: "insights",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      trend: trendDirection(marketGrowth),
      trendIcon: marketGrowth >= 0 ? "add" : "remove",
      trendValue: formatSignedPct(marketGrowth),
      label: "Market Growth %",
      value: formatSignedPct(marketGrowth),
      subtitle: "30-day GMV vs previous 30 days",
    },
  ];
}

function buildWeeklyRevenue(data: DashboardRawData): ChartDay[] {
  const values = data.weeklyRevenue.map((entry) => entry.value);
  const maxDaily = Math.max(...values, 1);
  const avgDaily = values.reduce((sum, value) => sum + value, 0) / Math.max(values.length, 1);

  return data.weeklyRevenue.map((entry) => ({
    label: entry.day,
    actualHeight: `${Math.max(8, Math.round((entry.value / maxDaily) * 100))}%`,
    targetHeight: `${Math.max(8, Math.round((avgDaily / maxDaily) * 100))}%`,
    tooltip: formatCompactEur(entry.value),
  }));
}

function buildCities(data: DashboardRawData): CityRow[] {
  return data.topCities.slice(0, 8).map((entry) => {
    const status = cityStatus(entry.growthPercent);
    const name = entry.country ? `${entry.city}, ${entry.country}` : entry.city;

    return {
      name,
      revenue: formatEur(entry.revenue),
      revenueValue: entry.revenue,
      growth: formatSignedPct(entry.growthPercent),
      growthType: trendDirection(entry.growthPercent),
      avgOrder: entry.avgOrder ? formatEurPrecise(entry.avgOrder) : "—",
      status: status.status,
      statusColor: status.color,
    };
  });
}

function buildActivities(data: DashboardRawData): ActivityItem[] {
  return data.recentActivities
    .slice()
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 8)
    .map((entry) => ({
      ...activityIcon(entry.type, entry.icon),
      title: entry.title,
      meta: entry.meta ?? entry.type,
      createdAt: entry.time,
    }));
}

function partnerStatusLabel(status: string): {
  label: string;
  color: "primary" | "error" | "secondary";
} {
  if (status === "active") return { label: "Active", color: "primary" };
  if (status === "paused") return { label: "Paused", color: "error" };
  return { label: "New", color: "secondary" };
}

function partnerTierStyle(tier: string): { label: string; color: string } {
  if (tier === "enterprise") {
    return { label: "Enterprise", color: "bg-primary-container/30 text-on-primary-container" };
  }
  if (tier === "growth") {
    return { label: "Growth", color: "bg-secondary-container/30 text-secondary" };
  }
  return { label: "Standard", color: "bg-surface-container-high text-on-surface-variant" };
}

function buildPartners(data: DashboardRawData): PartnerViewRow[] {
  return (data.partners ?? [])
    .slice()
    .sort((a, b) => b.revenue30d - a.revenue30d)
    .map((entry) => {
      const status = partnerStatusLabel(entry.status);
      const tier = partnerTierStyle(entry.tier);
      return {
        id: entry.id,
        name: entry.name,
        location: `${entry.city}, ${entry.country}`,
        revenue: formatEur(entry.revenue30d),
        revenueValue: entry.revenue30d,
        orders: formatInteger(entry.orders30d),
        rating: entry.rating.toFixed(1),
        status: status.label,
        statusColor: status.color,
        tier: tier.label,
        tierColor: tier.color,
        cuisine: entry.cuisine ?? "Multi-cuisine",
      };
    });
}

function formatKpiValue(value: number, unit: string): string {
  if (unit === "eur") return formatEurPrecise(value);
  if (unit === "percent") return `${value.toFixed(1)}%`;
  if (unit === "minutes") return `${Math.round(value)} min`;
  return formatInteger(value);
}

function kpiIconStyle(icon: string): { iconBg: string; iconColor: string } {
  const styles: Record<string, { iconBg: string; iconColor: string }> = {
    speed: { iconBg: "bg-primary-container/20", iconColor: "text-primary" },
    shopping_cart: { iconBg: "bg-secondary-container/20", iconColor: "text-secondary" },
    percent: { iconBg: "bg-tertiary-container/20", iconColor: "text-tertiary" },
    timer: { iconBg: "bg-primary/10", iconColor: "text-primary" },
  };
  return styles[icon] ?? styles.speed;
}

function buildPerformance(data: DashboardRawData): DashboardModel["performance"] {
  const perf = data.performance;
  const kpis: PerformanceKpiView[] = (perf?.kpis ?? []).map((kpi) => {
    const change = kpi.previousValue
      ? pctChange(kpi.value, kpi.previousValue)
      : 0;
    const style = kpiIconStyle(kpi.icon);
    return {
      label: kpi.label,
      value: formatKpiValue(kpi.value, kpi.unit),
      change: formatSignedPct(change),
      trend: trendDirection(change),
      icon: kpi.icon,
      iconBg: style.iconBg,
      iconColor: style.iconColor,
    };
  });

  const maxShare = Math.max(...(perf?.categories ?? []).map((c) => c.sharePercent), 1);
  const categories: PerformanceCategoryView[] = (perf?.categories ?? []).map((cat) => ({
    name: cat.name,
    revenue: formatEur(cat.revenue),
    sharePercent: cat.sharePercent,
    barWidth: `${Math.max(8, Math.round((cat.sharePercent / maxShare) * 100))}%`,
  }));

  const regions: PerformanceRegionView[] = (perf?.regions ?? []).map((region) => ({
    name: region.name,
    revenue: formatEur(region.revenue),
    growth: formatSignedPct(region.growthPercent),
    growthType: trendDirection(region.growthPercent),
    partners: formatInteger(region.partners),
  }));

  return { kpis, categories, regions };
}

function leadStatusStyle(status: string): { label: string; color: string } {
  const map: Record<string, { label: string; color: string }> = {
    new: { label: "New", color: "bg-tertiary-container/30 text-tertiary" },
    contacted: { label: "Contacted", color: "bg-secondary-container/30 text-secondary" },
    negotiation: { label: "Negotiation", color: "bg-primary-container/30 text-on-primary-container" },
    contract: { label: "Contract", color: "bg-primary/20 text-primary" },
    live: { label: "Live", color: "trend-up" },
  };
  return map[status] ?? map.new;
}

function leadPriorityStyle(priority: string): { label: string; color: string } {
  if (priority === "high") return { label: "High", color: "trend-down" };
  if (priority === "medium") return { label: "Medium", color: "bg-secondary-container/30 text-secondary" };
  return { label: "Low", color: "bg-surface-container-high text-on-surface-variant" };
}

function buildOnboarding(data: DashboardRawData): DashboardModel["onboarding"] {
  const onboarding = data.onboarding;
  const maxCount = Math.max(...(onboarding?.pipeline ?? []).map((s) => s.count), 1);

  const pipeline: OnboardingStageView[] = (onboarding?.pipeline ?? []).map((stage) => ({
    stage: stage.stage,
    count: formatInteger(stage.count),
    change: formatSignedPct(stage.changePercent),
    trend: trendDirection(stage.changePercent),
    barWidth: `${Math.max(8, Math.round((stage.count / maxCount) * 100))}%`,
  }));

  const leads: LeadViewRow[] = (onboarding?.leads ?? []).map((lead) => {
    const status = leadStatusStyle(lead.status);
    const priority = leadPriorityStyle(lead.priority);
    return {
      id: lead.id,
      company: lead.company,
      city: lead.city,
      status: status.label,
      statusColor: status.color,
      owner: lead.owner,
      priority: priority.label,
      priorityColor: priority.color,
      createdAt: lead.createdAt,
      cuisine: lead.cuisine ?? "Restaurant",
    };
  });

  return {
    pipeline,
    leads,
    recentConversions: onboarding?.recentConversions ?? 0,
    avgTimeToLiveDays: onboarding?.avgTimeToLiveDays ?? 0,
    conversionRate: onboarding?.conversionRate ?? 0,
  };
}

function defaultSettings(): DashboardModel["settings"] {
  return {
    timezone: "Europe/Bucharest",
    locale: "en-GB",
    notifications: [],
    integrations: [],
  };
}

function buildSettings(data: DashboardRawData): DashboardModel["settings"] {
  const settings = data.settings;
  if (!settings) return defaultSettings();
  return {
    timezone: settings.timezone,
    locale: settings.locale,
    notifications: settings.notifications,
    integrations: settings.integrations,
  };
}

const emptyPerformance: DashboardModel["performance"] = {
  kpis: [],
  categories: [],
  regions: [],
};

const emptyOnboarding: DashboardModel["onboarding"] = {
  pipeline: [],
  leads: [],
  recentConversions: 0,
  avgTimeToLiveDays: 0,
  conversionRate: 0,
};

function placeholderModel(source: DataSourceStatus, error?: string): DashboardModel {
  const message =
    error ??
    "Update data/dashboard.json in the repo (via Cursor MCP workflow) and redeploy.";

  return {
    updatedAt: new Date().toISOString(),
    sources: source,
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
    partners: [],
    performance: emptyPerformance,
    onboarding: emptyOnboarding,
    settings: defaultSettings(),
  };
}

function toDashboardModel(
  data: DashboardRawData,
  source: DataSourceStatus,
): DashboardModel {
  return {
    updatedAt: data.updatedAt,
    metrics: buildMetrics(data),
    weeklyRevenue: buildWeeklyRevenue(data),
    cities: buildCities(data),
    activities: buildActivities(data),
    partners: buildPartners(data),
    performance: buildPerformance(data),
    onboarding: buildOnboarding(data),
    settings: buildSettings(data),
    sources: source,
  };
}

let cachedModel: { expiresAt: number; value: DashboardModel } | null = null;

export async function loadDashboardModel(): Promise<DashboardModel> {
  const now = Date.now();
  if (cachedModel && cachedModel.expiresAt > now) {
    return cachedModel.value;
  }

  try {
    const { data, source } = await loadRawData();
    const model = toDashboardModel(data, source);
    cachedModel = { value: model, expiresAt: now + config.cacheTtlMs };
    return model;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Dashboard load failed";
    const model = placeholderModel({ source: "error", message }, message);
    cachedModel = { value: model, expiresAt: now + 15_000 };
    return model;
  }
}

export { pctChange, formatSignedPct };
