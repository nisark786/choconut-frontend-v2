import { toast } from "react-toastify";
// src/components/admin/sections/ProductsManagement.jsx
import { useContext, useState } from "react";
import {
  Plus,
  Search,
  Filter,
  Download,
  Edit,
  Eye,
  Trash2,
  Package,
} from "lucide-react";
import DataTable from "../DataTable";
import { AdminContext } from "../../../context/AdminContext";
import { useNavigate, Link } from "react-router-dom";

export default function ProductsManagement() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { products, deleteProduct } = useContext(AdminContext);

  const lowStock = products.filter((item) => item.stock > 0 && item.stock < 10);
  const outOfStock = products.filter((item) => item.stock === 0);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "outofstock") {
      return product.stock === 0;
    } else if (selectedCategory === "premium") {
      return product.premium;
    } else if (selectedCategory === "standard") {
      return !product.premium;
    } else {
      return (
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === "all" || product.category === selectedCategory)
      );
    }
  });

  const getProductStatus = (stock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < 10) return "Low Stock";
    return "Active";
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "bg-green-100 text-green-800",
      "Low Stock": "bg-amber-100 text-amber-800",
      "Out of Stock": "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const confirmToast = (message, onConfirm) => {
    toast(
      ({ closeToast }) => (
        <div className="text-center">
          <p className="font-medium text-gray-800 mb-3">{message}</p>
          <div className="flex justify-center space-x-3">
            <button
              onClick={() => {
                onConfirm();
                closeToast();
              }}
              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
            >
              Yes
            </button>
            <button
              onClick={closeToast}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm"
            >
              No
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        position: "top-center",
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Product Management
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your product catalog and inventory
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg mt-4 sm:mt-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600">{lowStock.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStock.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600">Categories</p>
          <p className="text-2xl font-bold text-gray-900">2</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
            >
              <option value="all">All Categories</option>
              <option value="nuts">Nuts</option>
              <option value="chocolates">Chocolates</option>
              <option value="outofstock">Out Of Stock</option>
              <option value="premium">Premium</option>
              <option value="standard">Standard</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <DataTable
          headers={[
            "Product",
            "Category",
            "Price",
            "Stock",
            "Status",
            "Type",
            "Actions",
          ]}
          data={filteredProducts}
          emptyMessage="No products found"
          renderRow={(product) => (
            <tr
              key={product.id}
              className={`border-b border-gray-100 hover:bg-gray-50`}
            >
              <td className="py-3 px-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">ID : {product.id}</p>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-gray-600">{product.category}</td>
              <td className="py-3 px-4 font-medium text-gray-900">
                {product.price}
              </td>
              <td className="py-3 px-4">
                <p
                  className={`font-medium ${
                    product.stock === 0 ? "text-red-600" : "text-gray-900"
                  }`}
                >
                  {product.stock}
                </p>
                <p className="text-sm text-gray-500">units</p>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    getProductStatus(product.stock)
                  )}`}
                >
                  {getProductStatus(product.stock)}
                </span>
              </td>
              <td className="py-3 px-4">
                <p
                  className={`font-medium ${
                    product.premium ? "text-blue-600" : "text-gray-900"
                  }`}
                >
                  {product.premium ? "Premium" : "Standard"}
                </p>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/admin/products/${product.id}/edit`}
                    className="p-1 text-amber-600 hover:text-amber-700 transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() =>
                      confirmToast(
                        "Are you sure you want to delete this product?",
                        () => deleteProduct(product.id)
                      )
                    }
                    className="p-1 text-red-600 hover:text-red-700 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          )}
        />
      </div>
    </div>
  );
}
