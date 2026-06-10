"use client";

import { useEffect, useState } from "react";
import type { DashboardModel } from "@/types/dashboard";
import { MetricCards } from "@/components/MetricCards";
import { RevenueChart } from "@/components/RevenueChart";
import { ActivitiesFeed } from "@/components/ActivitiesFeed";
import { CitiesTable } from "@/components/CitiesTable";

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "";
}

export function DashboardShell() {
  const [model, setModel] = useState<DashboardModel | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`${apiBase()}/api/dashboard`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error(`Dashboard API returned ${response.status}`);
        }
        const payload = (await response.json()) as DashboardModel;
        if (!cancelled) {
          setModel(payload);
        }
      } catch (fetchError) {
        if (!cancelled) {
          setError(
            fetchError instanceof Error
              ? fetchError.message
              : "Failed to load dashboard data",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const sourceHint =
    model?.sources.source === "error"
      ? model.sources.message ?? "Dashboard data could not be loaded."
      : null;

  return (
    <div className="mx-auto max-w-[1400px] space-y-md">
      <div className="flex flex-col items-start justify-between gap-sm md:flex-row md:items-center">
        <div>
          <h2 className="text-headline-md font-headline-md font-bold text-on-background">
            Bolt Food Sales Overview
          </h2>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Real-time performance tracking for Enterprise accounts.
          </p>
          {model?.updatedAt && !loading && (
            <p className="mt-1 text-label-md font-label-md text-on-surface-variant opacity-70">
              Updated {new Date(model.updatedAt).toLocaleString("en-GB")}
            </p>
          )}
        </div>
        <div className="flex gap-xs rounded-lg bg-surface-container-low p-1">
          <button
            type="button"
            className="rounded-md bg-white px-sm py-xs text-label-md font-label-md font-bold text-primary shadow-sm"
          >
            24h
          </button>
          <button
            type="button"
            className="rounded-md px-sm py-xs text-label-md font-label-md text-on-surface-variant transition-all hover:bg-white/50"
          >
            7d
          </button>
          <button
            type="button"
            className="rounded-md px-sm py-xs text-label-md font-label-md text-on-surface-variant transition-all hover:bg-white/50"
          >
            30d
          </button>
        </div>
      </div>

      {(error || sourceHint) && (
        <div className="rounded-xl border border-outline-variant bg-surface-container-low px-md py-sm text-body-md font-body-md text-on-surface-variant">
          {error && <p className="text-error">{error}</p>}
          {sourceHint && <p>{sourceHint}</p>}
        </div>
      )}

      <MetricCards metrics={model?.metrics} loading={loading} />

      <div className="grid grid-cols-1 gap-md xl:grid-cols-3">
        <RevenueChart data={model?.weeklyRevenue} loading={loading} />
        <ActivitiesFeed activities={model?.activities} loading={loading} />
      </div>

      <CitiesTable cities={model?.cities} loading={loading} />
    </div>
  );
}
