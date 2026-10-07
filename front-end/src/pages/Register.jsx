import { useState } from "react";

export default function Register({ onRegistered, sessionError = "" }) {
  const [form, setForm] = useState({ Username: "", Password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState(sessionError);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.message || "Unable to reach the Node.js API. Check that the backend is running.");
      }
      if (!data?.success) throw new Error("The API returned an invalid account response.");
      setMessage("Your stakeholder account is ready. You can now sign in.");
      setForm({ Username: "", Password: "" });
    } catch (requestError) {
      setError(requestError.message || "Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f5] p-5">
      <section className="w-full max-w-md rounded-[26px] border border-slate-100 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-emerald-950 text-sm font-bold text-white">SW</div>
          <div>
            <p className="text-sm font-bold text-slate-900">SwiftWheels</p>
            <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-400">Fleet workspace</p>
          </div>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.17em] text-emerald-800">Join your team</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-950">Create an account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">Set up a stakeholder account to follow fleet activity and business reports.</p>

        {error && <p role="alert" className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        {message && <p role="status" className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</p>}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-700">Username</span>
            <input
              autoComplete="username"
              minLength="3"
              maxLength="40"
              name="Username"
              type="text"
              placeholder="Choose a username"
              value={form.Username}
              onChange={(event) => setForm({ ...form, Username: event.target.value })}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-xs font-semibold text-slate-700">Password</span>
            <input
              autoComplete="new-password"
              minLength="8"
              name="Password"
              type="password"
              placeholder="At least 8 characters"
              value={form.Password}
              onChange={(event) => setForm({ ...form, Password: event.target.value })}
              required
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-800 focus:ring-4 focus:ring-emerald-900/5"
            />
          </label>
          <div className="rounded-xl bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold text-slate-700">Account access</p>
            <p className="mt-1 text-xs text-slate-500">Stakeholder · Read-only business dashboards</p>
          </div>
          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-emerald-950 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60">
            {submitting ? "Creating account…" : "Create stakeholder account"}
          </button>
        </form>
        <p className="mt-7 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <button type="button" onClick={onRegistered} className="font-semibold text-emerald-900 hover:underline">Sign in</button>
        </p>
      </section>
    </main>
  );
}
