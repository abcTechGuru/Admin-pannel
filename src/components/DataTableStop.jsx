import React from "react";

const DataTable = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto rounded-md border border-gray-700">
      <table className="min-w-full divide-y divide-gray-600 text-sm text-left text-white">
        <thead className="bg-[#1f2937]">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium uppercase tracking-wide">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800 bg-[#0f172a]">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-[#1e293b] transition">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-2">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
