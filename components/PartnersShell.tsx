"use client";

import { PageHeader } from "@/components/PageHeader";
import { DataAlert } from "@/components/DataAlert";
import { PartnerSummaryCards, PartnersTable } from "@/components/PartnersPage";
import { useDashboard } from "@/lib/useDashboard";

export function PartnersShell() {
  const { model, error, loading, sourceHint } = useDashboard();
  const partners = model?.partners ?? [];

  const activeCount = partners.filter((p) => p.status === "Active").length;
  const newCount = partners.filter((p) => p.status === "New").length;
  const avgRevenue =
    partners.length > 0
      ? partners.reduce((sum, p) => sum + p.revenueValue, 0) / partners.length
      : 0;

  return (
    <div className="mx-auto max-w-[1400px] space-y-md">
      <PageHeader
        title="Restaurant Partners"
        subtitle="Manage and monitor enterprise restaurant accounts across all markets."
        updatedAt={model?.updatedAt}
        loading={loading}
        actions={
          <div className="flex gap-xs">
            <button
              type="button"
              className="flex items-center gap-xs rounded-lg bg-surface-container px-sm py-2 text-label-md font-label-md"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export
            </button>
          </div>
        }
      />

      <DataAlert error={error} sourceHint={sourceHint} />

      <PartnerSummaryCards
        totalPartners={partners.length}
        activeCount={activeCount}
        newCount={newCount}
        avgRevenue={avgRevenue}
        loading={loading}
      />

      <PartnersTable partners={partners} loading={loading} />
    </div>
  );
}
