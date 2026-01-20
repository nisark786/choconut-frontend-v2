import { createContext, useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { bootstrapAuth } from "../api/bootstrapAuth";
import { isLoginInProgress } from "../api/auth";

export const AdminContext = createContext();

export default function AdminProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [userPagination, setUserPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
  });
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    notVerified: 0,
    newThisMonth: 0,
  });

  const [orders, setOrders] = useState([]);
  const [orderPagination, setOrderPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
  });
  const [orderStats, setOrderStats] = useState({});
  const [products, setProducts] = useState([]);

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    const initAdmin = async () => {
      if (isLoginInProgress()) {
        await new Promise((r) => setTimeout(r, 300));
      }

      try {
        await bootstrapAuth();
        await fetchUsers();
        await fetchOrders();

        const [productsRes] = await Promise.all([api.get("admin/products/")]);

        setProducts(productsRes.data.results || []);
      } catch (err) {
        if (err.response?.status !== 401 && err.response?.status !== 403) {
          console.error("Admin bootstrap failed:", err);
          toast.error("Failed to load admin data");
        }
      } finally {
        setLoadingAdmin(false);
      }
    };

    initAdmin();
  }, []);

  const fetchUsers = async ({ page = 1, search = "", status = "all" } = {}) => {
    const params = {
      page,
      include_orders: true,
    };

    if (search) params.search = search;
    if (status !== "all") params.status = status;

    const res = await api.get("admin/users/", { params });

    setUsers(res.data.results.results);
    setUserStats({
      total: res.data.results.stats.total,
      active: res.data.results.stats.active,
      blocked: res.data.results.stats.blocked,
      notVerified: res.data.results.stats.not_verified,
      newThisMonth: res.data.results.stats.new_this_month,
    });

    setUserPagination({
      count: res.data.count,
      next: res.data.next,
      previous: res.data.previous,
      page,
    });
  };

  const fetchOrders = async ({
    page = 1,
    search = "",
    status = "all",
  } = {}) => {
    const res = await api.get("admin/orders/", {
      params: { page, search, status },
    });

    setOrders(res.data.results.results);
    setOrderStats(res.data.results.stats);
    setOrderPagination({
      count: res.data.count,
      next: res.data.next,
      previous: res.data.previous,
      page,
    });
  };

  const addProduct = async (newProduct) => {
    try {
      const res = await api.post(`admin/products/`, newProduct);
      setProducts((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("Add product error:", err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await api.delete(`admin/products/${id}/`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete product error:", err);
    }
  };

  const updateProduct = async (id, updatedData) => {
    try {
      const res = await api.put(`admin/products/${id}/`, updatedData);
      setProducts((prev) => prev.map((p) => (p.id === id ? res.data : p)));
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  const handleSaveStatus = async ({ orderId, page, search, status }) => {
  try {
    await api.patch(`admin/orders/${orderId}/`, {
      order_status: updatedStatus,
    });

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, order_status: updatedStatus } : o
      )
    );

    await fetchOrders({ page, search, status });

    toast.success("Order status updated!");
  } catch (err) {
    toast.error("Failed to update order!");
  } finally {
    setEditingOrderId(null);
  }
};


  const userAction = async (userId, action) => {
    try {
      const res = await api.patch(`admin/users/${userId}/action/`, {
        action,
      });

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                is_blocked:
                  action === "block"
                    ? true
                    : action === "unblock"
                      ? false
                      : u.is_blocked,
                isAdmin:
                  action === "make_admin"
                    ? true
                    : action === "remove_admin"
                      ? false
                      : u.isAdmin,
              }
            : u,
        ),
      );
      setUserStats((prev) => {
        if (action === "block") {
          return {
            ...prev,
            active: prev.active - 1,
            blocked: prev.blocked + 1,
          };
        }
        if (action === "unblock") {
          return {
            ...prev,
            active: prev.active + 1,
            blocked: prev.blocked - 1,
          };
        }
        return prev;
      });

      await fetchUsers({
      page: userPagination.page,
      search: "",
      status: "all",
    });

      toast.success(res.data.message || "Action applied");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Action failed");
    }
  };

  const value = {
    users,
    userStats,
    userPagination,
    fetchUsers,
    orders,
    orderStats,
    orderPagination,
    fetchOrders,
    products,
    addProduct,
    deleteProduct,
    updateProduct,
    handleSaveStatus,
    setEditingOrderId,
    setUpdatedStatus,
    editingOrderId,
    updatedStatus,
    userAction,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
