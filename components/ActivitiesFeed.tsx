type Activity = {
  icon: string;
  iconBg: string;
  iconColor: string;
  content: React.ReactNode;
  meta: string;
};

const activities: Activity[] = [
  {
    icon: "add_business",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
    content: (
      <>
        <strong>&quot;Sushi Zen&quot;</strong> joined as a restaurant partner.
      </>
    ),
    meta: "2 minutes ago • Tallinn",
  },
  {
    icon: "campaign",
    iconBg: "bg-secondary-container/20",
    iconColor: "text-secondary",
    content: (
      <>
        Flash campaign <strong>&quot;Burger Weekend&quot;</strong> activated.
      </>
    ),
    meta: "45 minutes ago • Regional",
  },
  {
    icon: "warning",
    iconBg: "bg-error-container/20",
    iconColor: "text-error",
    content: (
      <>
        Revenue drop detected in <strong>Warsaw District</strong>.
      </>
    ),
    meta: "2 hours ago • System Alert",
  },
  {
    icon: "verified",
    iconBg: "bg-primary-container/20",
    iconColor: "text-primary",
    content: (
      <>
        <strong>Sarah K.</strong> completed onboarding for 12 accounts.
      </>
    ),
    meta: "5 hours ago • Team Lead",
  },
];

export function ActivitiesFeed() {
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
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-sm">
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
                {activity.content}
              </p>
              <p className="text-label-md font-label-md text-on-surface-variant opacity-60">
                {activity.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
