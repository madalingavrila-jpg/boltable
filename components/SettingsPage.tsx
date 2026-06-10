"use client";

import type { IntegrationSetting, NotificationSetting } from "@/types/dashboard";

type SettingsSectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <div className="glass-card rounded-xl p-lg">
      <h3 className="text-title-lg font-title-lg font-bold text-on-background">{title}</h3>
      <p className="mb-lg text-body-md font-body-md text-on-surface-variant">{description}</p>
      {children}
    </div>
  );
}

type NotificationSettingsProps = {
  notifications?: NotificationSetting[];
  loading?: boolean;
};

export function NotificationSettings({ notifications, loading }: NotificationSettingsProps) {
  return (
    <SettingsSection
      title="Notifications"
      description="Configure alerts for sales operations events."
    >
      {loading && !notifications?.length ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : (
        <div className="space-y-md">
          {notifications?.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg bg-surface-container-low p-md"
            >
              <div>
                <p className="text-body-md font-body-md font-semibold">{item.label}</p>
                <p className="text-label-md font-label-md text-on-surface-variant">
                  {item.description}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={item.enabled}
                className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
                  item.enabled ? "bg-primary" : "bg-outline-variant"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    item.enabled ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </SettingsSection>
  );
}

type IntegrationSettingsProps = {
  integrations?: IntegrationSetting[];
  loading?: boolean;
};

export function IntegrationSettings({ integrations, loading }: IntegrationSettingsProps) {
  const statusColor = (status: IntegrationSetting["status"]) => {
    if (status === "connected") return "bg-primary";
    if (status === "warning") return "bg-tertiary";
    return "bg-error";
  };

  return (
    <SettingsSection
      title="Integrations"
      description="Connected data sources powering the dashboard."
    >
      {loading && !integrations?.length ? (
        <p className="text-on-surface-variant">Loading…</p>
      ) : (
        <div className="space-y-sm">
          {integrations?.map((integration) => (
            <div
              key={integration.name}
              className="flex items-center justify-between rounded-lg border border-outline-variant p-md"
            >
              <div className="flex items-center gap-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container">
                  <span className="material-symbols-outlined text-primary">
                    {integration.icon}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{integration.name}</p>
                  <p className="text-label-md font-label-md text-on-surface-variant">
                    Last sync: {new Date(integration.lastSync).toLocaleString("en-GB")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-xs">
                <span className={`h-2 w-2 rounded-full ${statusColor(integration.status)}`} />
                <span className="text-label-md font-label-md capitalize">
                  {integration.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </SettingsSection>
  );
}

type GeneralSettingsProps = {
  timezone?: string;
  locale?: string;
  loading?: boolean;
};

export function GeneralSettings({ timezone, locale, loading }: GeneralSettingsProps) {
  return (
    <SettingsSection
      title="General"
      description="Regional preferences for reports and timestamps."
    >
      <div className="grid grid-cols-1 gap-md md:grid-cols-2">
        <div>
          <label className="mb-xs block text-label-md font-label-md font-semibold text-on-surface-variant">
            Timezone
          </label>
          <div className="rounded-lg bg-surface-container-low px-md py-sm text-body-md font-body-md">
            {loading ? "—" : timezone}
          </div>
        </div>
        <div>
          <label className="mb-xs block text-label-md font-label-md font-semibold text-on-surface-variant">
            Locale
          </label>
          <div className="rounded-lg bg-surface-container-low px-md py-sm text-body-md font-body-md">
            {loading ? "—" : locale}
          </div>
        </div>
      </div>
    </SettingsSection>
  );
}

type ProfileSettingsProps = {
  loading?: boolean;
};

export function ProfileSettings({ loading }: ProfileSettingsProps) {
  return (
    <SettingsSection
      title="Profile"
      description="Your Sales Ops account details (read-only)."
    >
      <div className="flex items-center gap-md rounded-lg bg-surface-container-low p-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
          <span className="material-symbols-outlined text-[28px]">person</span>
        </div>
        <div>
          <p className="text-body-md font-body-md font-bold">
            {loading ? "—" : "Bianca Medrea"}
          </p>
          <p className="text-label-md font-label-md text-on-surface-variant">
            Ops Director · Enterprise Division
          </p>
          <p className="text-label-md font-label-md text-primary">
            bianca.medrea@bolt.eu
          </p>
        </div>
      </div>
    </SettingsSection>
  );
}
