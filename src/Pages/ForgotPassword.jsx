// src/pages/ForgotPassword.jsx
import { useState } from "react";
import api from "../api/axios";
import { Mail, ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/password-reset/", { email: email.trim().toLowerCase() });
      setSubmitted(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Email not found or server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-amber-100">
        <div className="text-center mb-8">
          <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-amber-600 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900">Forgot Password?</h2>
          <p className="text-amber-600 mt-2">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleResetRequest} className="space-y-6">
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 group-focus-within:text-amber-600 transition-colors" />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-70"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span>Send Reset Link</span>}
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100">
              Check your inbox! We've sent instructions to <strong>{email}</strong>.
            </div>
            <button onClick={() => setSubmitted(false)} className="text-amber-700 text-sm hover:underline">
              Didn't get the email? Try again.
            </button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/login" className="inline-flex items-center text-amber-700 font-semibold hover:text-amber-900 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}