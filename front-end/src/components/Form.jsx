import { useState } from "react";

export default function Form({ fields, onSubmit, buttonText = "Submit" }) {
  const [form, setForm] = useState(
    Object.fromEntries(fields.map((f) => [f.name, ""]))
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm(Object.fromEntries(fields.map((f) => [f.name, ""])));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {fields.map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {f.label}
            </label>
            {f.type === "select" ? (
              <select
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                required={f.required !== false}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Select {f.label}</option>
                {f.options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={f.type || "text"}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                required={f.required !== false}
                placeholder={f.placeholder || f.label}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            )}
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="bg-gray-600 text-white px-5 py-2 rounded hover:bg-gray-700 text-sm font-medium"
      >
        {buttonText}
      </button>
    </form>
  );
}
