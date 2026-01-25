// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { bootstrapAuth, resetBootstrapAuth } from "../api/bootstrapAuth";
import { toast } from "react-toastify";
import { clearAuth } from "../api/auth";
import { isLoginInProgress } from "../api/auth";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [cart, setCart] = useState({
    items: [],
    total_price: 0,
    total_items: 0,
  });
  const [wishlist, setWishlist] = useState([]);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [notifyMeList, setNotifyMeList] = useState([]);

  useEffect(() => {
    const initializeAuth = async () => {
      if (isLoginInProgress()) {
        await new Promise((r) => setTimeout(r, 300));
      }

      try {
        await bootstrapAuth();
        const res = await api.get("/me/");
        setCurrentUser(res.data);
      } catch (err) {
        console.error("Auth initialization failed:", err);
        setCurrentUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    initializeAuth();
  }, []);

  const logout = async () => {
    try {
      await api.post("/logout/");
    } catch (err) {
      toast.error("Logout Failed");
    }

    clearAuth(); // remove tokens
    resetBootstrapAuth(); // reset bootstrap flag for future logins
    setCurrentUser(null);
    setCart({ items: [], total_price: 0, total_items: 0 });
    setWishlist([]);
    setNotifyMeList([]);
  };

  useEffect(() => {
    if (currentUser) {
      // Run these in parallel for speed
      Promise.all([fetchCart(), fetchWishlist(),fetchNotifyMeList()]).finally(() => {
        setLoadingAuth(false);
      });
    } else if (!loadingAuth) {
      setLoadingAuth(false);
    }
  }, [currentUser]);

  const fetchCart = async () => {
    if (!currentUser) return;

    try {
      const res = await api.get("/cart/");

      setCart({
        items: res.data.items || [],
        total_price: res.data.cart_total || 0,
        total_items: res.data.items?.length || 0,
      });
    } catch (err) {
      console.error("Fetch cart failed", err);
      setCart({
        items: [],
        total_price: 0,
        total_items: 0,
      });
    }
  };

  const updateCartQty = async (productId, quantity) => {
    // 1. Keep a copy of the old cart
    const previousCart = { ...cart };

    // 2. Optimistically update UI
    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    }));

    try {
      const res = await api.patch("/cart/update/", {
        product_id: productId,
        quantity,
      });
      setCart({
        items: res.data.items || [],
        total_price: res.data.cart_total || 0,
        total_items: res.data.items?.length || 0,
      });
    } catch (err) {
      setCart(previousCart);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    const res = await api.delete("/cart/remove/", {
      data: { product_id: productId },
    });
    // Use the data returned from the server immediately
    setCart({
      items: res.data.items || [],
      total_price: res.data.cart_total || 0,
      total_items: res.data.items?.length || 0,
    });
  };

  const addToCart = async (productId) => {
    const res = await api.post("/cart/add/", {
      product_id: productId,
      quantity: 1,
    });
    setCart({
      items: res.data.items || [],
      total_price: res.data.cart_total || 0,
      total_items: res.data.items?.length || 0,
    });
  };

  const fetchWishlist = async () => {
    if (!currentUser) return;

    try {
      const res = await api.get("/wishlist/");
      const products = res.data.items.map((item) => item.product);
      setWishlist(products);
    } catch (err) {
      console.error("Fetch wishlist failed", err);
      setWishlist([]);
    }
  };

  const toggleWishlist = async (product) => {
    if (!currentUser) {
      toast.info("Please login to use wishlist");
      return;
    }

    const exists = wishlist.some((p) => p.id === product.id);
    const previousWishlist = [...wishlist];

    // OPTIMISTIC UPDATE: Change UI immediately
    if (exists) {
      setWishlist(wishlist.filter((p) => p.id !== product.id));
    } else {
      setWishlist([...wishlist, product]);
    }

    try {
      const res = await api.post("/wishlist/toggle/", {
        product_id: product.id,
      });

      toast.success(res.data.message);
    } catch (err) {
      setWishlist(previousWishlist);
      toast.error("Could not update wishlist");
    }
  };



  const fetchNotifyMeList = async () => {
  if (!currentUser) return;

  try {
    const res = await api.get("/notifications/notify-me/list/");
    const productIds = res.data.product_ids;
    setNotifyMeList(productIds);
  } catch (err) {
    console.error("Fetch notify-me list failed", err);
    setNotifyMeList([]);
  }
};

  // Add product to Notify Me
  const addToNotifyMe = async (productId) => {
    if (!currentUser) {
      toast.info("Please login to use Notify Me");
      return;
    }

    const prevList = [...notifyMeList];

    // Optimistic UI update
    if (!prevList.includes(productId)) {
      setNotifyMeList([...prevList, productId]);
    }

    try {
      await api.post("/notifications/notify-me/", { product_id: productId });
      toast.success("You will be notified when this product is back in stock!");
    } catch (err) {
      setNotifyMeList(prevList); // rollback
      toast.error("Failed to add. Try again.");
    }
  };

  // Remove product from Notify Me
  const removeFromNotifyMe = async (productId) => {
    if (!currentUser) return;

    const prevList = [...notifyMeList];

    // Optimistic UI update
    setNotifyMeList(prevList.filter((id) => id !== productId));

    try {
      await api.delete(`/notifications/notify-me/${productId}/`);
      toast.info("Notify Me removed for this product");
    } catch (err) {
      setNotifyMeList(prevList); // rollback
      toast.error("Failed to remove. Try again.");
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loadingAuth,
        logout,
        cart,
        setCart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartQty,
        wishlist,
        fetchWishlist,
        toggleWishlist,
        notifyMeList, // <- Add here
        addToNotifyMe, // <- Add here
        removeFromNotifyMe,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
