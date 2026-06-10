import type { DashboardMetric } from "@/types/dashboard";

type MetricCardsProps = {
  metrics?: DashboardMetric[];
  loading?: boolean;
};

function SkeletonCard() {
  return (
    <div className="glass-card animate-pulse rounded-xl p-md">
      <div className="mb-sm h-8 w-8 rounded-lg bg-surface-container-high" />
      <div className="mb-xs h-4 w-24 rounded bg-surface-container-high" />
      <div className="mb-xs h-8 w-32 rounded bg-surface-container-high" />
      <div className="h-3 w-40 rounded bg-surface-container-high" />
    </div>
  );
}

export function MetricCards({ metrics, loading }: MetricCardsProps) {
  if (loading && !metrics?.length) {
    return (
      <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (!metrics?.length) {
    return null;
  }

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
