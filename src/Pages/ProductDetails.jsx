// src/pages/ProductDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  ShoppingCart,
  Heart,
  Star,
  Package,
  Truck,
  Plus,
  Minus,
  Check,
  Home,
  Store,
} from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    removeFromCart,
    toggleWishlist,
    cart,
    wishlist,
  } = useContext(UserContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const inCart = cart.some((item) => item.id === product?.id);
  const inWishlist = wishlist?.some((item) => item.id === product?.id);
  const isOutOfStock = product?.stock === 0;
  
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/reviews?productId=${id}`
        );
        setReviews(res.data); // axios response data is here
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };

    fetchReviews();
  }, [id]);

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  // Rating distribution
  const ratingDistribution = {
    5: reviews.filter((review) => review.rating === 5).length,
    4: reviews.filter((review) => review.rating === 4).length,
    3: reviews.filter((review) => review.rating === 3).length,
    2: reviews.filter((review) => review.rating === 2).length,
    1: reviews.filter((review) => review.rating === 1).length,
  };

  
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? "text-amber-500 fill-amber-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center bg-gradient-to-br from-amber-50 to-orange-50">
        <Package className="w-16 h-16 text-amber-600 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          Product Not Found
        </h2>
        <button
          onClick={() => navigate("/shops")}
          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-full font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-lg"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Breadcrumb - matching navbar style */}
      <div className="bg-white/80 backdrop-blur-sm py-3 px-4 border-b border-amber-100">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-1 hover:text-amber-600 transition-colors group"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <span className="text-amber-400">/</span>
            <button
              onClick={() => navigate("/shops")}
              className="flex items-center space-x-1 hover:text-amber-600 transition-colors group"
            >
              <Store className="w-4 h-4" />
              <span>Shop</span>
            </button>
            <span className="text-amber-400">/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-amber-100 p-6 flex justify-center shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="h-96 object-contain"
              />
              {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold text-lg">
            Out of Stock
          </div>
        )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="text-amber-700 font-bold">
                  {averageRating}
                </span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500 ml-1" />
              </div>
              <span className="text-amber-700 font-medium">
                {reviews.length} Ratings
              </span>
              <span className="text-gray-300">|</span>
              <span className="text-green-600 font-medium">1k+ Bought</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="text-4xl font-bold text-gray-900">
                  ₹{product.price}
                </span>
              </div>
              <p className="text-sm text-gray-600">Inclusive of all taxes</p>
            </div>

            {/* Offers - matching navbar gradient */}
            <div className="border border-amber-200 rounded-2xl bg-white/80 p-6 space-y-3 backdrop-blur-sm">
              <h3 className="font-bold text-lg text-gray-900">
                Available offers
              </h3>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Bank Offer</span>{" "}
                  10% off on SBI Credit Card, up to ₹125 on orders of ₹1000 and
                  above
                  <span
                    className="text-amber-600 ml-2 cursor-pointer font-medium"
                    onClick={() => navigate("/termsandconditions")}
                  >
                    T&C
                  </span>
                </p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">Bank Offer</span>{" "}
                  5% Unlimited Cashback on Choconut Axis Bank Credit Card
                  <span
                    className="text-amber-600 ml-2 cursor-pointer font-medium"
                    onClick={() => navigate("/termsandconditions")}
                  >
                    T&C
                  </span>
                </p>
              </div>
              <div className="flex items-start">
                <Check className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-700">
                  <span className="font-medium text-gray-900">
                    Special Price
                  </span>{" "}
                  Get extra 5% off (price inclusive of discount)
                  <span
                    className="text-amber-600 ml-2 cursor-pointer font-medium"
                    onClick={() => navigate("/termsandconditions")}
                  >
                    T&C
                  </span>
                </p>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="w-10 h-10 flex items-center justify-center border-2 border-amber-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <Minus className="w-4 h-4 text-amber-600" />
                </button>
                <span className="font-bold text-lg w-8 text-center text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((prev) => Math.min(product.stock, prev + 1))
                  }
                  className="w-10 h-10 flex items-center justify-center border-2 border-amber-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-colors"
                >
                  <Plus className="w-4 h-4 text-amber-600" />
                </button>
              </div>
            </div>

            {/* Stock Status */}
            <div
              className={`font-bold ${
                product.stock > 10 ? "text-green-600" : "text-amber-600"
              }`}
            >
              {product.stock > 10 ? "In Stock" : `Only ${product.stock} left!`}
            </div>

            {/* Delivery Info */}
            <div className="space-y-4 bg-white/80 border border-amber-200 rounded-2xl p-5">
              <div className="flex">
                <Truck className="w-6 h-6 text-amber-600 mr-3 mt-0.5" />
                <div>
                  <p className="font-bold text-gray-900">FREE Delivery</p>

                  <p className="text-sm text-amber-600 font-medium">
                    Order in next 3 hrs 14 mins
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons - matching navbar buttons */}
            <div className="flex space-x-4 pt-2">
              <button
              disabled={isOutOfStock}
                onClick={() => {
                  inCart ? removeFromCart(product.id) : addToCart(product);
                }}
                className={`flex-1 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-lg flex items-center justify-center disabled:opacity-50
    ${
      inCart
        ? "bg-red-500 hover:bg-red-600 text-white"
        : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 hover:shadow-xl"
    }`}
              >
                <ShoppingCart className="w-6 h-6 mr-3" />
                {inCart ? "Remove" : "Add To Cart"}
              </button>
              <button
                className="flex-1 bg-white border-2 border-amber-500 text-amber-600 hover:bg-amber-50 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 shadow-sm hover:shadow-md"
                onClick={() => {
                  addToCart(product);
                  navigate("/payment");
                }}
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist & Share */}
            <div className="flex space-x-6 pt-4">
              <button
                onClick={() => {
                  toggleWishlist(product);
                }}
                className="flex items-center text-gray-700 hover:text-pink-500 transition-colors group"
              >
                <Heart
                  className={`w-5 h-5 mr-2 group-hover:scale-110 transition-transform ${
                    inWishlist ? "fill-pink-500" : "group-hover:scale-110"
                  }`}
                />
                {inWishlist ? "Remove From" : "Add To"} Wishlist
              </button>
              <button
                onClick={() =>
                  navigate(`/product/${id}/review`, { state: { product } })
                }
                className="w-60 flex items-center justify-center space-x-2 py-3 px-6 border-2 border-amber-500 text-amber-600 rounded-xl font-bold hover:bg-amber-50 transition-colors"
              >
                <Star className="w-5 h-5" />
                <span>Write a Review</span>
              </button>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 bg-white rounded-2xl border border-amber-100 overflow-hidden shadow-sm">
          <div className="flex border-b border-amber-100">
            <button
              className={`px-8 py-4 font-bold text-lg transition-colors ${
                activeTab === "description"
                  ? "text-amber-600 border-b-2 border-amber-500 bg-amber-50"
                  : "text-gray-600 hover:text-amber-600"
              }`}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button
              className={`px-8 py-4 font-bold text-lg transition-colors ${
                activeTab === "specifications"
                  ? "text-amber-600 border-b-2 border-amber-500 bg-amber-50"
                  : "text-gray-600 hover:text-amber-600"
              }`}
              onClick={() => setActiveTab("specifications")}
            >
              Specifications
            </button>
            <button
              className={`px-8 py-4 font-bold text-lg transition-colors ${
                activeTab === "reviews"
                  ? "text-amber-600 border-b-2 border-amber-500 bg-amber-50"
                  : "text-gray-600 hover:text-amber-600"
              }`}
              onClick={() => setActiveTab("reviews")}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="p-8">
            {activeTab === "description" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Product Description
                </h3>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === "specifications" && (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Product Specifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex justify-between py-3 border-b border-amber-100">
                    <span className="text-gray-600 font-medium">Name</span>
                    <span className="font-bold text-gray-900">
                      {product.name}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-amber-100">
                    <span className="text-gray-600 font-medium">Category</span>
                    <span className="font-bold text-gray-900">
                      {product.category}
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-amber-100">
                    <span className="text-gray-600 font-medium">Type</span>
                    <span className="font-bold text-gray-900">
                      {product.premium ? "Premium" : "Standard"}
                    </span>
                  </div>

                  <div className="flex justify-between py-3 border-b border-amber-100">
                    <span className="text-gray-600 font-medium">
                      Shelf Life
                    </span>
                    <span className="font-bold text-gray-900">24 Months</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-amber-100">
                    <span className="text-gray-600 font-medium">
                      Return Policy
                    </span>
                    <span className="font-bold text-gray-900">
                      10 Days After The Delivery
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                {reviews.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Rating Summary */}
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center mb-6">
                        <div className="text-4xl font-bold text-gray-900 mr-4">
                          {averageRating.toFixed(1)}
                        </div>
                        <div>
                          {renderStars(averageRating)}
                          <p className="text-gray-600 mt-2">
                            {reviews.length} Reviews
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <div key={rating} className="flex items-center">
                            <span className="w-12 text-sm text-gray-600">
                              {rating} Star
                            </span>
                            <div className="flex-1 h-2 bg-amber-100 rounded-full mx-3">
                              <div
                                className="h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                                style={{
                                  width: `${
                                    (ratingDistribution[rating] /
                                      reviews.length) *
                                    100
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <span className="w-8 text-sm text-gray-600 text-right">
                              {ratingDistribution[rating]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">
                        All Reviews
                      </h3>
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div
                            key={review.id}
                            className="border-b border-amber-100 pb-6 last:border-b-0"
                          >
                            <div className="flex justify-between mb-3">
                              <div className="flex items-center">
                                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                                  {review.userName.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900">
                                    {review.userName}
                                  </p>
                                  <div className="flex items-center">
                                    {renderStars(review.rating)}
                                    {review.verified && (
                                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm text-gray-500">
                                {review.date}
                              </span>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2">
                              {review.title}
                            </h4>
                            <p className="text-gray-700">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-700 text-lg mb-4">
                      No reviews yet.
                    </p>
                    <button
                      onClick={() => navigate(`/product/${product.id}/review`)}
                      className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all"
                    >
                      Write a Review
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
