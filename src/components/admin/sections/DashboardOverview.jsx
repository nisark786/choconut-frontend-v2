// src/components/admin/sections/DashboardOverview.jsx
import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import StatsCard from "../StatsCard";
import ChartContainer from "../ChartContainer";
import OrderStatusChart from "../PieChart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AdminContext } from "../../../context/AdminContext";
import { useContext } from "react";


export default function   DashboardOverview() {
  const { dashboard } = useContext(AdminContext);
  const { stats, monthly_revenue, order_status, top_products } = dashboard;

  const cards = [
    {
      title: "Total Revenue",
      value: stats.total_revenue,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: stats.total_orders,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: stats.total_products,
      icon: Package,
      color: "bg-amber-500",
    },
    {
      title: "Total Users",
      value: stats.total_users,
      icon: Users,
      color: "bg-purple-500",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Revenue Overview">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthly_revenue}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <OrderStatusChart data={order_status} />
      </div>

 
        <div className="lg:col-span-2">
          <ChartContainer title="Top Selling Products">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={top_products}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="sales"
                  fill="#3b82f6"
                  radius={[5, 5, 0, 0]}
                  activeFill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

  );
}
