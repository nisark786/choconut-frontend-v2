// src/components/admin/AdminLayout.jsx
import { useState ,useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/admin/products')) setActiveTab('products');
    else if (path.includes('/admin/orders')) setActiveTab('orders');
    else if (path.includes('/admin/users')) setActiveTab('users');
    else setActiveTab('dashboard');
  }, [location.pathname]);



  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={setSidebarOpen}
        onNavigateToStore={() => navigate("/")}
      />

      <div className="lg:ml-64">
        <AdminHeader
          sidebarOpen={sidebarOpen}
          onSidebarToggle={setSidebarOpen}
          activeTab={activeTab}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
