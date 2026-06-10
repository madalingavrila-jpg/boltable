import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { MetricCards } from "@/components/MetricCards";
import { RevenueChart } from "@/components/RevenueChart";
import { ActivitiesFeed } from "@/components/ActivitiesFeed";
import { CitiesTable } from "@/components/CitiesTable";

export default function Home() {
  return (
    <>
      <Sidebar />
      <TopBar />
      <main className="ml-[280px] mt-16 p-lg">
        <div className="mx-auto max-w-[1400px] space-y-md">
          <div className="flex flex-col items-start justify-between gap-sm md:flex-row md:items-center">
            <div>
              <h2 className="text-headline-md font-headline-md font-bold text-on-background">
                Bolt Food Sales Overview
              </h2>
              <p className="text-body-md font-body-md text-on-surface-variant">
                Real-time performance tracking for Enterprise accounts.
              </p>
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

          <MetricCards />

          <div className="grid grid-cols-1 gap-md xl:grid-cols-3">
            <RevenueChart />
            <ActivitiesFeed />
          </div>

          <CitiesTable />
        </div>
      </main>
    </>
  );
}
