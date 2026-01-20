// src/pages/OrdersPage.jsx
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import api from "../api/axios";
import { CartSkeleton } from "../skeltons/CartSkelton";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  ArrowLeft,
  ShoppingBag,
} from "lucide-react";
import { toast } from "react-toastify";

export default function OrdersPage() {
  const { currentUser,loadingAuth } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [confirmCancelOrderId, setConfirmCancelOrderId] = useState(null);


  useEffect(() => {
    if (currentUser) fetchOrders();
  }, [currentUser]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await api.post(`/orders/${orderId}/cancel/`);
      return true;
    } catch (error) {
      toast.error("Cancel order failed", error);
      throw error;
    }
  };

  const handleCancelOrder = async (orderId) => {
    try {
      setCancellingOrder(orderId);
      await cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      await fetchOrders();
    } catch (err) {
      toast.error("Unable to cancel order");
    } finally {
      setCancellingOrder(null);
    }
  };

  /* ================= STATUS HELPERS ================= */

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "SHIPPED":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "PROCESSING":
        return <RefreshCw className="w-5 h-5 text-amber-500" />;
      case "CANCELLED":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getOrderStatusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-800 border-green-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PROCESSING":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  /* ================= UI STATES ================= */

  if (loadingAuth) {
      return <CartSkeleton />;
    }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">
            Order History
          </h2>
          <p className="text-amber-700 mb-6">
            Please login to view your order history and tracking information.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center space-x-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Shopping</span>
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-amber-900 mb-4">
            No Orders Yet
          </h2>
        </div>
      </div>
    );
  }

  /* ================= MAIN UI ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="text-center mb-12">
        {" "}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-lg mb-4">
          {" "}
          <Package className="w-8 h-8 text-white" />{" "}
        </div>{" "}
        <h1 className="text-4xl font-bold text-amber-900 mb-3">My Orders</h1>{" "}
        <p className="text-amber-700 text-lg">
          {" "}
          Track and manage your {orders.length}{" "}
          {orders.length === 1 ? "order" : "orders"}{" "}
        </p>{" "}
      </div>
      <div className="max-w-6xl mx-auto space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4 border-b border-amber-200">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <p className="text-sm text-amber-600">Order ID</p>
                  <p className="font-mono font-semibold text-amber-900">
                    #{order.id}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {/* ORDER STATUS */}
                  <div
                    className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium border ${getOrderStatusColor(
                      order.order_status
                    )}`}
                  >
                    {getOrderStatusIcon(order.order_status)}
                    <span>{order.order_status}</span>
                  </div>

                  {/* CANCEL */}
                  {order.order_status !== "DELIVERED" &&
                    order.order_status !== "CANCELLED" && (
                      <button
                       onClick={() => setConfirmCancelOrderId(order.id)}
                        disabled={cancellingOrder === order.id}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    )}
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-amber-700 mb-2">
                Order Date: {new Date(order.created_at).toLocaleDateString()}
              </p>
              <p className="text-2xl font-bold text-amber-600 mb-4">
                ₹{order.total_amount}
              </p>

              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between bg-amber-50 p-4 rounded-xl mb-2"
                >
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span>₹{Number(item.price) * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {confirmCancelOrderId && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Cancel Order?
      </h3>

      <p className="text-gray-600 mb-6">
        Are you sure you want to cancel this order? This action cannot be undone.
      </p>

      <div className="flex justify-end space-x-3">
        <button
          onClick={() => setConfirmCancelOrderId(null)}
          className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700"
        >
          No, Keep Order
        </button>

        <button
          onClick={async () => {
            await handleCancelOrder(confirmCancelOrderId);
            setConfirmCancelOrderId(null);
          }}
          className="px-4 py-2 rounded-lg bg-red-600 text-white"
        >
          Yes, Cancel Order
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
