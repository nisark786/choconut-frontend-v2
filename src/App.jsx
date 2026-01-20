import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import ProductDetails from "./Pages/ProductDetails";
import Shops from "./Pages/Shops";
import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";
import Profile from "./Pages/Profile";
import OrderConfirmation from "./Pages/OrderConfirmation";
import ShipmentPage from "./Pages/ShipmentPage";
import PaymentPage from "./Pages/PaymentPage";
import ProtectedRoute from "./components/ProtectedRoutes";
import SignUp from "./Pages/SignUp";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrdersPage from "./Pages/OrdersPage";
import NotFound from "./Pages/NotFound";
import AddFeedback from "./Pages/AddFeedback";
import ChangePassword from "./Pages/ChangePassword";
import TermsAndConditions from "./Pages/TermsAndConditions";
import ScrollToTop from "./components/ScrolToTop";
import AdminRoutes from "./components/routes/AdminRoutes";
import AdminLayout from "./components/admin/AdminLayout";
import UserLayout from "./components/routes/UserLayout";
import DashboardOverview from "./components/admin/sections/DashboardOverview";
import ProductsManagement from "./components/admin/sections/ProductsManagement";
import OrdersManagement from "./components/admin/sections/OrdersManagement";
import AddProduct from "./components/admin/pages/AddProduct";
import EditProduct from "./components/admin/pages/EditProduct";
import UsersManagement from "./components/admin/sections/UsersManagement";
import UserDetails from "./components/admin/pages/UserDetails";
import VerifyOTP from "./Pages/OTPVerify";

function App() {
  

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route element={<AdminRoutes />}>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="products" element={<ProductsManagement />} />
            <Route path="orders" element={<OrdersManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="users/:id" element={<UserDetails />} />
          </Route>
        </Route>


        <Route element={<UserLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/shops" element={<Shops />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />





          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="product/:id/review"
            element={
              <ProtectedRoute>
                <AddFeedback />
              </ProtectedRoute>
            }
          />
          <Route
            path="change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route path="/termsandconditions" element={<TermsAndConditions />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                <PaymentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipment"
            element={
              <ProtectedRoute>
                <ShipmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmation/:orderId"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
              </ProtectedRoute>
            }
          />


        </Route>
      </Routes>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            draggable
          />
    </Router>
  );
}

export default App;
