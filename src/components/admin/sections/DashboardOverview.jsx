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


export default function DashboardOverview() {
  const { orders, products, users, userCount } = useContext(AdminContext);
  const totalRevenue = orders.reduce((acc, item) => {
    return acc + item.total;
  }, 0);

  const monthlyRevenue = Array(12).fill(0);

  orders.forEach((order) => {
    const month = new Date(order.created_at).getMonth();
    monthlyRevenue[month] += order.total;
  });

  const revenueData = monthlyRevenue.map((rev, idx) => ({
    month: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ][idx],
    revenue: rev,
  }));


  const topProducts = products.map(p => {
  const totalSales = orders.reduce((sum, o) => {
    if (!o.items) return sum;
    const item = o.items.find(i => i.product === p.id);
    return sum + (item ? item.qty : 0); 
  }, 0);

  return { name: p.name, sales: totalSales };
})
  .sort((a, b) => b.sales - a.sales)
  .slice(0, 5);



  const stats = [
    {
      title: "Total Revenue",
      value: totalRevenue,
      icon: DollarSign,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      color: "bg-amber-500",
    },
    {
      title: "Total Users",
      value: userCount,
      icon: Users,
      color: "bg-purple-500",
    },
  ];
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Revenue Overview">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <OrderStatusChart orders={orders} />
      </div>

 
        <div className="lg:col-span-2">
          <ChartContainer title="Top Selling Products">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={topProducts}
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
