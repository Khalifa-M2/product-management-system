import { useState } from "react";

const icons = {
  dashboard: <><rect x="3" y="3" width="7" height="8" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="15" width="7" height="6" rx="1.5" /></>,
  vehicles: <><path d="m5 11 1.4-4.2A2 2 0 0 1 8.3 5h7.4a2 2 0 0 1 1.9 1.8L19 11" /><path d="M3 11h18v7H3zM6 18v2m12-2v2M6 14h.01M18 14h.01" /></>,
  customers: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9m-1-12a4 4 0 0 1 0 7.8" /></>,
  promotions: <><path d="m20.6 13.4-7.2 7.2a2 2 0 0 1-2.8 0l-8-8A2 2 0 0 1 2 11.2V4a2 2 0 0 1 2-2h7.2a2 2 0 0 1 1.4.6l8 8a2 2 0 0 1 0 2.8Z" /><circle cx="7.5" cy="7.5" r="1.5" /></>,
  reports: <><path d="M4 19V5m0 14h17" /><path d="m7 14 4-4 3 2 5-6" /></>,
  logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
};

function Icon({ name, className = "" }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
}

export default function Navbar({ page, setPage, user, onLogout }) {
  const [logoutError, setLogoutError] = useState("");
  const isAdmin = user?.Role === "admin";
  const tabs = [
    { key: "dashboard", label: "Overview", icon: "dashboard" },
    { key: "vehicles", label: "Fleet", icon: "vehicles" },
    ...(isAdmin ? [{ key: "customers", label: "Customers", icon: "customers" }] : []),
    { key: "promotions", label: "Promotions", icon: "promotions" },
    { key: "reports", label: "Reports", icon: "reports" },
  ];

  const logout = async () => {
    setLogoutError("");
    try {
      await onLogout();
    } catch (error) {
      setLogoutError(error.message);
    }
  };

  return (
    <aside className="flex shrink-0 flex-col border-b border-slate-200 bg-white lg:min-h-screen lg:w-64.5 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-5 lg:px-7 lg:py-8">
        <div className="grid size-10 place-items-center rounded-xl bg-emerald-950 text-sm font-bold tracking-tight text-white">SW</div>
        <div>
          <p className="text-[15px] font-bold tracking-tight text-slate-900">SwiftWheels</p>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Fleet workspace</p>
        </div>
      </div>

      <nav aria-label="Main navigation" className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:gap-1.5 lg:px-4 lg:py-5">
        <p className="hidden px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 lg:block">Workspace</p>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setPage(tab.key)}
            aria-current={page === tab.key ? "page" : undefined}
            className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition lg:w-full ${
              page === tab.key
                ? "bg-emerald-950 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon name={tab.icon} className="size-4.25" />
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="hidden border-t border-slate-100 p-4 lg:block">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold uppercase text-emerald-900">
            {user?.Username?.slice(0, 2) || "SW"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-800">{user?.Username}</p>
            <p className="mt-0.5 text-[10px] capitalize text-slate-500">{isAdmin ? "Administrator" : "Stakeholder"}</p>
          </div>
          <button type="button" onClick={logout} aria-label="Sign out" title="Sign out" className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-slate-900">
            <Icon name="logout" className="size-4" />
          </button>
        </div>
        {logoutError && <p role="alert" className="mt-2 text-xs text-rose-600">{logoutError}</p>}
      </div>
      <div className="flex items-center justify-between px-5 pb-4 lg:hidden">
        <span className="text-xs text-slate-500">{user?.Username} · {isAdmin ? "Admin" : "Stakeholder"}</span>
        <button type="button" onClick={logout} className="text-xs font-semibold text-emerald-900">Sign out</button>
      </div>
      {logoutError && <p role="alert" className="px-5 pb-4 text-xs text-rose-600 lg:hidden">{logoutError}</p>}
    </aside>
  );
}
