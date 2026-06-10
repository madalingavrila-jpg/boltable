"use client";

import { PageHeader } from "@/components/PageHeader";
import { DataAlert } from "@/components/DataAlert";
import {
  PerformanceKpis,
  CategoryBreakdown,
  RegionPerformance,
} from "@/components/PerformancePage";
import { RevenueChart } from "@/components/RevenueChart";
import { useDashboard } from "@/lib/useDashboard";

export function PerformanceShell() {
  const { model, error, loading, sourceHint } = useDashboard();

  return (
    <div className="mx-auto max-w-[1400px] space-y-md">
      <PageHeader
        title="Performance Analytics"
        subtitle="Deep-dive into GMV, conversion, and regional velocity metrics."
        updatedAt={model?.updatedAt}
        loading={loading}
        actions={
          <div className="flex gap-xs rounded-lg bg-surface-container-low p-1">
            <button
              type="button"
              className="rounded-md bg-white px-sm py-xs text-label-md font-label-md font-bold text-primary shadow-sm"
            >
              7d
            </button>
            <button
              type="button"
              className="rounded-md px-sm py-xs text-label-md font-label-md text-on-surface-variant hover:bg-white/50"
            >
              30d
            </button>
            <button
              type="button"
              className="rounded-md px-sm py-xs text-label-md font-label-md text-on-surface-variant hover:bg-white/50"
            >
              90d
            </button>
          </div>
        }
      />

      <DataAlert error={error} sourceHint={sourceHint} />

      <PerformanceKpis kpis={model?.performance.kpis} loading={loading} />

      <div className="grid grid-cols-1 gap-md xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart data={model?.weeklyRevenue} loading={loading} />
        </div>
        <CategoryBreakdown
          categories={model?.performance.categories}
          loading={loading}
        />
      </div>

      <RegionPerformance regions={model?.performance.regions} loading={loading} />
    </div>
  );
}
