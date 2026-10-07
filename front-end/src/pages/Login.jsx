import { useState } from "react";

export default function Login({ onLogin, onRegister, sessionError = "" }) {
  const [form, setForm] = useState({ Username: "", Password: "" });
  const [error, setError] = useState(sessionError);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to reach the Node.js API. Check that the backend is running.");
      }
      if (!data?.user) throw new Error("The API returned an invalid sign-in response.");
      onLogin(data.user);
    } catch (requestError) {
      setError(requestError.message || "Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f7f5] p-4 sm:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:min-h-[calc(100vh-4rem)] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-emerald-950 p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-28 -top-24 size-[390px] rounded-full border border-white/10" />
          <div className="absolute -right-8 -top-4 size-[260px] rounded-full border border-white/10" />
          <div className="absolute -bottom-48 -left-20 size-[440px] rounded-full bg-emerald-900/70" />
          <div className="relative flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-xl bg-white text-sm font-bold text-emerald-950">SW</div>
            <div>
              <p className="text-sm font-bold">SwiftWheels</p>
              <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-200/70">Fleet workspace</p>
            </div>
          </div>
          <div className="relative max-w-md py-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-300">Every journey, in view</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.12] tracking-[-0.04em] xl:text-[48px]">
              A smarter way to move your business forward.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-7 text-emerald-100/70">
              Manage your fleet, keep an eye on performance and make every mile count.
            </p>
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {["A", "M", "J"].map((letter) => (
                  <span key={letter} className="grid size-8 place-items-center rounded-full border-2 border-emerald-950 bg-emerald-700 text-[10px] font-bold">{letter}</span>
                ))}
              </div>
              <p className="text-xs text-emerald-100/70">One workspace for your whole fleet</p>
            </div>
          </div>
          <p className="relative text-[10px] text-emerald-100/40">© 2026 SwiftWheels Fleet Management</p>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-14">
          <div className="w-full max-w-[390px]">
            <div className="mb-12 flex items-center gap-3 lg:hidden">
              <div className="grid size-10 place-items-center rounded-xl bg-emerald-950 text-sm font-bold text-white">SW</div>
              <span className="text-sm font-bold text-slate-900">SwiftWheels</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.17em] text-emerald-800">Welcome back</p>
            <h2 className="mt-3 text-[32px] font-semibold tracking-[-0.04em] text-slate-950">Sign in to your account</h2>
            <p className="mt-2 text-sm text-slate-500">Enter your details to continue to your workspace.</p>

            {error && <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Username</span>
                <input
                  autoComplete="username"
                  name="Username"
                  type="text"
                  placeholder="Your username"
                  value={form.Username}
                  onChange={(event) => setForm({ ...form, Username: event.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-semibold text-slate-700">Password</span>
                <input
                  autoComplete="current-password"
                  name="Password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.Password}
                  onChange={(event) => setForm({ ...form, Password: event.target.value })}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-xl bg-emerald-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-500">
              New to SwiftWheels?{" "}
              <button type="button" onClick={onRegister} className="font-semibold text-emerald-900 hover:underline">Create a stakeholder account</button>
            </p>
            <p className="mt-8 text-center text-[11px] leading-5 text-slate-400">
              Administrator accounts are provisioned by your system administrator.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
