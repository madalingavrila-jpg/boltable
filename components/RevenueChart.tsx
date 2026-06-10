type ChartDay = {
  label: string;
  targetHeight: string;
  actualHeight: string;
  tooltip?: string;
};

const chartData: ChartDay[] = [
  { label: "Mon", targetHeight: "60%", actualHeight: "45%", tooltip: "€542k" },
  { label: "Tue", targetHeight: "70%", actualHeight: "55%" },
  { label: "Wed", targetHeight: "65%", actualHeight: "80%" },
  { label: "Thu", targetHeight: "85%", actualHeight: "75%" },
  { label: "Fri", targetHeight: "90%", actualHeight: "88%" },
  { label: "Sat", targetHeight: "75%", actualHeight: "95%" },
  { label: "Sun", targetHeight: "50%", actualHeight: "40%" },
];

export function RevenueChart() {
  return (
    <div className="glass-card flex h-[480px] flex-col rounded-xl p-lg xl:col-span-2">
      <div className="mb-lg flex items-center justify-between">
        <div>
          <h3 className="text-title-lg font-title-lg font-bold text-on-background">
            Weekly Revenue Velocity
          </h3>
          <p className="text-body-md font-body-md text-on-surface-variant">
            Daily sales aggregation across all regions
          </p>
        </div>
        <div className="flex gap-xs">
          <div className="mr-md flex items-center gap-xs">
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-label-md font-label-md text-on-surface-variant">
              Actual
            </span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="h-3 w-3 rounded-full bg-secondary-container" />
            <span className="text-label-md font-label-md text-on-surface-variant">
              Target
            </span>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-end justify-between gap-sm border-b border-outline-variant pb-xs pt-md">
        {chartData.map((day) => (
          <div key={day.label} className="group flex h-full flex-1 flex-col justify-end">
            <div
              className="custom-chart-bar w-full rounded-t-sm bg-primary/20 group-hover:bg-primary/30"
              style={{ height: day.targetHeight }}
            />
            <div
              className="custom-chart-bar relative w-full rounded-t-sm bg-primary"
              style={{ height: day.actualHeight }}
            >
              {day.tooltip && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 rounded bg-on-background px-xs py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {day.tooltip}
                </div>
              )}
            </div>
            <span className="mt-xs text-center text-label-md font-label-md">
              {day.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
