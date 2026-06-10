import Image from "next/image";

type CityRow = {
  name: string;
  image: string;
  imageAlt: string;
  revenue: string;
  growth: string;
  growthType: "up" | "down";
  avgOrder: string;
  status: string;
  statusColor: "primary" | "error";
};

const cities: CityRow[] = [
  {
    name: "Tallinn, Estonia",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD7XYSI7VVhs9zY9w1goGt2qvdA5muU3FWE1L84S0IsbONo1VihRO7W2JbuUStf2coH2N1YaWHzlQegwTIYdsxqKO3ujKFWUUzPowXNAJ1UVUcUzelubJZjceoD45CE-KxAQRysXFWsbCH8GedHNjlHuP4llouj7nGnMfVn_j_bf_Dm6OeVsupJgxT8UoIklUi2tlwqOwS1KrPp7dM-mvP2s5dE9PQKeFgvbdA9xefXry85ZmsYzxQAZaCKs7-u-IIt6MXcY3penYWp",
    imageAlt: "Tallinn Skyline",
    revenue: "€1,240,500",
    growth: "+18.4%",
    growthType: "up",
    avgOrder: "€24.50",
    status: "Optimal",
    statusColor: "primary",
  },
  {
    name: "Berlin, Germany",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAV85j09Pmy7AYOeXcuZMQMA_8MpSKXHeQTIAeQ2CMMfXGGhiGD2KKGsn35lIOBUC7GkLwyKjHN-Xfdv6J5W2ShM3eR75wc_tNgzASv9_TJXIHutx8uv5o9hi9MRyBdEfFCv8aRbNcq21sO7k2bYVjUn6roroDLVBuQwutiUQiPA3dmjuX6HuOwho6tIpYJJ1F6qey4Had5-8tCtnGDdz1x5uEi7FH5IU6YhTLCh2Wpmrhuu8nzlWH91FXA4jhb_e3_fNGp5Pc_k_bk",
    imageAlt: "Berlin Scene",
    revenue: "€985,200",
    growth: "+5.2%",
    growthType: "up",
    avgOrder: "€31.20",
    status: "Stable",
    statusColor: "primary",
  },
  {
    name: "Prague, Czechia",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB09RpFhJU1aJzLnju4w2sFWbt5JHIk2_8mBDsh6WO4kk1lLmZT-4M9rKxyJ1F20DUC-o2U9rgwBYH8uQDvKo_7QlDV2Nl9hCqMbcKm8G4WVJ1klSJz3GQ728lda0J4cA2sihjzZgXGla1Ui494aAqSYe-tGAUGutcAFXYnsk68_bZu500QjGu4IpsSRlGfBA5zw11RS4Ff7GN3dRv8I1OvujZn8bjVejuvf31Myx-y0dXV2zhJUjhV3ohOlOHHXRwyjP89YAWyJ6s7",
    imageAlt: "Prague Skyline",
    revenue: "€742,000",
    growth: "-1.8%",
    growthType: "down",
    avgOrder: "€19.80",
    status: "Review",
    statusColor: "error",
  },
];

export function CitiesTable() {
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
            {cities.map((city) => (
              <tr
                key={city.name}
                className="group transition-colors hover:bg-surface-container-low"
              >
                <td className="px-lg py-md">
                  <div className="flex items-center gap-sm">
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={city.image}
                        alt={city.imageAlt}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                      />
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
