"use client";

import type { LeadViewRow, OnboardingStageView } from "@/types/dashboard";
import { formatInteger } from "@/lib/format";
import { relativeTime } from "@/lib/format";

type PipelineFunnelProps = {
  pipeline?: OnboardingStageView[];
  loading?: boolean;
};

export function PipelineFunnel({ pipeline, loading }: PipelineFunnelProps) {
  return (
    <div className="glass-card rounded-xl p-lg">
      <h3 className="mb-lg text-title-lg font-title-lg font-bold text-on-background">
        Onboarding Pipeline
      </h3>
      {loading && !pipeline?.length ? (
        <p className="text-on-surface-variant">Loading pipeline…</p>
      ) : (
        <div className="space-y-sm">
          {pipeline?.map((stage, index) => (
            <div key={stage.stage} className="flex items-center gap-md">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-container text-label-md font-label-md font-bold text-on-primary-container">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="mb-xs flex items-center justify-between">
                  <span className="text-body-md font-body-md font-semibold">
                    {stage.stage}
                  </span>
                  <div className="flex items-center gap-sm">
                    <span className="text-data-mono font-data-mono font-bold">
                      {stage.count}
                    </span>
                    <span
                      className={`rounded-full px-xs py-[2px] text-[10px] font-bold ${
                        stage.trend === "up" ? "trend-up" : "trend-down"
                      }`}
                    >
                      {stage.change}
                    </span>
                  </div>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-container">
                  <div
                    className="h-full rounded-full bg-primary-container transition-all"
                    style={{ width: stage.barWidth }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type OnboardingStatsProps = {
  recentConversions?: number;
  avgTimeToLiveDays?: number;
  conversionRate?: number;
  loading?: boolean;
};

export function OnboardingStats({
  recentConversions,
  avgTimeToLiveDays,
  conversionRate,
  loading,
}: OnboardingStatsProps) {
  const stats = [
    {
      icon: "verified",
      label: "Conversions (7d)",
      value: loading ? "—" : formatInteger(recentConversions ?? 0),
      color: "text-primary",
      bg: "bg-primary-container/20",
    },
    {
      icon: "schedule",
      label: "Avg. Time to Live",
      value: loading ? "—" : `${avgTimeToLiveDays ?? 0} days`,
      color: "text-secondary",
      bg: "bg-secondary-container/20",
    },
    {
      icon: "conversion_path",
      label: "Conversion Rate",
      value: loading ? "—" : `${(conversionRate ?? 0).toFixed(1)}%`,
      color: "text-tertiary",
      bg: "bg-tertiary-container/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-md md:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card rounded-xl p-md">
          <div className={`mb-sm inline-flex rounded-lg p-xs ${stat.bg}`}>
            <span className={`material-symbols-outlined ${stat.color}`}>
              {stat.icon}
            </span>
          </div>
          <p className="text-label-md font-label-md text-on-surface-variant">
            {stat.label}
          </p>
          <h3 className="mt-xs text-headline-md font-headline-md font-extrabold">
            {stat.value}
          </h3>
        </div>
      ))}
    </div>
  );
}

type LeadsTableProps = {
  leads?: LeadViewRow[];
  loading?: boolean;
};

export function LeadsTable({ leads, loading }: LeadsTableProps) {
  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-outline-variant bg-white p-lg">
        <div>
          <h3 className="text-title-lg font-title-lg font-bold text-on-background">
            Active Leads
          </h3>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Salesforce pipeline — sorted by priority
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-xs rounded-lg bg-primary px-sm py-2 text-label-md font-label-md text-on-primary"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          New Lead
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Company
              </th>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                City
              </th>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Status
              </th>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Priority
              </th>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Owner
              </th>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Created
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading && !leads?.length ? (
              <tr>
                <td colSpan={6} className="px-lg py-xl text-center text-on-surface-variant">
                  Loading leads…
                </td>
              </tr>
            ) : (
              leads?.map((lead) => (
                <tr key={lead.id} className="hover:bg-surface-container-low">
                  <td className="px-lg py-md">
                    <div className="font-semibold">{lead.company}</div>
                    <div className="text-label-md font-label-md text-on-surface-variant">
                      {lead.cuisine}
                    </div>
                  </td>
                  <td className="px-lg py-md text-body-md font-body-md">{lead.city}</td>
                  <td className="px-lg py-md">
                    <span
                      className={`rounded-full px-xs py-[2px] text-[11px] font-bold ${lead.statusColor}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-lg py-md">
                    <span
                      className={`rounded-full px-xs py-[2px] text-[11px] font-bold ${lead.priorityColor}`}
                    >
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-lg py-md text-body-md font-body-md text-on-surface-variant">
                    {lead.owner}
                  </td>
                  <td className="px-lg py-md text-label-md font-label-md text-on-surface-variant">
                    {relativeTime(lead.createdAt)}
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
