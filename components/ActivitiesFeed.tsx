import type { ActivityItem } from "@/types/dashboard";

type ActivitiesFeedProps = {
  activities?: ActivityItem[];
  loading?: boolean;
};

export function ActivitiesFeed({ activities, loading }: ActivitiesFeedProps) {
  return (
    <div className="glass-card flex h-[480px] flex-col rounded-xl p-lg">
      <div className="mb-lg flex items-center justify-between">
        <h3 className="text-title-lg font-title-lg font-bold text-on-background">
          Recent Activities
        </h3>
        <button
          type="button"
          className="text-label-md font-label-md font-bold text-primary hover:underline"
        >
          View All
        </button>
      </div>

      <div className="no-scrollbar flex-1 space-y-md overflow-y-auto">
        {loading && !activities?.length ? (
          <p className="text-body-md font-body-md text-on-surface-variant">
            Loading activities…
          </p>
        ) : !activities?.length ? (
          <p className="text-body-md font-body-md text-on-surface-variant">
            No recent Salesforce activities.
          </p>
        ) : (
          activities.map((activity) => (
            <div key={`${activity.createdAt}-${activity.title}`} className="flex items-start gap-sm">
              <div
                className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${activity.iconBg}`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${activity.iconColor}`}
                >
                  {activity.icon}
                </span>
              </div>
              <div>
                <p className="text-body-md font-body-md text-on-surface">
                  {activity.title}
                </p>
                <p className="text-label-md font-label-md text-on-surface-variant opacity-60">
                  {activity.meta}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
