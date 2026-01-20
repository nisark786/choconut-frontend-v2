// src/components/admin/sections/OrdersManagement.jsx
import { useContext, useState, useEffect } from "react";
import { Search, Download, Edit, Truck, Package } from "lucide-react";
import DataTable from "../DataTable";
import { AdminContext } from "../../../context/AdminContext";

export default function OrdersManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    orders,
    fetchOrders,
    handleSaveStatus,
    setEditingOrderId,
    setUpdatedStatus,
    editingOrderId,
    updatedStatus,
    orderStats,
    orderPagination,
  } = useContext(AdminContext);

  const getStatusColor = (status) => {
    const colors = {
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
      SHIPPED: "bg-amber-100 text-amber-800",
      PROCESSING: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const handleEditClick = (order) => {
    setEditingOrderId(order.id);
    setUpdatedStatus(order.order_status);
  };

  const stats = [
    {
      label: "Cancelled",
      value: orderStats.CANCELLED || 0,
      color: "bg-red-500",
    },
    {
      label: "Processing",
      value: orderStats.PROCESSING || 0,
      color: "bg-blue-500",
    },
    {
      label: "Shipped",
      value: orderStats.SHIPPED || 0,
      color: "bg-amber-500",
    },
    {
      label: "Delivered",
      value: orderStats.DELIVERED || 0,
      color: "bg-green-500",
    },
  ];

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchOrders({
        page: 1,
        search: searchTerm,
        status: statusFilter,
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm, statusFilter]);

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
                <option value="CANCELLED">Cancelled</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
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
            data={orders}
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
                  <p className="font-medium text-gray-900">{order.user_name}</p>
                </td>
                <td className="py-3 px-4 font-medium text-gray-900">
                  {order.total_amount?.toLocaleString()}
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
                      <option value="PROCESSING">Processing</option>
                      <option value="SHIPPED">Shipped</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.order_status,
                      )}`}
                    >
                      {order.order_status}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-600">
                  {order.created_at.slice(0, 10)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {editingOrderId === order.id ? (
                      <>
                        <button
                          onClick={() =>
                            handleSaveStatus({
                              orderId: order.id,
                              page: orderPagination.page,
                              search: searchTerm,
                              status: statusFilter,
                            })
                          }
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
          <div className="flex justify-between items-center mt-4">
            <button
              disabled={!orderPagination.previous}
              onClick={() =>
                fetchOrders({
                  page: orderPagination.page - 1,
                  search: searchTerm,
                  status: statusFilter,
                })
              }
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="text-sm text-gray-600">
              Page {orderPagination.page}
            </span>

            <button
              disabled={!orderPagination.next}
              onClick={() =>
                fetchOrders({
                  page: orderPagination.page + 1,
                  search: searchTerm,
                  status: statusFilter,
                })
              }
              className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
