// src/pages/Signup.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, Star } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api/axios";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      await api.post("/signup/", payload);

      toast.success("Account created. Please verify your email.");
      navigate("/verify-otp",{ state: { email: email.trim().toLowerCase() } }); 
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          err.response?.data?.detail ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-8 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          
          <h2 className="text-2xl font-bold text-amber-900 mb-2">
            Create Your Account
          </h2>
          <p className="text-amber-700">
            Join us for sweet deals and delicious treats!
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6 sm:p-8">
          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder:text-amber-400 text-amber-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                <input
                  type="email"
                  placeholder="choconut@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 placeholder:text-amber-400 text-amber-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-amber-400" />
                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 bg-amber-50 border border-amber-200 rounded-xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Star className="w-5 h-5" />
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-amber-200"></div>
            <span className="px-3 text-amber-600 text-sm">
              Already have an account?
            </span>
            <div className="flex-1 border-t border-amber-200"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 text-amber-700 hover:text-amber-900 font-medium transition-colors duration-200 border border-amber-300 hover:border-amber-500 px-6 py-2 rounded-lg bg-amber-50/50"
            >
              <span>Sign in to your account</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
