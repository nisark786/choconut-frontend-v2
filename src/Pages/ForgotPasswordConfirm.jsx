// src/pages/ResetPasswordConfirm.jsx
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Lock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function ResetPasswordConfirm() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await api.post("/password-reset-confirm/", { uid, token, new_password: newPassword });
      toast.success("Password reset successful! Please login.");
      navigate("/login");
    } catch (err) {
      toast.error("Invalid or expired link. Please request a new one.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-amber-900 mb-6 text-center">Set New Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="password"
              placeholder="New Password"
              className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:border-amber-500 outline-none"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:border-amber-500 outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-bold hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}