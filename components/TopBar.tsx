import Image from "next/image";

// Slack user U01AHG4UAPR (Bianca-Mihaela Medrea) — profile image from Slack API
const PROFILE_IMAGE =
  "https://avatars.slack-edge.com/2022-02-05/3074090656545_91cf0a754b6830e9e907_original.png";
const PROFILE_NAME = "Bianca Medrea";
const PROFILE_TITLE = "Ops Director";

export function TopBar() {
  return (
    <header className="fixed left-[280px] right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-outline-variant bg-surface px-lg">
      <div className="flex flex-1 items-center gap-md">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">
            search
          </span>
          <input
            type="text"
            placeholder="Search operational data..."
            className="w-full rounded-lg border-none bg-surface-container py-2 pl-10 pr-4 text-body-md font-body-md focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-md">
        <button
          type="button"
          className="relative rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
        </button>
        <button
          type="button"
          className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined">help</span>
        </button>
        <div className="mx-xs h-8 w-px bg-outline-variant" />
        <div className="group flex cursor-pointer items-center gap-xs">
          <Image
            src={PROFILE_IMAGE}
            alt={`${PROFILE_NAME} profile photo`}
            width={40}
            height={40}
            className="rounded-full border-2 border-primary-container"
          />
          <div className="hidden xl:block">
            <p className="text-label-md font-label-md font-bold leading-none">
              {PROFILE_NAME}
            </p>
            <p className="text-label-md font-label-md text-on-surface-variant opacity-60">
              {PROFILE_TITLE}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
