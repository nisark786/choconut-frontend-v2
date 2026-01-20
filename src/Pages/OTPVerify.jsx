import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "react-toastify";
import api from "../api/axios";
import { UserContext } from "../context/UserContext";
import { setAccessToken } from "../api/auth";

export default function VerifyOTP() {
  const {setCurrentUser} = useContext(UserContext)
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [timer, setTimer] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const emailFromState = location.state?.email;
    if (!emailFromState) {
      toast.error("Session expired. Please signup again.");
      navigate("/signup");
      return;
    }
    setEmail(emailFromState);
  }, [location.state, navigate]);

  // 2. Cooldown Timer Logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // 3. Resend OTP Function
  const handleResendOTP = async () => {
    if (timer > 0 || resendLoading) return;

    setResendLoading(true);
    try {
      await api.post(`/otp/resend/`, {
        email: email,
        purpose: "signup",
      });
      toast.success("A fresh OTP has been sent!");
      setTimer(60); // Increase cooldown to 60s after a resend
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // 4. Verify OTP Function
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;

    setLoading(true);
    try {
      const res = await api.post(`/otp/verify/`, {
        email: email,
        otp,
        purpose: "signup",
      });
      console.log(res.data)

      setAccessToken(res.data.access);
      setCurrentUser(res.data.user);
      toast.success("Account verified! Welcome.");
      navigate("/", { replace: true }); 
    } catch (err) {
      toast.error(err.response?.data?.detail || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Verify OTP</h1>
          <p className="text-amber-700">OTP sent to</p>
          <p className="font-medium text-amber-900 break-all">{email}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              className="w-full text-center tracking-widest text-lg py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
            />

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 hover:shadow-lg transition-shadow"
            >
              {loading ? "Verifying..." : "Verify OTP"}
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={handleResendOTP}
              disabled={resendLoading || timer > 0}
              className="text-amber-700 font-medium flex items-center justify-center gap-2 mx-auto disabled:text-amber-400 transition-colors"
            >
              <RotateCcw
                size={16}
                className={resendLoading ? "animate-spin" : ""}
              />
              {resendLoading
                ? "Sending..."
                : timer > 0
                  ? `Resend in ${timer}s`
                  : "Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
