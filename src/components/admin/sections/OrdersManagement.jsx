// src/components/admin/sections/OrdersManagement.jsx
import { useContext, useState } from "react";
import {
  Search,
  Download,
  Edit,
  Truck,
  Package,
} from "lucide-react";
import DataTable from "../DataTable";
import { AdminContext } from "../../../context/AdminContext";


export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { orders, getUserName ,handleSaveStatus ,setEditingOrderId ,setUpdatedStatus ,editingOrderId ,updatedStatus} = useContext(AdminContext);

 const filteredOrders = orders.filter((order) => {
  const search = searchTerm.toLowerCase();

  return (
    order.id.toLowerCase().includes(search) ||            
    order.userId.toLowerCase().includes(search) ||           
    getUserName(order.userId)?.toLowerCase().includes(search) || 
    order.status.toLowerCase().includes(search) ||         
    order.total?.toString().includes(search)          
  ) && (statusFilter === "all" || order.status === statusFilter);
});

  const statusCounts = orders.reduce((acc, order) => {
    const status = order.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const getStatusColor = (status) => {
    const colors = {
      Delivered: "bg-green-100 text-green-800",
      Cancelled: "bg-red-100 text-red-800",
      Shipped: "bg-amber-100 text-amber-800",
      Pending: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleEditClick = (order) => {
    setEditingOrderId(order.id);
    setUpdatedStatus(order.status);
  };

  const stats = [
    {
      label: "Cancelled",
      value: statusCounts["Cancelled"] || 0,
      color: "bg-red-500",
    },
    {
      label: "Processing",
      value: statusCounts["Processing"] || 0,
      color: "bg-blue-500",
    },
    {
      label: "Shipped",
      value: statusCounts["Shipped"] || 0,
      color: "bg-amber-500",
    },
    {
      label: "Delivered",
      value: statusCounts["Delivered"] || 0,
      color: "bg-green-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
          <p className="text-gray-600 mt-1">Manage and track customer orders</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl border border-gray-200"
          >
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <div className={`w-full h-2 ${stat.color} rounded-full mt-2`}></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors w-full"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          {/* Orders Table */}
          <DataTable
            headers={[
              "Order ID",
              "Customer",
              "Amount",
              "Items",
              "Status",
              "Date",
              "Actions",
            ]}
            data={filteredOrders}
            emptyMessage="No orders found"
            renderRow={(order) => (
              <tr
                key={order.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="py-3 px-4 font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900">
                    {getUserName(order.userId)}
                  </p>
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">
                  {order.total?.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  <p className="font-medium text-gray-900">
                    {order.items.length}
                  </p>
                  <p className="text-sm text-gray-500">items</p>
                </td>
                <td className="py-3 px-4">
                  {editingOrderId === order.id ? (
                    <select
                      value={updatedStatus}
                      onChange={(e) => setUpdatedStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {order.createdAt.slice(0, 10)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {editingOrderId === order.id ? (
                      <>
                        <button
                          onClick={() => handleSaveStatus(order.id)}
                          className="p-1 text-green-600 hover:text-green-700"
                          title="Save"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingOrderId(null)}
                          className="p-1 text-red-600 hover:text-red-700"
                          title="Cancel"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditClick(order)}
                          className="p-1 text-amber-600 hover:text-amber-700 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          />
        </div>
      </div>
    </div>
  );
}
