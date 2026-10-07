export default function Table({ columns, data, emptyMessage = "No records found." }) {
  if (!data || data.length === 0) {
    return <p className="text-gray-500 text-sm italic">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-2 font-semibold text-gray-700 border-b">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 border-b">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2 text-gray-600">
                  {row[col.key] ?? "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
