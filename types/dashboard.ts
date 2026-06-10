export type TrendDirection = "up" | "down";

export type DashboardMetric = {
  icon: string;
  iconBg: string;
  iconColor: string;
  trend: TrendDirection;
  trendIcon: string;
  trendValue: string;
  label: string;
  value: string;
  subtitle: string;
};

export type ChartDay = {
  label: string;
  targetHeight: string;
  actualHeight: string;
  tooltip?: string;
};

export type CityRow = {
  name: string;
  revenue: string;
  revenueValue: number;
  growth: string;
  growthType: TrendDirection;
  avgOrder: string;
  status: string;
  statusColor: "primary" | "error";
};

export type ActivityItem = {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  meta: string;
  createdAt: string;
};

export type DataSourceStatus = {
  source: "json" | "sheet" | "error";
  path?: string;
  message?: string;
};

export type DashboardRawMetric = {
  value: number;
  previousValue?: number;
  changePercent: number;
};

export type PartnerRow = {
  id: string;
  name: string;
  city: string;
  country: string;
  revenue30d: number;
  orders30d: number;
  rating: number;
  status: "active" | "paused" | "new";
  tier: "enterprise" | "growth" | "standard";
  cuisine?: string;
};

export type PerformanceKpi = {
  label: string;
  value: number;
  previousValue?: number;
  unit: "eur" | "percent" | "minutes" | "count";
  icon: string;
};

export type PerformanceCategory = {
  name: string;
  revenue: number;
  sharePercent: number;
};

export type PerformanceRegion = {
  name: string;
  revenue: number;
  growthPercent: number;
  partners: number;
};

export type OnboardingStage = {
  stage: string;
  count: number;
  changePercent: number;
};

export type LeadRow = {
  id: string;
  company: string;
  city: string;
  status: "new" | "contacted" | "negotiation" | "contract" | "live";
  createdAt: string;
  owner: string;
  priority: "high" | "medium" | "low";
  cuisine?: string;
};

export type NotificationSetting = {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
};

export type IntegrationSetting = {
  name: string;
  status: "connected" | "warning" | "disconnected";
  lastSync: string;
  icon: string;
};

export type DashboardRawData = {
  updatedAt: string;
  metrics: {
    totalRevenue: DashboardRawMetric & {
      currency: string;
      period: string;
    };
    activePartners: DashboardRawMetric;
    activeCities: number;
    newLeadsMtd: DashboardRawMetric;
    marketGrowth: { value: number };
  };
  weeklyRevenue: Array<{ day: string; date?: string; value: number }>;
  topCities: Array<{
    city: string;
    country?: string;
    revenue: number;
    growthPercent: number;
    avgOrder?: number;
  }>;
  recentActivities: Array<{
    type: "lead" | "account";
    title: string;
    time: string;
    icon?: string;
    meta?: string;
  }>;
  partners?: PartnerRow[];
  performance?: {
    kpis: PerformanceKpi[];
    categories: PerformanceCategory[];
    regions: PerformanceRegion[];
  };
  onboarding?: {
    pipeline: OnboardingStage[];
    leads: LeadRow[];
    recentConversions: number;
    avgTimeToLiveDays: number;
    conversionRate: number;
  };
  settings?: {
    timezone: string;
    locale: string;
    notifications: NotificationSetting[];
    integrations: IntegrationSetting[];
  };
};

export type PartnerViewRow = {
  id: string;
  name: string;
  location: string;
  revenue: string;
  revenueValue: number;
  orders: string;
  rating: string;
  status: string;
  statusColor: "primary" | "error" | "secondary";
  tier: string;
  tierColor: string;
  cuisine: string;
};

export type PerformanceKpiView = {
  label: string;
  value: string;
  change: string;
  trend: TrendDirection;
  icon: string;
  iconBg: string;
  iconColor: string;
};

export type PerformanceCategoryView = {
  name: string;
  revenue: string;
  sharePercent: number;
  barWidth: string;
};

export type PerformanceRegionView = {
  name: string;
  revenue: string;
  growth: string;
  growthType: TrendDirection;
  partners: string;
};

export type OnboardingStageView = {
  stage: string;
  count: string;
  change: string;
  trend: TrendDirection;
  barWidth: string;
};

export type LeadViewRow = {
  id: string;
  company: string;
  city: string;
  status: string;
  statusColor: string;
  owner: string;
  priority: string;
  priorityColor: string;
  createdAt: string;
  cuisine: string;
};

export type DashboardModel = {
  updatedAt: string;
  metrics: DashboardMetric[];
  weeklyRevenue: ChartDay[];
  cities: CityRow[];
  activities: ActivityItem[];
  partners: PartnerViewRow[];
  performance: {
    kpis: PerformanceKpiView[];
    categories: PerformanceCategoryView[];
    regions: PerformanceRegionView[];
  };
  onboarding: {
    pipeline: OnboardingStageView[];
    leads: LeadViewRow[];
    recentConversions: number;
    avgTimeToLiveDays: number;
    conversionRate: number;
  };
  settings: {
    timezone: string;
    locale: string;
    notifications: NotificationSetting[];
    integrations: IntegrationSetting[];
  };
  sources: DataSourceStatus;
};
