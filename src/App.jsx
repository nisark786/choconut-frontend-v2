import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Core Components
import ScrollToTop from "./components/ScrolToTop";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminRoutes from "./components/routes/AdminRoutes";
import AdminLayout from "./components/admin/AdminLayout";
import UserLayout from "./components/routes/UserLayout";
import NotificationPage from "./Pages/NotificationPage";
import ChatSidebar from "./components/ChatBoat";

// 1. Direct Imports for All Pages
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import SignUp from "./Pages/SignUp";
import ProductDetails from "./Pages/ProductDetails";
import Shops from "./Pages/Shops";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import Profile from "./Pages/Profile";
import OrderConfirmation from "./Pages/OrderConfirmation";
import ShipmentPage from "./Pages/ShipmentPage";
import PaymentPage from "./Pages/PaymentPage";
import OrdersPage from "./Pages/OrdersPage";
import AddFeedback from "./Pages/AddFeedback";
import ChangePassword from "./Pages/ChangePassword";
import VerifyOTP from "./Pages/OTPVerify";
import NotFound from "./Pages/NotFound";
import TermsAndConditions from "./Pages/TermsAndConditions";

// 2. Direct Imports for Admin Sections
import DashboardOverview from "./components/admin/sections/DashboardOverview";
import ProductsManagement from "./components/admin/sections/ProductsManagement";
import OrdersManagement from "./components/admin/sections/OrdersManagement";
import UsersManagement from "./components/admin/sections/UsersManagement";
import AddProduct from "./components/admin/pages/AddProduct";
import EditProduct from "./components/admin/pages/EditProduct";
import UserDetails from "./components/admin/pages/UserDetails";
import AdminNotificationManager from "./components/admin/pages/AdminNotificationManagerPage";
import AdminNotificationPage from "./components/admin/pages/AdminNotificationPage";

function App() {
  return (
    <>
      <ScrollToTop />
      
      {/* We removed <Suspense> because all components are now loaded immediately */}
      <ChatSidebar />
      
      <Routes>
        {/* 1. ADMIN ROUTES GROUP */}
        <Route element={<AdminRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="users/:id" element={<UserDetails />} />
            <Route path="messages" element={<AdminNotificationManager />} />
            <Route path="notifications" element={<AdminNotificationPage />} />
          </Route>
        </Route>

        {/* 2. PUBLIC & USER ROUTES GROUP */}
        <Route element={<UserLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/shops" element={<Shops />} />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />

          {/* Private User Routes (Authenticated Only) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/shipment" element={<ShipmentPage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/product/:id/review" element={<AddFeedback />} />
            <Route path="/confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/notifications" element={<NotificationPage />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored"
        hideProgressBar
      />
    </>
  );
}

export default App;