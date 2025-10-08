// src/components/PremiumProducts.jsx
import { useEffect, useState} from "react";
import ProductCard from "./ProductCard";
import { Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PremiumProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/products", {
          signal: controller.signal,
        });

        const premiumProducts = res.data.filter(
          (product) => product.premium === true
        );
        setProducts(premiumProducts);
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          console.error("Error fetching premium products:", err);
          toast.error("Failed to load premium products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 relative">

      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full shadow-2xl mb-6">
          <Crown className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-amber-900 mb-4">
          Premium Collection
        </h2>
        <p className="text-xl text-amber-700 max-w-2xl mx-auto leading-relaxed">
          Indulge in our exclusive selection of premium chocolates and nuts,
          crafted with the finest ingredients for an extraordinary experience.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-semibold text-amber-900 mb-2">
            Loading Premium Collection
          </h3>
        </div>
      )}

      {/* Empty */}
      {!loading && products.length === 0 && (
        <div className="text-center py-16">
          <h3 className="text-2xl font-bold text-amber-900 mb-3">
            No Premium Products Available
          </h3>
          <button
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold"
            onClick={() => navigate("/shops")}
          >
            View All Products
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
