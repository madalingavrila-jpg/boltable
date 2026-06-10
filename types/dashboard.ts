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
  looker: "ok" | "missing_credentials" | "error";
  salesforce: "ok" | "missing_credentials" | "error";
  lookerMessage?: string;
  salesforceMessage?: string;
};

export type DashboardModel = {
  updatedAt: string;
  metrics: DashboardMetric[];
  weeklyRevenue: ChartDay[];
  cities: CityRow[];
  activities: ActivityItem[];
  sources: DataSourceStatus;
};
