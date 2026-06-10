import type { CityRow } from "@/types/dashboard";

type CitiesTableProps = {
  cities?: CityRow[];
  loading?: boolean;
};

export function CitiesTable({ cities, loading }: CitiesTableProps) {
  return (
    <div className="glass-card overflow-hidden rounded-xl">
      <div className="flex items-center justify-between border-b border-outline-variant bg-white p-lg">
        <h3 className="text-title-lg font-title-lg font-bold text-on-background">
          Top Performing Cities
        </h3>
        <div className="flex items-center gap-xs">
          <button
            type="button"
            className="flex items-center gap-xs rounded-lg bg-surface-container px-sm py-2 text-label-md font-label-md transition-all hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">
              filter_list
            </span>
            Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-xs rounded-lg bg-surface-container px-sm py-2 text-label-md font-label-md transition-all hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                City / Region
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Revenue (WTD)
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Growth
              </th>
              <th className="px-lg py-md text-right text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Avg. Order Value
              </th>
              <th className="px-lg py-md text-label-md font-label-md font-semibold uppercase tracking-wider text-on-surface-variant">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading && !cities?.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-lg py-xl text-center text-body-md font-body-md text-on-surface-variant"
                >
                  Loading cities…
                </td>
              </tr>
            ) : !cities?.length ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-lg py-xl text-center text-body-md font-body-md text-on-surface-variant"
                >
                  No city data available.
                </td>
              </tr>
            ) : (
              cities.map((city) => (
                <tr
                  key={city.name}
                  className="group transition-colors hover:bg-surface-container-low"
                >
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-sm">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <span className="material-symbols-outlined text-[20px] text-primary">
                          location_city
                        </span>
                      </div>
                      <div className="text-body-md font-body-md font-semibold">
                        {city.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md text-right text-data-mono font-data-mono">
                    {city.revenue}
                  </td>
                  <td className="px-lg py-md text-right">
                    <span
                      className={`rounded-full px-xs py-[2px] text-[12px] font-bold ${
                        city.growthType === "up" ? "trend-up" : "trend-down"
                      }`}
                    >
                      {city.growth}
                    </span>
                  </td>
                  <td className="px-lg py-md text-right text-data-mono font-data-mono text-on-surface-variant">
                    {city.avgOrder}
                  </td>
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-xs">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          city.statusColor === "primary" ? "bg-primary" : "bg-error"
                        }`}
                      />
                      <span className="text-label-md font-label-md font-medium text-on-surface">
                        {city.status}
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
