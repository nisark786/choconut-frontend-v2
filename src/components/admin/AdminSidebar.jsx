import { useNavigate ,useLocation } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  LogOut,
  Shield,
  X,
  UsersIcon
} from "lucide-react";

const menuItems = [
   { id: "dashboard", name: "Overview", icon: BarChart3, path: "/admin/dashboard" },
  { id: "products", name: "Products", icon: Package, path: "/admin/products" },
  { id: "orders", name: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { id: "users", name: "Users", icon: UsersIcon, path: "/admin/users" }
];

export default function AdminSidebar({ 
  activeTab, 
  onTabChange, 
  sidebarOpen, 
  onSidebarToggle,
  onNavigateToStore 
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (item)=>{
      onTabChange(item.id);
      navigate(item.path);
      onSidebarToggle(false); //for mobile side bar cloding
    }


  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-amber-900 to-orange-900 transform ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
      
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-amber-800">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-white font-bold text-xl">Admin</span>
        </div>
        
        <button 
          onClick={() => onSidebarToggle(false)}
          className="lg:hidden p-1 text-amber-200 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="mt-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { handleNavigation(item) }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? "bg-amber-700 text-white shadow-lg"
                : "text-amber-100 hover:bg-amber-800 hover:text-white"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={onNavigateToStore}
          className="w-full flex items-center space-x-3 px-4 py-3 text-amber-100 hover:bg-amber-800 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Back to Store</span>
        </button>
      </div>
    </div>
  );
}