"use client";

import { PageHeader } from "@/components/PageHeader";
import { DataAlert } from "@/components/DataAlert";
import {
  ProfileSettings,
  GeneralSettings,
  NotificationSettings,
  IntegrationSettings,
} from "@/components/SettingsPage";
import { useDashboard } from "@/lib/useDashboard";

export function SettingsShell() {
  const { model, error, loading, sourceHint } = useDashboard();

  return (
    <div className="mx-auto max-w-[900px] space-y-md">
      <PageHeader
        title="Settings"
        subtitle="Configure notifications, integrations, and regional preferences."
        updatedAt={model?.updatedAt}
        loading={loading}
      />

      <DataAlert error={error} sourceHint={sourceHint} />

      <ProfileSettings loading={loading} />

      <GeneralSettings
        timezone={model?.settings.timezone}
        locale={model?.settings.locale}
        loading={loading}
      />

      <NotificationSettings
        notifications={model?.settings.notifications}
        loading={loading}
      />

      <IntegrationSettings
        integrations={model?.settings.integrations}
        loading={loading}
      />
    </div>
  );
}
