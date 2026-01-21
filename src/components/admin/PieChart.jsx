import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function OrderStatusChart({ data }) {

  // Convert counts to chart-friendly format
  const chartData = data.map((item) => ({
    name: item.order_status,
    value: item.count,
  }));


  // Colors for each status
  const COLORS = {
    DELIVERED: "#22c55e",  
    PROCESSING: "#3b82f6",  
    CANCELLED: "#FF0000", 
    SHIPPED: "#eab308",     
  };

  return (
    <div className="w-full h-96 bg-white rounded-xl shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Order Status Overview
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) =>
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry) => (
              <Cell
                key={`cell-${entry.name}`}
                fill={COLORS[entry.name] || "#94a3b8"}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
