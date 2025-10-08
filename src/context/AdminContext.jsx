import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AdminContext = createContext();
export default function AdminProvider({ children }) {
  const API_URL = "http://localhost:5000";

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [carts, setCarts] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [orders, setOrders] = useState([]);


  const [editingOrderId, setEditingOrderId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");

  //for fetch endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes,
          productsRes,
          cartsRes,
          wishlistsRes,
          ordersRes,
        ] = await Promise.all([
          axios.get(`${API_URL}/users`),
          axios.get(`${API_URL}/products`),
          axios.get(`${API_URL}/carts`),
          axios.get(`${API_URL}/wishlists`),
          axios.get(`${API_URL}/orders`),
        ]);

        setUsers(usersRes.data || []);
        setProducts(productsRes.data || []);
        setCarts(cartsRes.data || []);
        setWishlists(wishlistsRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  const addProduct = async (newProduct) => {
    try {
      const res = await axios.post(`${API_URL}/products`, newProduct);
      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/products/${id}`, updatedData);
      setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user.name;
  };

  const handleSaveStatus = async (orderId) => {
    try {
      await axios.patch(`${API_URL}/orders/${orderId}`, {
        status: updatedStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: updatedStatus } : order
        )
      );

      toast.success("Order status updated!");
    } catch (err) {
      toast.error("Failed to update order!");
    }
    setEditingOrderId(null);
  };


  const blockUser = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await axios.patch(`${API_URL}/users/${userId}`, { isBlock: newStatus });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isBlock: newStatus } : u
        )
      );
    } catch (error) {
      console.error("user block status:", error);
    }
  };


   const accessAdmin = async (userId, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      await axios.patch(`${API_URL}/users/${userId}`, {
        isAdmin: newStatus,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, isAdmin: newStatus } : u
        )
      );
    } catch (error) {
      console.error("access admin status:", error);
    }
  };
  const value = {
    users,
    products,
    carts,
    wishlists,
    orders,
    addProduct,
    deleteProduct,
    updateProduct,
    getUserName,
    handleSaveStatus,
    setEditingOrderId,
    setUpdatedStatus,
    editingOrderId,
    updatedStatus,
    blockUser,
    accessAdmin,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
