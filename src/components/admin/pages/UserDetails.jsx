// src/pages/admin/UserDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import { useContext, useEffect, useState } from "react";
import api from "../../../api/axios";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  CheckCircle,
  XCircle,
  User,
  Shield,
} from "lucide-react";

export default function UserDetails() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { userAction } = useContext(AdminContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`admin/users/${id}/`);
        setUser(res.data.user);
        setStats(res.data.stats);
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Failed to load user", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUserAction = async (action) => {
    if (actionLoading) return;
    setActionLoading(true);
    try {
      await userAction(user.id, action);

      setUser((prev) => ({
        ...prev,
        is_blocked:
          action === "block"
            ? true
            : action === "unblock"
              ? false
              : prev.is_blocked,
        is_staff:
          action === "make_admin"
            ? true
            : action === "remove_admin"
              ? false
              : prev.is_staff,
      }));
    } catch (err) {
      console.error("Action failed", err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading user details...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Users</span>
          </button>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-8 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              User Not Found
            </h2>
            <p className="text-gray-600">
              The user you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (isBlocked) =>
    isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800";
  const getStatusText = (isBlocked) => (isBlocked ? "Blocked" : "Active");

  const userStats = stats;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/users")}
              className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Customers</span>
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Details
                </h1>
                <p className="text-amber-700">
                  Comprehensive user information and activity
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-2xl font-bold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-amber-100 opacity-90">{user.email}</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(user.is_blocked)}`}
                    >
                      {user.is_blocked ? (
                        <XCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      )}
                      {getStatusText(user.is_blocked)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-medium text-gray-900">
                        {user.is_staff ? "Admin" : "User"}
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      handleUserAction(user.is_blocked ? "unblock" : "block")
                    }
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                      user.is_blocked
                        ? "bg-blue-500 text-white hover:bg-blue-600"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">
                      {user.is_blocked ? "Unblock User" : "Block User"}
                    </span>
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-600">Member Since</p>
                      <p className="font-medium text-gray-900">
                        {user.date_joined
                          ? new Date(user.date_joined).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-amber-600" />
                    <div>
                      <p className="text-sm text-gray-600">User ID</p>
                      <p className="font-mono text-sm text-gray-900">
                        {user.id}
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={actionLoading}
                    onClick={() =>
                      handleUserAction(
                        user.is_staff ? "remove_admin" : "make_admin",
                      )
                    }
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-colors ${
                      user.is_staff
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    <Shield className="w-5 h-5" />
                    <span className="font-medium">
                      {user.is_staff ? "Demote Admin" : "Promote User"}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* User Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center">
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userStats?.total_orders}
                </p>
                <div className="w-full h-2 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center">
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-green-600">
                  ₹{userStats?.total_spent?.toLocaleString()}
                </p>
                <div className="w-full h-2 bg-green-500 rounded-full mt-2"></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center">
                <p className="text-sm text-gray-600">Avg. Order</p>
                <p className="text-2xl font-bold text-amber-600">
                  ₹{userStats?.average_order?.toLocaleString()}
                </p>
                <div className="w-full h-2 bg-amber-500 rounded-full mt-2"></div>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center">
                <p className="text-sm text-gray-600">Last Order</p>
                <p className="text-lg font-bold text-gray-900">
                  {userStats?.last_order
                    ? new Date(userStats.last_order).toLocaleDateString()
                    : "No Orders"}
                </p>
                <div className="w-full h-2 bg-purple-500 rounded-full mt-2"></div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <ShoppingBag className="w-6 h-6 mr-2 text-amber-600" />
                  Order History
                </h3>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-600">
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString()
                              : "Date unknown"}
                          </p>
                        </div>
                      </div>
                      {order.items
                        .map(
                          (item) =>
                            `${item.product_name} x ${item.quantity} unit`,
                        )
                        .join(", ")}

                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          ₹{order.total_amount?.toLocaleString() || "0"}
                        </p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            order.order_status === "DELIVERED"
                              ? "bg-green-100 text-green-800"
                              : order.order_status === "SHIPPED"
                                ? "bg-amber-100 text-amber-800"
                                : order.order_status === "PROCESSING"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                          }`}
                        >
                          {order.order_status || "Unknown"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600 text-lg">
                    No orders found for this user
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    This user hasn't placed any orders yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
