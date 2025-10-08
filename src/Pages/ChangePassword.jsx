// src/pages/ChangePassword.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import { Eye, EyeOff, Shield, ArrowLeft, Check } from "lucide-react";

export default function ChangePassword() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("At least 8 characters");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One uppercase letter");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One lowercase letter");
    }

    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One number");
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push("One special character");
    }

    return { score, feedback };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === "newPassword") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.newPassword || !formData.confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (passwordStrength.score < 3) {
      toast.error("Please choose a stronger password");
      return;
    }

    setLoading(true);

    try {
      setLoading(true)
      const updateRes = await axios.patch(`https://choco-nut-server.onrender.com/users/${currentUser.id}`, {
    password: formData.newPassword,
  });

  if (updateRes.status === 200) {
    const updatedUser = { 
      ...currentUser, 
      password: formData.newPassword,
    };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    toast.success("Password changed successfully!");
    navigate("/profile");
  } else {
    throw new Error("Failed to update password");
  }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Failed to change password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStrengthColor = (score) => {
    if (score === 0) return "bg-gray-200";
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-amber-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = (score) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium mr-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Profile</span>
          </button>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
          {/* Card Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2">Change Password</h1>
            <p className="text-amber-700">Secure your account with a new password</p>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-amber-900 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-700 transition-colors"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Meter */}
              {formData.newPassword && (
                <div className="mt-3 space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-amber-700 font-medium">Password strength:</span>
                    <span className={`font-bold ${
                      passwordStrength.score <= 2 ? "text-red-600" :
                      passwordStrength.score <= 3 ? "text-amber-600" :
                      passwordStrength.score <= 4 ? "text-blue-600" : "text-green-600"
                    }`}>
                      {getStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength.score)}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  
                  {/* Password Requirements */}
                  <div className="space-y-1 text-xs text-amber-700">
                    <div className="flex items-center space-x-2">
                      <Check className={`w-3 h-3 ${
                        formData.newPassword.length >= 8 ? "text-green-500" : "text-gray-300"
                      }`} />
                      <span>At least 8 characters</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className={`w-3 h-3 ${
                        /[A-Z]/.test(formData.newPassword) ? "text-green-500" : "text-gray-300"
                      }`} />
                      <span>One uppercase letter</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className={`w-3 h-3 ${
                        /[a-z]/.test(formData.newPassword) ? "text-green-500" : "text-gray-300"
                      }`} />
                      <span>One lowercase letter</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className={`w-3 h-3 ${
                        /[0-9]/.test(formData.newPassword) ? "text-green-500" : "text-gray-300"
                      }`} />
                      <span>One number</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className={`w-3 h-3 ${
                        /[^A-Za-z0-9]/.test(formData.newPassword) ? "text-green-500" : "text-gray-300"
                      }`} />
                      <span>One special character</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-900 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-700 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2 flex items-center space-x-2 text-sm">
                  {formData.newPassword === formData.confirmPassword ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-green-600 font-medium">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                      <span className="text-red-600 font-medium">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !formData.newPassword || !formData.confirmPassword || formData.newPassword !== formData.confirmPassword || passwordStrength.score < 3}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Changing Password...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Change Password</span>
                </>
              )}
            </button>
          </form>

          {/* Security Tips */}
          <div className="mt-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <h3 className="font-semibold text-amber-900 mb-2 flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              Security Tips
            </h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>1. Use a unique password for this account</li>
              <li>2. Avoid common words and personal information</li>
              <li>3. Consider using a password manager</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}