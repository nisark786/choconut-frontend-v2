// src/components/admin/DataTable.jsx
export default function DataTable({ 
  headers, 
  data, 
  renderRow, 
  emptyMessage = "No data available",
  className = "" 
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              {headers.map((header, index) => (
                <th key={index} className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => renderRow(item, index))
            ) : (
              <tr>
                <td colSpan={headers.length} className="py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}