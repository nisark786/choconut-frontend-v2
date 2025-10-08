// src/components/admin/AdminHeader.jsx
import { Menu, LogOut } from "lucide-react";
import { useContext } from "react";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function AdminHeader({
  sidebarOpen,
  onSidebarToggle,
  activeTab,
}) {
  const { currentUser, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const sectionTitles = {
    overview: "Dashboard Overview",
    products: "Product Management",
    orders: "Order Management",
    users: "Users Management",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={() => onSidebarToggle(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="ml-4 text-2xl font-bold text-gray-900">
            {sectionTitles[activeTab] || "Admin Dashboard"}
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {currentUser?.name.slice(0, 1).toUpperCase()}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
