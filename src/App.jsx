import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import ScrollToTop from "./components/ScrolToTop";
import ProtectedRoute from "./components/ProtectedRoutes";
import AdminRoutes from "./components/routes/AdminRoutes";
import AdminLayout from "./components/admin/AdminLayout";
import UserLayout from "./components/routes/UserLayout";
import PageLoader from "./components/ui/PageLoader"; // Create a sleek progress bar

// Lazy Load Pages (Optimization: Code Splitting)
const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const SignUp = lazy(() => import("./Pages/SignUp"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const Shops = lazy(() => import("./Pages/Shops"));
const Cart = lazy(() => import("./Pages/Cart"));
const Wishlist = lazy(() => import("./Pages/Wishlist"));
const Profile = lazy(() => import("./Pages/Profile"));
const OrderConfirmation = lazy(() => import("./Pages/OrderConfirmation"));
const ShipmentPage = lazy(() => import("./Pages/ShipmentPage"));
const PaymentPage = lazy(() => import("./Pages/PaymentPage"));
const OrdersPage = lazy(() => import("./Pages/OrdersPage"));
const AddFeedback = lazy(() => import("./Pages/AddFeedback"));
const ChangePassword = lazy(() => import("./Pages/ChangePassword"));
const VerifyOTP = lazy(() => import("./Pages/OTPVerify"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const TermsAndConditions = lazy(() => import("./Pages/TermsAndConditions"));

// Admin Sections
const DashboardOverview = lazy(() => import("./components/admin/sections/DashboardOverview"));
const ProductsManagement = lazy(() => import("./components/admin/sections/ProductsManagement"));
const OrdersManagement = lazy(() => import("./components/admin/sections/OrdersManagement"));
const UsersManagement = lazy(() => import("./components/admin/sections/UsersManagement"));
const AddProduct = lazy(() => import("./components/admin/pages/AddProduct"));
const EditProduct = lazy(() => import("./components/admin/pages/EditProduct"));
const UserDetails = lazy(() => import("./components/admin/pages/UserDetails"));

function App() {
  return (
    <Router>
      <ScrollToTop />
      {/* Suspense handles the loading state for lazy components */}
      <Suspense fallback={<PageLoader />}>
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
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Route>

        </Routes>
      </Suspense>

      <ToastContainer
        position="top-center"
        autoClose={3000}
        theme="colored" // Modern 2026 look
        hideProgressBar
      />
    </Router>
  );
}

export default App;