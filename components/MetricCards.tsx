type MetricCard = {
  icon: string;
  iconBg: string;
  iconColor: string;
  trend: "up" | "down";
  trendIcon: string;
  trendValue: string;
  label: string;
  value: string;
  subtitle: string;
};

const metrics: MetricCard[] = [
  {
    icon: "payments",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
    trend: "up",
    trendIcon: "trending_up",
    trendValue: "12.5%",
    label: "Total Revenue",
    value: "€4,821,090",
    subtitle: "vs. €4.28M last month",
  },
  {
    icon: "restaurant",
    iconBg: "bg-secondary-container/20",
    iconColor: "text-secondary",
    trend: "up",
    trendIcon: "trending_up",
    trendValue: "8.2%",
    label: "Active Partners",
    value: "18,542",
    subtitle: "Across 42 major cities",
  },
  {
    icon: "group_add",
    iconBg: "bg-tertiary-container/20",
    iconColor: "text-tertiary",
    trend: "down",
    trendIcon: "trending_down",
    trendValue: "2.4%",
    label: "New Leads (MTD)",
    value: "1,208",
    subtitle: "Avg. conversion: 14%",
  },
  {
    icon: "insights",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
    trend: "up",
    trendIcon: "add",
    trendValue: "3.1%",
    label: "Market Growth %",
    value: "24.8%",
    subtitle: "Exceeding quarterly target",
  },
];

export function MetricCards() {
  return (
    <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="glass-card cursor-default rounded-xl p-md transition-colors hover:bg-surface-container-low"
        >
          <div className="mb-sm flex items-start justify-between">
            <div className={`rounded-lg p-xs ${metric.iconBg}`}>
              <span
                className={`material-symbols-outlined ${metric.iconColor}`}
              >
                {metric.icon}
              </span>
            </div>
            <span
              className={`flex items-center gap-[2px] rounded-full px-xs py-[2px] text-[10px] font-bold ${
                metric.trend === "up" ? "trend-up" : "trend-down"
              }`}
            >
              <span className="material-symbols-outlined text-[12px]">
                {metric.trendIcon}
              </span>
              {metric.trendValue}
            </span>
          </div>
          <p className="text-label-md font-label-md font-medium text-on-surface-variant">
            {metric.label}
          </p>
          <h3 className="mt-xs text-headline-md font-headline-md font-extrabold text-on-surface">
            {metric.value}
          </h3>
          <p className="mt-xs text-label-md font-label-md text-on-surface-variant opacity-60">
            {metric.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}
