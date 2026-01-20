// src/components/admin/sections/UsersManagement.jsx
import { useState, useEffect, useContext } from "react";
import { AdminContext } from "../../../context/AdminContext";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Search,
  Mail,
  Calendar,
  ShoppingBag,
  CheckCircle,
  XCircle,
} from "lucide-react";
import DataTable from "../DataTable";

export default function UsersManagement() {
  const navigate = useNavigate();
  const { users, userAction, userStats, fetchUsers, userPagination } =
    useContext(AdminContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchUsers({
        search: searchTerm,
        status: statusFilter,
        page: 1,
      });
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm, statusFilter]);

  const getStatusText = (user) => {
    if (user.is_blocked) return "Blocked";
    if (!user.is_active) return "Inactive";
    return "Active";
  };

  const getStatusColor = (user) => {
    if (user.is_blocked) return "bg-red-100 text-red-800";
    if (!user.is_active) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600 mt-1">
            Manage customer accounts and profiles
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{userStats.total}</p>
          <div className="w-full h-2 bg-blue-500 rounded-full mt-2"></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">Active Users</p>
          <p className="text-2xl font-bold text-green-600">
            {userStats.active}
          </p>
          <div className="w-full h-2 bg-green-500 rounded-full mt-2"></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">InActive Users</p>
          <p className="text-2xl font-bold text-amber-700">
            {userStats.notVerified}
          </p>
          <div className="w-full h-2 bg-amber-700 rounded-full mt-2"></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">Blocked Users</p>
          <p className="text-2xl font-bold text-red-600">{userStats.blocked}</p>
          <div className="w-full h-2 bg-red-500 rounded-full mt-2"></div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">New This Month</p>
          <p className="text-2xl font-bold text-amber-600">
            {userStats.newThisMonth}
          </p>
          <div className="w-full h-2 bg-amber-500 rounded-full mt-2"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search users by name or email..."
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
              <option value="active">Active</option>
              <option value="inactive">InActive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <DataTable
          headers={["User", "Contact", "Status", "Joined", "Orders", "Actions"]}
          data={users}
          emptyMessage="No users found"
          renderRow={(user) => (
            <tr
              key={user.id}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">ID: {user.id}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-sm">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">{user.email}</span>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    user,
                  )}`}
                >
                  {user.is_blocked ? (
                    <XCircle className="w-3 h-3 mr-1" />
                  ) : (
                    <CheckCircle className="w-3 h-3 mr-1" />
                  )}
                  {getStatusText(user)}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {user.date_joined
                      ? new Date(user.date_joined).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2 text-sm">
                  <ShoppingBag className="w-3 h-3 text-gray-400" />
                  <span className="font-medium text-gray-900">
                    {user.orders_count}
                  </span>
                  <span className="text-gray-500">orders</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/admin/users/${user.id}`)}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    title="View Details"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => userAction(user.id, user.is_blocked ? "unblock" : "block")}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-sm transition-colors ${
                      user.is_blocked
                        ? "bg-green-50 text-green-600 hover:bg-green-100"
                        : "bg-red-50 text-red-600 hover:bg-red-100"
                    }`}
                    title={user.is_blocked ? "Unblock User" : "Block User"}
                  >
                    {user.is_blocked ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        <span>Unblock</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3 h-3" />
                        <span>Block</span>
                      </>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
        <div className="flex justify-between items-center mt-4">
          <button
            disabled={!userPagination.previous}
            onClick={() =>
              fetchUsers({
                page: userPagination.page - 1,
                search: searchTerm,
                status: statusFilter,
              })
            }
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {userPagination.page}
          </span>

          <button
            disabled={!userPagination.next}
            onClick={() =>
              fetchUsers({
                page: userPagination.page + 1,
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
  );
}
