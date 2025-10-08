// src/pages/Cart.jsx
import { useContext, useState, useEffect } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart, Package, Truck } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Cart() {
  const { currentUser, updateCartQty, removeFromCart ,cart} = useContext(UserContext);
  const navigate = useNavigate();
  const [loadingIds, setLoadingIds] = useState([]);
 

  const startLoading = (id) => setLoadingIds((prev) => [...prev, id]);
  const stopLoading = (id) =>
    setLoadingIds((prev) => prev.filter((i) => i !== id));

const increaseQty = async (item) => {
  if (item.qty >= item.stock) {
    toast.error(`Only ${item.stock} items in stock!`);
    return;
  }
  startLoading(item.id);
  try {
    await updateCartQty(item.id, item.qty + 1);
    toast.success("Quantity increased!");
  } catch {
    toast.error("Failed to update quantity");
  }
  stopLoading(item.id);
};

const decreaseQty = async (item) => {
  if (item.qty <= 1) return removeCartItem(item.id);

  startLoading(item.id);
  try {
    await updateCartQty(item.id, item.qty - 1);
    toast.info("Quantity decreased!");
  } catch {
    toast.error("Failed to update quantity");
  }
  stopLoading(item.id);
};

// Remove Item
const removeCartItem = async (id) => {
  startLoading(id);
  try {
    await removeFromCart(id);
    toast.info("Item removed from cart!");
  } catch {
    toast.error("Failed to remove item");
  }
  stopLoading(id);
};

  // ------------------ Proceed to Payment ------------------
  const handleCheckout = () => {
    if (!cart.length) return;

    // Save cart & subtotal in localStorage for Payment & Shipping pages
    localStorage.setItem("checkoutCart", JSON.stringify(cart));
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    localStorage.setItem("checkoutTotal", subtotal);

    // Navigate to Payment page
    navigate("/payment");
  };

  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = subtotal > 499 ? 0 : 49;
  const total = subtotal + shipping;

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-4">Shopping Cart</h2>
          <p className="text-amber-700 mb-6">Please login to view your cart and start shopping!</p>
          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-600 hover:to-amber-700 transition-all duration-200 inline-flex items-center space-x-2"
          >
            <span>Login to Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <ShoppingBag className="w-16 h-16 text-amber-400" />
          </div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">Your Cart is Empty</h2>
          <p className="text-amber-700 mb-8 text-lg">
            Discover our delicious collection of chocolates and nuts!
          </p>
          <button
            onClick={() => navigate("/shops")}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-8 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Start Shopping</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-3">Shopping Cart</h1>
          <p className="text-amber-700 text-lg">
            Review your {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center space-x-2">
                <ShoppingCart className="w-6 h-6 text-amber-600" />
                <span>Cart Items</span>
              </h2>
              
              <div className="space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-sm"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-amber-900 mb-1">{item.name}</h3>
                        <p className="text-lg font-bold text-amber-600 mb-2">₹{item.price}</p>
                        <p className={`text-sm font-medium ${
                          item.stock === 0 ? "text-red-600" : "text-green-600"
                        }`}>
                          {item.stock === 0
                            ? "Out of Stock"
                            : `${item.stock} available`}
                        </p>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 bg-white rounded-lg border border-amber-200 p-1">
                        <button
                          onClick={() => decreaseQty(item)}
                          disabled={loadingIds.includes(item.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-600 hover:bg-amber-100 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <span className="w-8 text-center font-semibold text-amber-900">
                          {item.qty}
                        </span>
                        
                        <button
                          onClick={() => increaseQty(item)}
                          disabled={loadingIds.includes(item.id) || item.qty >= item.stock}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-amber-600 hover:bg-amber-100 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeCartItem(item.id)}
                        disabled={loadingIds.includes(item.id)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 disabled:opacity-30 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right ml-4">
                      <p className="text-lg font-bold text-amber-900">
                        ₹{item.price * item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-amber-200 p-6">
              <h2 className="text-xl font-bold text-amber-900 mb-4 flex items-center space-x-2">
                <Package className="w-5 h-5 text-amber-600" />
                <span>Order Summary</span>
              </h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Items ({totalItems})</span>
                  <span className="text-amber-900">₹{subtotal}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-amber-700">Shipping</span>
                  <span className={shipping === 0 ? "text-green-600 font-semibold" : "text-amber-900"}>
                    {shipping === 0 ? "FREE" : `₹${shipping}`}
                  </span>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-2 rounded-lg">
                    🚚 Add ₹{500 - subtotal} more for free shipping!
                  </div>
                )}

                <hr className="border-amber-200" />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span className="text-amber-900">Total</span>
                  <span className="text-amber-600">₹{total}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <Truck className="w-5 h-5" />
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-4">
              <div className="flex items-center space-x-2 text-amber-700 mb-2">
                <Truck className="w-4 h-4" />
                <span className="font-semibold">Free Shipping</span>
              </div>
              <p className="text-sm text-amber-600">
                Free delivery on orders above ₹499. Orders are processed within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}