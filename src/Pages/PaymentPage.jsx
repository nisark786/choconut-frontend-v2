// src/pages/Payment.jsx
import { useEffect, useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import loadRazorpay from "../helpers/loadRazorpay";
import { CreditCard, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { motion } from "framer-motion";

export default function Payment() {
  const { fetchCart } = useContext(UserContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const orderId = state?.orderId;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!orderId) {
      toast.error("Invalid transaction session");
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
      toast.error("Failed to retrieve order details");
    }
  };

  const startPayment = async () => {
    setLoading(true);

    const razorpayLoaded = await loadRazorpay();
    if (!razorpayLoaded) {
      toast.error("Security module failed to load");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/payments/create/", { order_id: orderId });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: "INR",
        name: "Choconut Premium",
        description: `Ref: #${orderId}`,
        order_id: res.data.razorpay_order_id,
        handler: async function (response) {
          try {
            await api.post("/payments/verify/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            toast.success("Transaction Finalized");
            await fetchCart();
            navigate(`/confirmation/${orderId}`);
          } catch {
            toast.error("Verification protocol failed");
          }
        },
        modal: {
          ondismiss: () => toast.info("Payment session terminated"),
        },
        theme: {
          color: "#4a2c2a", // Deep Cocoa brand color for Razorpay UI
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Initiation error");
    }
    setLoading(false);
  };

  if (!order) return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#4a2c2a]/10 border-t-[#4a2c2a] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffcf8] flex items-center justify-center px-4 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Branding/Status Header */}
        <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-amber-900/10 mb-4 shadow-sm">
                <Lock className="w-6 h-6 text-[#4a2c2a]" />
            </div>
            <h1 className="text-sm font-black uppercase tracking-[0.3em] text-[#4a2c2a]">
              Secure Checkout
            </h1>
        </div>

        {/* Payment Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-[#4a2c2a]/10 border border-amber-900/5 p-8 md:p-10">
          
          <div className="space-y-8">
            {/* Order Details Table */}
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-amber-900/5">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-900/40">Reference ID</span>
                <span className="text-xs font-bold text-[#4a2c2a]">#{order.id}</span>
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-amber-900/40 mb-1">Total Due</p>
                <div className="flex items-baseline space-x-1">
                    <span className="text-4xl font-black text-[#4a2c2a]">₹{order.total_amount}</span>
                    <span className="text-xs font-bold text-[#4a2c2a]/40">INR</span>
                </div>
              </div>
            </div>

            {/* Security Assurance */}
            <div className="bg-[#fffcf8] rounded-2xl p-5 border border-amber-900/10">
              <div className="flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-green-700 mt-0.5" />
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-green-900">Encrypted Terminal</p>
                    <p className="text-[11px] font-medium text-amber-900/60 leading-relaxed mt-1">
                        Your transaction is processed through a 256-bit encrypted gateway.
                    </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={startPayment}
              disabled={loading}
              className="group relative w-full bg-[#4a2c2a] text-[#fffcf8] py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all hover:bg-[#3d2422] disabled:opacity-50 shadow-xl shadow-[#4a2c2a]/20"
            >
              <span className="flex items-center justify-center gap-3">
                {loading ? (
                    <span className="w-4 h-4 border-2 border-[#fffcf8]/30 border-t-[#fffcf8] rounded-full animate-spin"></span>
                ) : (
                    <>
                        Authorize Payment
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Footer Compliance */}
        <div className="mt-10 flex items-center justify-center space-x-6 grayscale opacity-40">
            <span className="text-[9px] font-bold uppercase tracking-tighter text-[#4a2c2a]">Powered by Razorpay</span>
            <div className="h-4 w-px bg-amber-900/20"></div>
            <div className="flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-tighter text-[#4a2c2a]">PCI DSS Compliant</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
}