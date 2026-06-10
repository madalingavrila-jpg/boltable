"use client";

import type {
  PerformanceCategoryView,
  PerformanceKpiView,
  PerformanceRegionView,
} from "@/types/dashboard";

type PerformanceKpisProps = {
  kpis?: PerformanceKpiView[];
  loading?: boolean;
};

export function PerformanceKpis({ kpis, loading }: PerformanceKpisProps) {
  if (loading && !kpis?.length) {
    return (
      <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="glass-card animate-pulse rounded-xl p-md">
            <div className="mb-sm h-8 w-8 rounded-lg bg-surface-container-high" />
            <div className="h-4 w-24 rounded bg-surface-container-high" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
      {kpis?.map((kpi) => (
        <div key={kpi.label} className="glass-card rounded-xl p-md">
          <div className="mb-sm flex items-start justify-between">
            <div className={`rounded-lg p-xs ${kpi.iconBg}`}>
              <span className={`material-symbols-outlined ${kpi.iconColor}`}>
                {kpi.icon}
              </span>
            </div>
            <span
              className={`flex items-center gap-[2px] rounded-full px-xs py-[2px] text-[10px] font-bold ${
                kpi.trend === "up" ? "trend-up" : "trend-down"
              }`}
            >
              <span className="material-symbols-outlined text-[12px]">
                {kpi.trend === "up" ? "trending_up" : "trending_down"}
              </span>
              {kpi.change}
            </span>
          </div>
          <p className="text-label-md font-label-md font-medium text-on-surface-variant">
            {kpi.label}
          </p>
          <h3 className="mt-xs text-headline-md font-headline-md font-extrabold text-on-surface">
            {kpi.value}
          </h3>
        </div>
      ))}
    </div>
  );
}

type CategoryBreakdownProps = {
  categories?: PerformanceCategoryView[];
  loading?: boolean;
};

export function CategoryBreakdown({ categories, loading }: CategoryBreakdownProps) {
  return (
    <div className="glass-card rounded-xl p-lg">
      <h3 className="mb-lg text-title-lg font-title-lg font-bold text-on-background">
        Revenue by Category
      </h3>
      {loading && !categories?.length ? (
        <p className="text-body-md font-body-md text-on-surface-variant">Loading…</p>
      ) : (
        <div className="space-y-md">
          {categories?.map((cat) => (
            <div key={cat.name}>
              <div className="mb-xs flex items-center justify-between">
                <span className="text-body-md font-body-md font-semibold">{cat.name}</span>
                <span className="text-data-mono font-data-mono">{cat.revenue}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: cat.barWidth }}
                />
              </div>
              <p className="mt-xs text-label-md font-label-md text-on-surface-variant">
                {cat.sharePercent.toFixed(1)}% of total GMV
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type RegionPerformanceProps = {
  regions?: PerformanceRegionView[];
  loading?: boolean;
};

export function RegionPerformance({ regions, loading }: RegionPerformanceProps) {
  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="border-b border-outline-variant bg-white p-lg">
        <h3 className="text-title-lg font-title-lg font-bold text-on-background">
          Regional Performance
        </h3>
        <p className="text-body-md font-body-md text-on-surface-variant">
          30-day GMV by market region
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Region
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Revenue
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Growth
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Partners
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading && !regions?.length ? (
              <tr>
                <td colSpan={4} className="px-lg py-xl text-center text-on-surface-variant">
                  Loading regions…
                </td>
              </tr>
            ) : (
              regions?.map((region) => (
                <tr key={region.name} className="hover:bg-surface-container-low">
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-sm">
                      <span className="material-symbols-outlined text-primary">public</span>
                      <span className="font-semibold">{region.name}</span>
                    </div>
                  </td>
                  <td className="px-lg py-md text-right text-data-mono font-data-mono">
                    {region.revenue}
                  </td>
                  <td className="px-lg py-md text-right">
                    <span
                      className={`rounded-full px-xs py-[2px] text-[12px] font-bold ${
                        region.growthType === "up" ? "trend-up" : "trend-down"
                      }`}
                    >
                      {region.growth}
                    </span>
                  </td>
                  <td className="px-lg py-md text-right text-data-mono font-data-mono text-on-surface-variant">
                    {region.partners}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
