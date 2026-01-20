import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { UserContext } from "../context/UserContext";
import {
  CheckCircle,
  Package,
  Truck,
  Clock,
  Home,
  ShoppingBag,
} from "lucide-react";

const getEstimatedDelivery = (createdAt) => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
};

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { currentUser } = useContext(UserContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}/`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to load order", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (!order) return <p className="text-center">Order not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-amber-900 mb-3">
            Order Confirmed!
          </h1>

          <p className="text-amber-700 text-lg">
            Thank you {currentUser?.name}! Your order has been placed successfully.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Details */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-amber-600" />
                Order Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Order ID</span>
                  <span className="font-mono font-semibold">
                    #{order.id}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Order Date</span>
                  <span>
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-bold text-amber-600">
                    ₹{order.total_amount}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5 text-amber-600" />
                Delivery & Payment
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="bg-amber-100 px-3 py-1 rounded-full text-sm">
                    {order.order_status}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Est. Delivery</span>
                  <span>{getEstimatedDelivery(order.created_at)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Payment</span>
                  <span className="text-green-600 font-semibold">
                    Paid
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="bg-amber-500 text-white py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
          >
            <Package className="w-5 h-5" />
            View My Orders
          </Link>

          <Link
            to="/shops"
            className="border border-amber-300 py-3 rounded-xl font-semibold flex justify-center items-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-amber-600 flex justify-center gap-2">
            <Home className="w-4 h-4" /> Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
