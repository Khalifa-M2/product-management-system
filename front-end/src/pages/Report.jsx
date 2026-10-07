import { useState } from "react";
import Table from "../components/Table";

const columns = [
  { key: "CustomerName", label: "Customer Name" },
  { key: "VehicleBrand", label: "Brand" },
  { key: "VehicleModel", label: "Model" },
  { key: "PromotionTitle", label: "Promotion Title" },
  { key: "DiscountValue", label: "Discount Value" },
  { key: "Performance", label: "Performance" },
];

export default function Report() {
  const [data, setData] = useState(null);

  const generate = async () => {
    const res = await fetch("/api/reports", { credentials: "include" });
    const result = await res.json();
    setData(result);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Customer Promotion Report</h2>
      <button
        onClick={generate}
        className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 text-sm font-medium"
      >
        Generate Report
      </button>
      <div className="bg-white p-4 rounded shadow">
        <Table
          columns={columns}
          data={data}
          emptyMessage="Click 'Generate Report' to view data."
        />
      </div>
    </div>
  );
}
