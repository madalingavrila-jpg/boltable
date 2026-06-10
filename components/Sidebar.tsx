const navItems = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "storefront", label: "Partners", active: false },
  { icon: "query_stats", label: "Performance", active: false },
  { icon: "person_add", label: "Onboarding", active: false },
];

const bottomItems = [{ icon: "settings", label: "Settings" }];

export function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 z-50 flex h-full w-[280px] flex-col border-r border-outline-variant bg-surface-container-lowest py-md px-xs">
      <div className="mb-lg px-sm">
        <div className="flex items-center gap-xs">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-on-primary">
            <span className="material-symbols-outlined">bolt</span>
          </div>
          <div>
            <h1 className="text-title-lg font-title-lg font-black text-on-surface">
              Sales Ops
            </h1>
            <p className="text-label-md font-label-md text-on-surface-variant opacity-70">
              Enterprise Division
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="mx-xs mb-lg flex scale-95 items-center justify-center gap-xs rounded-lg bg-primary-container px-md py-sm text-label-md font-label-md text-on-primary-container transition-all hover:opacity-90 active:scale-100"
      >
        <span className="material-symbols-outlined">person_add</span>
        New Lead
      </button>

      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className={
              item.active
                ? "mx-xs my-1 flex scale-95 items-center gap-sm rounded-lg bg-primary-container px-md py-sm text-label-md font-label-md text-on-primary-container transition-transform active:scale-100"
                : "mx-xs my-1 flex scale-95 items-center gap-sm rounded-lg px-md py-sm text-label-md font-label-md text-on-surface-variant transition-all hover:bg-surface-container active:scale-100"
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>

      <div className="mt-auto border-t border-outline-variant pt-md">
        {bottomItems.map((item) => (
          <a
            key={item.label}
            href="#"
            className="mx-xs my-1 flex items-center gap-sm rounded-lg px-md py-sm text-label-md font-label-md text-on-surface-variant transition-all hover:bg-surface-container"
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
