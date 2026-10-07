import { useState, useEffect } from "react";
import Form from "../components/Form";
import Table from "../components/Table";

const fields = [
  { name: "plate_Number", label: "Plate Number" },
  { name: "Brand", label: "Brand" },
  { name: "Model", label: "Model" },
  { name: "Year", label: "Year", type: "number" },
  { name: "Vehicle_Type", label: "Vehicle Type" },
  { name: "Purchase_Price", label: "Purchase Price", type: "number" },
  {
    name: "Status",
    label: "Status",
    type: "select",
    options: ["Available", "Rented", "Sold", "Maintenance"],
  },
  
];

const columns = [
  { key: "plate_Number", label: "Plate" },
  { key: "Brand", label: "Brand" },
  { key: "Model", label: "Model" },
  { key: "Year", label: "Year" },
  { key: "Vehicle_Type", label: "Type" },
  { key: "Purchase_Price", label: "Price" },
  { key: "Status", label: "Status" },
];

export default function Vehicles({ user }) {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState("");

  const fetchVehicles = async () => {
    const res = await fetch("/api/vehicles", { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unable to load fleet vehicles.");
    setVehicles(data);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/vehicles", { credentials: "include" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load fleet vehicles.");
        return data;
      })
      .then((data) => {
        if (active) setVehicles(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (form) => {
    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to add vehicle.");
      setError("");
      await fetchVehicles();
    } catch (requestError) {
      setError(requestError.message || "Unable to add vehicle.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Vehicles</h2>
      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {user?.Role === "admin" && <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Register Vehicle</h3>
        <Form fields={fields} onSubmit={handleCreate} buttonText="Add Vehicle" />
      </div>}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Vehicle List</h3>
        <Table columns={columns} data={vehicles} />
      </div>
    </div>
  );
}
