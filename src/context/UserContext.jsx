// src/context/UserContext.jsx
import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();
const API_URL = "https://choco-nut-server.onrender.com";


export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem("currentUser");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const fetchCurrentUser = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${API_URL}/users/${currentUser.id}`);
      setCurrentUser(res.data); // update local state and localStorage
    } catch (err) {
      console.error("Fetch current user error:", err);
    }
  };

  fetchCurrentUser();
}, []);


  // ---------------- SYNC LOCAL STORAGE ----------------
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      initUserData(currentUser.id);
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const initUserData = async (userId) => {
    try {
      
      try {
        const cartRes = await axios.get(`${API_URL}/carts/${userId}`);
        setCart(cartRes.data.items || []);
      } catch (err) {
        if (err.response?.status === 404) {
          await axios.post(`${API_URL}/carts`, { id: userId, items: [] });
          setCart([]);
        } else throw err;
      }

    
      try {
        const wishRes = await axios.get(`${API_URL}/wishlists/${userId}`);
        setWishlist(wishRes.data.items || []);
      } catch (err) {
        if (err.response?.status === 404) {
          await axios.post(`${API_URL}/wishlists`, { id: userId, items: [] });
          setWishlist([]);
        } else throw err;
      }

      
      const orderRes = await axios.get(`${API_URL}/orders?userId=${userId}`);
      setOrders(orderRes.data || []);
    } catch (err) {
      console.error("Init user data error:", err);
    }
  };

  // logout user

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    setWishlist([]);
    setOrders([]);
    localStorage.removeItem("currentUser");
  };

  // setcart
  const fetchCart = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${API_URL}/carts/${currentUser.id}`);
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  // addtocart
  const addToCart = async (product) => {
    if (!currentUser) return;
    const exists = cart.some((i) => i.id === product.id);
    const newCart = exists ? cart : [...cart, { ...product, qty: 1 }];
    try {
      await axios.patch(`${API_URL}/carts/${currentUser.id}`, { items: newCart });
      setCart(newCart);
    } catch (err) {
      console.error("Add to cart error:", err);
    }
  };

  //remove from cart
 const removeFromCart = async (productId) => {
  if (!currentUser) return;

  try {
    const res = await axios.get(`${API_URL}/carts/${currentUser.id}`);
    const cartData = res.data;
    const newCart = (cartData.items || []).filter((item) => item.id !== productId);
    await axios.patch(`${API_URL}/carts/${currentUser.id}`, { items: newCart });
    setCart(newCart);
  } catch (err) {
    console.error("Error removing item from cart:", err);
  }
};


  const updateCartQty = async (productId, qty) => {
    const newCart = cart.map((item) =>
      item.id === productId ? { ...item, qty } : item
    );
    try {
      await axios.patch(`${API_URL}/carts/${currentUser.id}`, { items: newCart });
      setCart(newCart);
    } catch (err) {
      console.error("Update cart qty error:", err);
    }
  };

  // fethwishlist
  const fetchWishlist = async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${API_URL}/wishlists/${currentUser.id}`);
      setWishlist(res.data?.items || []);
    } catch (err) {
      console.error("Fetch wishlist error:", err);
    }
  };

  const toggleWishlist = async (product) => {
    const exists = wishlist.some((i) => i.id === product.id);
    const newWishlist = exists
      ? wishlist.filter((i) => i.id !== product.id)
      : [...wishlist, product];
    try {
      await axios.patch(`${API_URL}/wishlists/${currentUser.id}`, {
        items: newWishlist,
      });
      setWishlist(newWishlist);
    } catch (err) {
      console.error("Toggle wishlist error:", err);
    }
  };

  // fetch orfers
 const fetchOrders = async () => {
  if (!currentUser) return;
  try {
    const res = await axios.get(`${API_URL}/orders?userId=${currentUser.id}`);
    const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(sorted || []);
  } catch (err) {
    console.error("Fetch orders error:", err);
  }
};



const addOrder = async (order) => {
  if (!currentUser) return;

  const newOrder = {
    userId: currentUser.id,
    items: order.items,
    total: order.total,
    status: "Processing",
    createdAt: new Date().toISOString(),
  };

  try {
    //  Save order
    await axios.post(`${API_URL}/orders`, newOrder);

    // Update product stock
    for (const item of order.items) {
      // Fetch current product
      const res = await axios.get(`${API_URL}/products/${item.id}`);
      const product = res.data;

      // Calculate new stock
      const updatedStock = Math.max(product.stock - item.qty, 0);

      // Update product stock in bd.json
      await axios.patch(`${API_URL}/products/${item.id}`, { stock: updatedStock });
    }

    // 3. Clear cart
    await axios.patch(`${API_URL}/carts/${currentUser.id}`, { items: [] });
    setCart([]);

    // 4. Refresh orders
    fetchOrders();
  } catch (err) {
    console.error("Error placing order:", err);
  }
};

  const cancelOrder = async (orderId) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, { status: "Cancelled" });
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: "Cancelled" } : o
        )
      );
    } catch (err) {
      console.error("Cancel order error:", err);
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        logout,
        cart,
        fetchCart,
        addToCart,
        removeFromCart,
        updateCartQty,
        wishlist,
        fetchWishlist,
        toggleWishlist,
        orders,
        fetchOrders,
        addOrder,
        cancelOrder,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
