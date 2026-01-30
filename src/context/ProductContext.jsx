import { createContext, useState, useCallback } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  // Premium State
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [hasFetchedPremium, setHasFetchedPremium] = useState(false);

  // Shop State (Dynamic)
  const [shopProducts, setShopProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingShop, setLoadingShop] = useState(false);

  // 1. Fetch Premium (Static Cache)
  const fetchPremiumProducts = useCallback(async (forceRefresh = false) => {
    if (hasFetchedPremium && !forceRefresh) return;
    try {
      setLoadingPremium(true);
      const res = await api.get("products/premium/");
      const productsArray = res.data.results || res.data;
      const filtered = productsArray.filter((p) => p.premium === true);
      setPremiumProducts(filtered);
      setHasFetchedPremium(true);
    } catch (err) {
      toast.error("Failed to load our premium selection");
    } finally {
      setLoadingPremium(false);
    }
  }, [hasFetchedPremium]);

  // 2. Fetch Shop Products (Dynamic Filters)
  const fetchShopProducts = useCallback(async (filters) => {
    setLoadingShop(true);
    try {
      const { currentPage, search, categoryFilter, premiumFilter, sortOrder } = filters;
      
      const params = { page: currentPage };
      if (search) params.search = search;
      if (categoryFilter !== "all") params["category__name"] = categoryFilter;
      if (premiumFilter !== "all") params.premium = premiumFilter === "premium";
      if (sortOrder === "low") params.ordering = "price";
      if (sortOrder === "high") params.ordering = "-price";

      const res = await api.get("products/", { params });
      
      setShopProducts(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 12));
    } catch (err) {
      toast.error("Error fetching products");
    } finally {
      setLoadingShop(false);
    }
  }, []);

  const clearProductCache = () => {
    setHasFetchedPremium(false);
    setPremiumProducts([]);
  };

  return (
    <ProductContext.Provider
      value={{
        premiumProducts,
        loadingPremium,
        fetchPremiumProducts,
        shopProducts,
        totalPages,
        loadingShop,
        fetchShopProducts,
        clearProductCache,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}