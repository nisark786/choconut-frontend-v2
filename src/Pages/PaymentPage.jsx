import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import loadRazorpay from "../helpers/loadRazorpay";
import { CreditCard, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { useContext } from "react";

export default function Payment() {

  const { fetchCart } = useContext(UserContext)
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid order");
      navigate("/cart");
      return;
    }
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}/`);
      setOrder(res.data);
    } catch {
      toast.error("Failed to load order");
    }
  };

  const startPayment = async () => {
    setLoading(true);

    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      toast.error("Razorpay SDK failed to load");
      setLoading(false);
      return;
    }

    try {
      // STEP 1: Create Razorpay order (backend)
      const res = await api.post("/payments/create/", {
        order_id: orderId,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "Choconut",
        description: `Order #${orderId}`,
        order_id: res.data.razorpay_order_id,

        handler: async function (response) {
          try {
            // STEP 2: Verify payment
            await api.post("/payments/verify/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Payment successful");
            await fetchCart()
            navigate(`/confirmation/${orderId}`);

          } catch {
            toast.error("Payment verification failed");
          }
        },

        modal: {
          ondismiss: () => {
            toast.info("Payment cancelled");
          },
        },

        theme: {
          color: "#f59e0b",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch {
      toast.error("Failed to initiate payment");
    }

    setLoading(false);
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
      <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-amber-200 p-6">
        <h1 className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-amber-600" />
          Payment
        </h1>

        {/* Order Summary */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-amber-700">Order ID</span>
            <span className="font-semibold">#{order.id}</span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-amber-600">₹{order.total_amount}</span>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-amber-50 p-3 rounded-xl text-sm text-amber-700 flex items-center gap-2 mb-6">
          <ShieldCheck className="w-4 h-4" />
          100% secure payments via Razorpay
        </div>

        {/* Pay Button */}
        <button
          onClick={startPayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2"
        >
          {loading ? "Processing..." : "Pay Now"}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
