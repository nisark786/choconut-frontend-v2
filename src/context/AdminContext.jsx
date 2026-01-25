import { createContext, useState, useEffect,useContext,useMemo } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";
import { UserContext } from "./UserContext";

export const AdminContext = createContext();

export default function AdminProvider({ children }) {
  const { currentUser, loadingAuth } = useContext(UserContext);
const [dashboard, setDashboard] = useState({
  stats: {
    total_revenue: 0,
    total_orders: 0,
    total_products: 0,
    total_users: 0,
  },
  monthly_revenue: [],
  order_status: [],
  top_products: [],
});
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
  const [productPagination, setProductPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
  });
  const [productStats, setProductStats] = useState({
  total: 0,
  low_stock: 0,
  out_of_stock: 0,
  categories: 0,
});

  const [editingOrderId, setEditingOrderId] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState("");
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  useEffect(() => {
    const initAdmin = async () => {
      if (loadingAuth) return;
      if (currentUser && (currentUser.is_staff || currentUser.isAdmin)) {
        try {
          // No need to call bootstrapAuth here again, UserProvider handled it
          await Promise.all([
            fetchDashboard(),
            fetchUsers(),
            fetchOrders(),
            fetchProducts()
          ]);
        } catch (err) {
          console.error("Admin data fetch failed", err);
        } finally {
          setLoadingAdmin(false);
        }
      } else {
        setLoadingAdmin(false);
      }
    };

    initAdmin();
  }, [currentUser, loadingAuth]);

  const fetchProducts = async ({
  page = 1,
  search = "",
  category = "all",
  stock = "",
  premium = "",
} = {}) => {
  const params = { page };

  if (search) params.search = search;
  if (category !== "all") params.category = category;
  if (stock) params.stock = stock;
  if (premium !== "") params.premium = premium;

  const res = await api.get("admin/products/", { params });

  setProducts(res.data.results.products);
  setProductStats(res.data.results.stats);
  setProductPagination({
    count: res.data.count,
    next: res.data.next,
    previous: res.data.previous,
    page,
  });
};


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
    console.log("ADD PRODUCT PAYLOAD →", newProduct);
    try {
      const res = await api.post(`admin/products/`, newProduct);
      await fetchProducts();
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

  const getProductById = async (id) => {
  const res = await api.get(`/admin/products/${id}/`);
  return res.data;
};


  const updateProduct = async (id, updatedData) => {
    try {
      const res = await api.patch(`admin/products/${id}/`, updatedData);
      await fetchProducts();
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
          o.id === orderId ? { ...o, order_status: updatedStatus } : o,
        ),
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

  const fetchDashboard = async () => {
  const res = await api.get("/admin/dashboard/");
  setDashboard(res.data);
};


  const value = useMemo(() => ({
    dashboard,
    users,
    userStats,
    userPagination,
    fetchUsers,
    orders,
    orderStats,
    orderPagination,
    fetchOrders,
    products,
    productStats,
    productPagination,
    fetchProducts,
    addProduct,
    deleteProduct,
    getProductById,
    updateProduct,
    handleSaveStatus,
    setEditingOrderId,
    setUpdatedStatus,
    editingOrderId,
    updatedStatus,
    userAction,
}), [dashboard, users, userStats, userPagination, orders, orderStats, orderPagination, products, productStats, productPagination, editingOrderId, updatedStatus]);

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}
