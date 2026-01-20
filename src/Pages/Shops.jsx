// src/pages/Shops.jsx
import { useEffect, useState, useContext } from "react";
import ProductCard from "../components/Products/ProductCard";
import SearchBar from "../components/SearchBar";
import { UserContext } from "../context/UserContext";
import api from "../api/axios";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

export default function Shops() {
  const { cart } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [premiumFilter, setPremiumFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      const params = { page: currentPage };

      if (search) params.search = search;
      if (categoryFilter !== "all")
        params["category__name"] = categoryFilter;
      if (premiumFilter !== "all")
        params.premium = premiumFilter === "premium";
      if (sortOrder === "low") params.ordering = "price";
      if (sortOrder === "high") params.ordering = "-price";

      const res = await api.get("products/", { params });

      setProducts(res.data.results);
      setTotalPages(Math.ceil(res.data.count / 12));
    };

    fetchProducts();
  }, [currentPage, search, categoryFilter, premiumFilter, sortOrder]);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "chocolates", label: "Chocolates" },
    { value: "nuts", label: "Nuts" },
  ];

  const premiumOptions = [
    { value: "all", label: "All Products" },
    { value: "premium", label: "Premium Only" },
    { value: "non-premium", label: "Standard" },
  ];

  const sortOptions = [
    { value: "", label: "Recommended" },
    { value: "low", label: "Price: Low to High" },
    { value: "high", label: "Price: High to Low" },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-3">
            Our Delicious Collection
          </h1>
          <p className="text-amber-700 text-lg max-w-2xl mx-auto">
            Discover premium chocolates and fresh nuts - perfect treats for
            every occasion!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <SearchBar searchQuery={search} setSearchQuery={setSearch} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center space-x-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-lg font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>

            <div
              className={`flex flex-col lg:flex-row gap-4 w-full ${
                showMobileFilters ? "block" : "hidden lg:flex"
              }`}
            >
              {/* Category */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Premium */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Quality
                </label>
                <select
                  value={premiumFilter}
                  onChange={(e) => setPremiumFilter(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                >
                  {premiumOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-amber-900 mb-2">
                  Sort By
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full bg-amber-50 border border-amber-200 rounded-xl px-4 py-3"
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-amber-700 font-medium whitespace-nowrap">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {products.length ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-amber-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-amber-200"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold text-amber-900">
              No products found
            </h3>
          </div>
        )}
      </div>
    </section>
  );
}
