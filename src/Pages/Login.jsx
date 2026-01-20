import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { setAccessToken, setLoginInProgress } from "../api/auth";
import { GoogleLogin } from "@react-oauth/google";


export default function Login() {
  const { currentUser, setCurrentUser, loadingAuth } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !loadingAuth) {
      if(currentUser.isAdmin){
        navigate("/admin/dashboard")
      }else{
        navigate("/");
      }
    }
  }, [currentUser, loadingAuth, navigate]);

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const cleanEmail = email.trim().toLowerCase();

    if (!isValidEmail(cleanEmail)) {
      return toast.error("Please enter a valid email address");
    }

    setLoading(true);
    setLoginInProgress(true);

    try {
      const res = await api.post("/login/", { email: cleanEmail, password });
      
      setAccessToken(res.data.access);
      setCurrentUser(res.data.user);

      toast.success("Welcome back to ChocoNut!");
      navigate("/");
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) {
        toast.error("Invalid email or password");
      } else if (status === 400) {
        toast.error("Please fill in all fields");
      } else {
        toast.error("Service unavailable. Please try again later.");
      }
    } finally {
      setLoginInProgress(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4">
      <div className="max-w-md w-full">
       

        <div className="bg-white rounded-3xl shadow-2xl border border-amber-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-amber-900 mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="choconut@gmail.com"
                  className="w-full pl-10 pr-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-amber-300 text-amber-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-amber-900">
                  Password
                </label>
                <Link to="/forgot-password" title="Recover account" className="text-xs font-medium text-amber-600 hover:text-orange-600 transition-colors">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400 group-focus-within:text-amber-600 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-amber-50/50 border border-amber-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all placeholder:text-amber-300 text-amber-900"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400 hover:text-amber-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-amber-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-amber-400 font-medium">Or continue with</span>
            </div>
          </div>

          {/* Google Login with Layout Shield */}
          <div className="flex justify-center min-h-[44px]">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  setLoginInProgress(true);
                  const res = await api.post("/google/", {
                    token: credentialResponse.credential,
                  });
                  setAccessToken(res.data.access);
                  setCurrentUser(res.data.user);
                  toast.success("Welcome back!");
                  navigate("/");
                } catch (error) {
                  toast.error("Google authentication failed");
                } finally {
                  setLoginInProgress(false);
                }
              }}
              onError={() => toast.error("Google login failed")}
              theme="outline"
              shape="pill"
              size="large"
            />
          </div>

          {/* Signup Footer */}
          <div className="mt-6 pt-2 border-t border-amber-50 text-center">
            <p className="text-amber-600 text-sm mb-4">New to ChocoNut?</p>
            <Link
              to="/signup"
              className="w-full flex items-center justify-center space-x-2 text-amber-800 font-bold py-3 px-4 rounded-xl border-2 border-amber-100 hover:bg-amber-50 transition-all"
            >
              <span>Create Account</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


