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
};

export type DashboardModel = {
  updatedAt: string;
  metrics: DashboardMetric[];
  weeklyRevenue: ChartDay[];
  cities: CityRow[];
  activities: ActivityItem[];
  sources: DataSourceStatus;
};
