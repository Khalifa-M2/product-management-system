import { useState } from "react";
import Form from "../components/Form";
import Table from "../components/Table";

const fields = [
  { name: "FirstName", label: "First Name" },
  { name: "LastName", label: "Last Name" },
  { name: "Email", label: "Email", type: "email" },
  { name: "PhoneNumber", label: "Phone Number" },
  {
    name: "Status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive", "Blocked"],
  },
];

const columns = [
  { key: "FirstName", label: "First Name" },
  { key: "LastName", label: "Last Name" },
  { key: "Email", label: "Email" },
  { key: "PhoneNumber", label: "Phone" },
  { key: "Status", label: "Status" },
  { key: "CreatedAt", label: "Created" },
];

export default function Customers({ user }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const handleCreate = async (form) => {
    await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ...form, user_id: user?.user_id }),
    });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    const res = await fetch(
      `/api/customers/search?query=${encodeURIComponent(search)}`,
      { credentials: "include" }
    );
    const data = await res.json();
    setCustomers(data);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Customers</h2>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Register Customer</h3>
        <Form fields={fields} onSubmit={handleCreate} buttonText="Add Customer" />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Search Customers</h3>
        <form onSubmit={handleSearch} className="flex gap-2 mb-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm font-medium"
          >
            Search
          </button>
        </form>
        <Table columns={columns} data={customers} emptyMessage="No customers found. Try searching." />
      </div>
    </div>
  );
}
