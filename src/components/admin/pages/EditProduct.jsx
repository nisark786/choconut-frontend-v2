// src/pages/EditProduct.jsx
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../../../context/AdminContext";
import { 
  ArrowLeft, 
  Check, 
  Package, 
  DollarSign, 
  Tag, 
  Box, 
  FileText,
  Image,
  Star,
  Upload,
  Eye
} from "lucide-react";
import { toast } from "react-toastify";

function EditProduct() {
  const { updateProduct,getProductById} = useContext(AdminContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    category: "",
    premium: false,
    stock: "",
    description: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  const loadProduct = async () => {
    try {
      const product = await getProductById(id);

      setFormData({
        name: product.name || "",
        price: product.price || "",
        image: product.image || "",
        category: product.category_name || "",
        premium: product.premium || false,
        stock: product.stock || "",
        description: product.description || "",
      });

      setImagePreview(product.image || "");
    } catch (err) {
      console.error("Failed to load product", err);
    }
  };

  loadProduct();
}, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Update image preview
    if (name === "image") {
      setImagePreview(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateProduct(id, {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      });

      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      toast.error("Error updating product");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = [
    "Chocolates",
    "Nuts",
  ];

  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium mr-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Products</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
              <p className="text-amber-700">Update product details and information</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Package className="w-4 h-4 mr-2 text-amber-600" />
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                    required
                  />
                </div>

                {/* Price & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <DollarSign className="w-4 h-4 mr-2 text-amber-600" />
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                      <Box className="w-4 h-4 mr-2 text-amber-600" />
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                      required
                      min="0"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-amber-600" />
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image URL */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Image className="w-4 h-4 mr-2 text-amber-600" />
                    Image URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                    required
                  />
                </div>

                {/* Premium Product Toggle */}
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                      <Star className="w-4 h-4 text-amber-600" />
                      <span>Premium Product</span>
                    </label>
                    <p className="text-sm text-amber-700 mt-1">
                      Mark this product as premium for special highlighting
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="premium"
                      checked={formData.premium}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-amber-600" />
                    Description *
                  </label>
                  <textarea
                    name="description"
                    placeholder="Enter product description..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors resize-none"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate("/admin/products")}
                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:border-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-6 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        <span>Update Product</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Preview Sidebar */}
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Image Preview</h3>
              {imagePreview ? (
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x400?text=Invalid+Image+URL";
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-square bg-amber-50 rounded-xl border-2 border-dashed border-amber-200 flex items-center justify-center">
                  <div className="text-center text-amber-600">
                    <Image className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Product Summary */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Product Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900 truncate ml-2 max-w-[120px]">
                    {formData.name || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium text-gray-900">
                    {formData.price ? `₹${formData.price}` : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium text-gray-900 truncate ml-2 max-w-[120px]">
                    {formData.category || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium text-gray-900">{formData.stock || "0"} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Premium:</span>
                  <span className={`font-medium ${formData.premium ? "text-amber-600" : "text-gray-600"}`}>
                    {formData.premium ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    formData.stock > 0 ? "text-green-600" : "text-red-600"
                  }`}>
                    {formData.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="font-semibold text-amber-900 mb-3 flex items-center">
                <Eye className="w-4 h-4 mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate(`/product/${id}`)}
                  className="w-full text-left p-2 text-sm text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  View on Store
                </button>
                <button
                  onClick={() => window.open(`/product/${id}`, '_blank')}
                  className="w-full text-left p-2 text-sm text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                >
                  Open in New Tab
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to reset all changes?")) {
                      const productToEdit = products.find((p) => p.id === id);
                      if (productToEdit) {
                        setFormData({
                          name: productToEdit.name || "",
                          price: productToEdit.price || "",
                          image: productToEdit.image || "",
                          category: productToEdit.category || "",
                          premium: productToEdit.premium || false,
                          stock: productToEdit.stock || "",
                          description: productToEdit.description || ""
                        });
                        setImagePreview(productToEdit.image || "");
                      }
                    }
                  }}
                  className="w-full text-left p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Reset Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;