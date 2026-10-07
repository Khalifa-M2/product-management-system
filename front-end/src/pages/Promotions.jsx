import { useState, useEffect } from "react";
import Form from "../components/Form";
import Table from "../components/Table";

const fields = [
  {
    name: "Title",
    label: "Title",
    type: "select",
    options: [
      "New Year sale",
      "HolidayPrice Slash",
      "Weekend Flash Sale",
      "Clerance Discount Offer",
      "Seasonal Price Drop",
    ],
  },
  { name: "Description", label: "Description" },
  {
    name: "Discount_Type",
    label: "Discount Type",
    type: "select",
    options: ["free", "percentage", "FLAT_RATE", "CASHBACK", "BUY_ONE_GET_ONE", "BUNDLE", "amount"],
  },
  { name: "Discount_Value", label: "Discount Value", type: "number" },
  { name: "Start_Date", label: "Start Date", type: "date" },
  { name: "End_Date", label: "End Date", type: "date" },
  {
    name: "Status",
    label: "Status",
    type: "select",
    options: ["Active", "Inactive"],
  },
];

const linkFields = [
  { name: "promotion_id", label: "Promotion ID" },
  { name: "plate_Number", label: "Plate Number" },
  { name: "Performance", label: "Performance" },
];

const columns = [
  { key: "id", label: "ID" },
  { key: "Title", label: "Title" },
  { key: "Discount_Type", label: "Discount Type" },
  { key: "Discount_Value", label: "Value" },
  { key: "Start_Date", label: "Start" },
  { key: "End_Date", label: "End" },
  { key: "Status", label: "Status" },
];

export default function Promotions({ user }) {
  const [promotions, setPromotions] = useState([]);
  const [error, setError] = useState("");

  const fetchPromotions = async () => {
    const res = await fetch("/api/promotions", { credentials: "include" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Unable to load promotions.");
    setPromotions(data);
  };

  useEffect(() => {
    let active = true;
    fetch("/api/promotions", { credentials: "include" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load promotions.");
        return data;
      })
      .then((data) => {
        if (active) setPromotions(data);
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
      const response = await fetch("/api/promotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to create promotion.");
      setError("");
      await fetchPromotions();
    } catch (requestError) {
      setError(requestError.message || "Unable to create promotion.");
    }
  };

  const handleLink = async (form) => {
    try {
      const response = await fetch("/api/promotions/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to link promotion.");
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to link promotion.");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Promotions</h2>
      {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {user?.Role === "admin" && <div className="bg-white p-4 rounded shadow">
        <>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Create Promotion</h3>
          <Form fields={fields} onSubmit={handleCreate} buttonText="Create Promotion" />
          <div className="mt-6 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Link Promotion to Vehicle</h3>
            <Form fields={linkFields} onSubmit={handleLink} buttonText="Link" />
          </div>
        </>
      </div>}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Promotion List</h3>
        <Table columns={columns} data={promotions} />
      </div>
    </div>
  );
}
