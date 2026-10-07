import { useEffect, useState } from "react";

const statCards = [
  { key: "vehiclesTotal", label: "Fleet vehicles", icon: "▤", accent: "bg-blue-50 text-blue-700" },
  { key: "availableVehicles", label: "Available now", icon: "✓", accent: "bg-emerald-50 text-emerald-700" },
  { key: "customersTotal", label: "Customers", icon: "◎", accent: "bg-violet-50 text-violet-700" },
  { key: "activePromotions", label: "Active promotions", icon: "↗", accent: "bg-amber-50 text-amber-700" },
];

export default function Dashboard({ user, onNavigate }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const isAdmin = user?.Role === "admin";

  useEffect(() => {
    let active = true;
    fetch("/api/dashboard", { credentials: "include" })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Could not load dashboard data.");
        return result;
      })
      .then((result) => {
        if (active) setData(result);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const statuses = data?.vehicleStatuses || [];
  const maxStatusCount = Math.max(1, ...statuses.map((status) => status.total));

  return (
    <div className="space-y-7">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-800">{isAdmin ? "Administrator workspace" : "Investor workspace"}</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[34px]">
            {isAdmin ? "Good to see you" : "Your portfolio at a glance"}, {user?.Username}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {isAdmin
              ? "Here’s what’s happening across your fleet today."
              : "A clear view of fleet activity and business performance."}
          </p>
        </div>
        <div className="w-fit rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-500">
          <span className="mr-2 inline-block size-2 rounded-full bg-emerald-500" />
          Live overview
        </div>
      </header>

      {error && (
        <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <section aria-label="Key business metrics" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article key={card.key} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.025)]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-medium text-slate-500">{card.label}</p>
              <span className={`grid size-9 place-items-center rounded-xl text-base font-semibold ${card.accent}`}>{card.icon}</span>
            </div>
            <p className="mt-5 text-[32px] font-semibold leading-none tracking-[-0.04em] text-slate-950">
              {loading ? <span className="text-xl text-slate-300">Loading…</span> : (data?.[card.key] ?? "—")}
            </p>
            <p className="mt-2 text-[11px] text-slate-400">Current records</p>
          </article>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.85fr]">
        <article className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[15px] font-semibold text-slate-900">Fleet health</h2>
              <p className="mt-1 text-xs text-slate-500">Vehicle breakdown by current status</p>
            </div>
            <button type="button" onClick={() => onNavigate("vehicles")} className="text-xs font-semibold text-emerald-900 hover:text-emerald-700">
              View fleet →
            </button>
          </div>
          <div className="mt-7 space-y-5">
            {statuses.length ? statuses.map((item) => (
              <div key={item.status}>
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-600">{item.status}</span>
                  <span className="tabular-nums text-slate-400">{item.total}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-800 transition-all"
                    style={{ width: `${Math.max(4, (item.total / maxStatusCount) * 100)}%` }}
                  />
                </div>
              </div>
            )) : (
              <div className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-400">
                {loading ? "Loading fleet data…" : "Vehicle status will appear here once vehicles are added."}
              </div>
            )}
          </div>
          <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
            <span className="text-xs text-slate-500">Fleet purchase value</span>
            <span className="text-sm font-semibold text-slate-900">
              {loading ? "—" : (data?.fleetValue || 0).toLocaleString()}
            </span>
          </div>
        </article>

        <article className="rounded-2xl bg-emerald-950 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="grid size-10 place-items-center rounded-xl bg-white/10 text-lg">✳</div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-100">
              {isAdmin ? "Operations" : "Portfolio"}
            </span>
          </div>
          <h2 className="mt-7 text-xl font-semibold tracking-tight">
            {isAdmin ? "Keep your fleet moving." : "Built for the long road."}
          </h2>
          <p className="mt-2 max-w-sm text-sm leading-6 text-emerald-100/70">
            {isAdmin
              ? "Stay on top of vehicle availability, customer activity and active offers from one place."
              : "Review the active fleet and business activity in one simple, read-only view."}
          </p>
          <button
            type="button"
            onClick={() => onNavigate(isAdmin ? "customers" : "reports")}
            className="mt-6 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-emerald-950 transition hover:bg-emerald-50"
          >
            {isAdmin ? "Manage customers" : "View business report"} <span aria-hidden="true" className="ml-1">→</span>
          </button>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[15px] font-semibold text-slate-900">Recently added vehicles</h2>
            <p className="mt-1 text-xs text-slate-500">Latest additions to the fleet</p>
          </div>
          <button type="button" onClick={() => onNavigate("vehicles")} className="text-xs font-semibold text-emerald-900 hover:text-emerald-700">
            See all →
          </button>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-400">
                <th className="pb-3 pr-4">Vehicle</th>
                <th className="pb-3 pr-4">Registration</th>
                <th className="pb-3 pr-4">Year</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentVehicles?.map((vehicle) => (
                <tr key={vehicle.plate_Number} className="border-b border-slate-50 last:border-0">
                  <td className="py-3.5 pr-4 font-semibold text-slate-800">{vehicle.Brand} {vehicle.Model}</td>
                  <td className="py-3.5 pr-4 text-slate-500">{vehicle.plate_Number}</td>
                  <td className="py-3.5 pr-4 text-slate-500">{vehicle.Year}</td>
                  <td className="py-3.5">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-800">{vehicle.Status}</span>
                  </td>
                </tr>
              ))}
              {!loading && !data?.recentVehicles?.length && (
                <tr><td colSpan="4" className="py-7 text-center text-slate-400">No fleet vehicles have been added yet.</td></tr>
              )}
              {loading && (
                <tr><td colSpan="4" className="py-7 text-center text-slate-400">Loading vehicles…</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
