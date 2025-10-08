// src/components/admin/ChartContainer.jsx
import { Filter } from "lucide-react";


export default function ChartContainer({ title, children, onFilter }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {onFilter && (
          <button 
            onClick={onFilter}
            className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}