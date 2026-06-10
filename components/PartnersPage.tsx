"use client";

import type { PartnerViewRow } from "@/types/dashboard";
import { formatEur, formatInteger } from "@/lib/format";

type PartnersTableProps = {
  partners?: PartnerViewRow[];
  loading?: boolean;
};

export function PartnersTable({ partners, loading }: PartnersTableProps) {
  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-outline-variant bg-white p-lg">
        <div>
          <h3 className="text-title-lg font-title-lg font-bold text-on-background">
            Restaurant Partners
          </h3>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Enterprise accounts ranked by 30-day GMV
          </p>
        </div>
        <div className="flex items-center gap-xs">
          <button
            type="button"
            className="flex items-center gap-xs rounded-lg bg-surface-container px-sm py-2 text-label-md font-label-md transition-all hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-xs rounded-lg bg-primary px-sm py-2 text-label-md font-label-md text-on-primary transition-all hover:opacity-90"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Partner
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Partner
              </th>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Tier
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Revenue (30d)
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Orders
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Rating
              </th>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading && !partners?.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-lg py-xl text-center text-body-md font-body-md text-on-surface-variant"
                >
                  Loading partners…
                </td>
              </tr>
            ) : !partners?.length ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-lg py-xl text-center text-body-md font-body-md text-on-surface-variant"
                >
                  No partner data available.
                </td>
              </tr>
            ) : (
              partners.map((partner) => (
                <tr
                  key={partner.id}
                  className="group transition-colors hover:bg-surface-container-low"
                >
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-sm">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-secondary-container/30">
                        <span className="material-symbols-outlined text-[20px] text-secondary">
                          storefront
                        </span>
                      </div>
                      <div>
                        <div className="text-body-md font-body-md font-semibold">
                          {partner.name}
                        </div>
                        <div className="text-label-md font-label-md text-on-surface-variant">
                          {partner.location} · {partner.cuisine}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md">
                    <span
                      className={`rounded-full px-xs py-[2px] text-[11px] font-bold ${partner.tierColor}`}
                    >
                      {partner.tier}
                    </span>
                  </td>
                  <td className="px-lg py-md text-right text-data-mono font-data-mono">
                    {partner.revenue}
                  </td>
                  <td className="px-lg py-md text-right text-data-mono font-data-mono text-on-surface-variant">
                    {partner.orders}
                  </td>
                  <td className="px-lg py-md text-right">
                    <span className="flex items-center justify-end gap-[2px] text-data-mono font-data-mono">
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        star
                      </span>
                      {partner.rating}
                    </span>
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-xs">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          partner.statusColor === "primary"
                            ? "bg-primary"
                            : partner.statusColor === "error"
                              ? "bg-error"
                              : "bg-secondary"
                        }`}
                      />
                      <span className="text-label-md font-label-md font-medium text-on-surface">
                        {partner.status}
                      </span>
                    </div>
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

type PartnerSummaryCardsProps = {
  totalPartners?: number;
  activeCount?: number;
  newCount?: number;
  avgRevenue?: number;
  loading?: boolean;
};

export function PartnerSummaryCards({
  totalPartners,
  activeCount,
  newCount,
  avgRevenue,
  loading,
}: PartnerSummaryCardsProps) {
  const cards = [
    {
      icon: "storefront",
      label: "Total Partners",
      value: loading ? "—" : formatInteger(totalPartners ?? 0),
      subtitle: "Active on platform",
      iconBg: "bg-primary-container/20",
      iconColor: "text-primary",
    },
    {
      icon: "check_circle",
      label: "Active",
      value: loading ? "—" : formatInteger(activeCount ?? 0),
      subtitle: "Receiving orders",
      iconBg: "bg-secondary-container/20",
      iconColor: "text-secondary",
    },
    {
      icon: "fiber_new",
      label: "New This Month",
      value: loading ? "—" : formatInteger(newCount ?? 0),
      subtitle: "Recently onboarded",
      iconBg: "bg-tertiary-container/20",
      iconColor: "text-tertiary",
    },
    {
      icon: "payments",
      label: "Avg. Revenue",
      value: loading ? "—" : formatEur(avgRevenue ?? 0),
      subtitle: "Per partner (30d)",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-md md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="glass-card rounded-xl p-md">
          <div className={`mb-sm inline-flex rounded-lg p-xs ${card.iconBg}`}>
            <span className={`material-symbols-outlined ${card.iconColor}`}>
              {card.icon}
            </span>
          </div>
          <p className="text-label-md font-label-md font-medium text-on-surface-variant">
            {card.label}
          </p>
          <h3 className="mt-xs text-headline-md font-headline-md font-extrabold text-on-surface">
            {card.value}
          </h3>
          <p className="mt-xs text-label-md font-label-md text-on-surface-variant opacity-60">
            {card.subtitle}
          </p>
        </div>
      ))}
    </div>
  );
}
