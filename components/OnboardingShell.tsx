"use client";

import { PageHeader } from "@/components/PageHeader";
import { DataAlert } from "@/components/DataAlert";
import {
  PipelineFunnel,
  OnboardingStats,
  LeadsTable,
} from "@/components/OnboardingPage";
import { ActivitiesFeed } from "@/components/ActivitiesFeed";
import { useDashboard } from "@/lib/useDashboard";

export function OnboardingShell() {
  const { model, error, loading, sourceHint } = useDashboard();

  return (
    <div className="mx-auto max-w-[1400px] space-y-md">
      <PageHeader
        title="Partner Onboarding"
        subtitle="Track leads, pipeline stages, and conversion velocity from Salesforce."
        updatedAt={model?.updatedAt}
        loading={loading}
      />

      <DataAlert error={error} sourceHint={sourceHint} />

      <OnboardingStats
        recentConversions={model?.onboarding.recentConversions}
        avgTimeToLiveDays={model?.onboarding.avgTimeToLiveDays}
        conversionRate={model?.onboarding.conversionRate}
        loading={loading}
      />

      <div className="grid grid-cols-1 gap-md xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PipelineFunnel pipeline={model?.onboarding.pipeline} loading={loading} />
        </div>
        <ActivitiesFeed activities={model?.activities} loading={loading} />
      </div>

      <LeadsTable leads={model?.onboarding.leads} loading={loading} />
    </div>
  );
}
