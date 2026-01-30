import { createContext, useState, useCallback } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [premiumProducts, setPremiumProducts] = useState([]);
  const [loadingPremium, setLoadingPremium] = useState(false);
  const [hasFetchedPremium, setHasFetchedPremium] = useState(false);

  const fetchPremiumProducts = useCallback(async (forceRefresh = false) => {
    if (hasFetchedPremium && !forceRefresh) return;

    try {
      setLoadingPremium(true);
      const res = await api.get("products/premium/");
      const productsArray = res.data.results || res.data;

      // Filter for premium status
      const filtered = productsArray.filter(
        (product) => product.premium === true
      );

      setPremiumProducts(filtered);
      setHasFetchedPremium(true);
    } catch (err) {
      toast.error("Failed to load our premium selection");
    } finally {
      setLoadingPremium(false);
    }
  }, [hasFetchedPremium]);

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
        clearProductCache,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}