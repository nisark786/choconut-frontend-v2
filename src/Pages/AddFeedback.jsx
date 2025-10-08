// src/pages/AddReview.jsx
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Star,
  ArrowLeft,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  Send
} from "lucide-react";

export default function AddFeedback() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(UserContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Review form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState(null);
  const [pros, setPros] = useState("");
  const [cons, setCons] = useState("");

useEffect(() => {
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/products/${id}`);
      setProduct(res.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  fetchProduct();
}, [id]);


  const getRatingLabel = (rating) => {
    const labels = {
      1: "Poor",
      2: "Fair",
      3: "Average",
      4: "Good",
      5: "Excellent"
    };
    return labels[rating] || "Select Rating";
  };


  const getRatingEmoji = (rating) => {
    const emojis = {
      1: <Frown className="w-6 h-6 text-red-500" />,
      2: <Meh className="w-6 h-6 text-orange-500" />,
      3: <Meh className="w-6 h-6 text-yellow-500" />,
      4: <Smile className="w-6 h-6 text-lime-500" />,
      5: <Smile className="w-6 h-6 text-green-500" />
    };
    return emojis[rating] || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast.error("Please login to submit a review");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (!title.trim() || !comment.trim()) {
      toast.error("Please fill in title and comment");
      return;
    }

    setSubmitting(true);

    try {
      // Submit review
      const reviewData = {
        productId: id,
        userId: currentUser.id,
        userName: currentUser.name,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        recommend,
        pros: pros.trim(),
        cons: cons.trim(),
        date: new Date().toISOString().split('T')[0],
      };

      const res = await axios.post("http://localhost:5000/reviews", reviewData);

      if (res.status) {
        toast.success("Review submitted successfully!");
        navigate(`/product/${id}`);
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 font-medium mr-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Write a Review</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Review Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating Section */}
              <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Overall Rating
                </h3>
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-12 h-12 ${
                              star <= (hoverRating || rating)
                                ? "text-amber-500 fill-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold text-gray-900">
                      {getRatingLabel(hoverRating || rating)}
                    </p>
                    <div className="flex items-center justify-center space-x-2 mt-2">
                      {getRatingEmoji(hoverRating || rating)}
                      <span className="text-lg text-gray-600">
                        ({hoverRating || rating}/5)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Would you recommend this product?
                </h3>
                
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setRecommend(true)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl border-2 transition-all ${
                      recommend === true
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-300 hover:border-green-400"
                    }`}
                  >
                    <ThumbsUp className="w-6 h-6" />
                    <span className="font-semibold">Yes, I recommend</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setRecommend(false)}
                    className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-xl border-2 transition-all ${
                      recommend === false
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-300 hover:border-red-400"
                    }`}
                  >
                    <ThumbsDown className="w-6 h-6" />
                    <span className="font-semibold">No, I don't</span>
                  </button>
                </div>
              </div>

              {/* Review Details */}
              <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-sm space-y-6">
                <div>
                  <label htmlFor="title" className="block text-lg font-bold text-gray-900 mb-3">
                    Review Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience in a few words"
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors"
                    maxLength={100}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {title.length}/100
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-lg font-bold text-gray-900 mb-3">
                    Your Review *
                  </label>
                  <textarea
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share details of your experience with this product..."
                    rows={6}
                    className="w-full px-4 py-3 border-2 border-amber-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-colors resize-none"
                    maxLength={1000}
                  />
                  <div className="text-right text-sm text-gray-500 mt-1">
                    {comment.length}/1000
                  </div>
                </div>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="pros" className="block text-lg font-bold text-gray-900 mb-3">
                      What you liked
                    </label>
                    <textarea
                      id="pros"
                      value={pros}
                      onChange={(e) => setPros(e.target.value)}
                      placeholder="Things you appreciated about the product..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors resize-none"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cons" className="block text-lg font-bold text-gray-900 mb-3">
                      What could be better
                    </label>
                    <textarea
                      id="cons"
                      value={cons}
                      onChange={(e) => setCons(e.target.value)}
                      placeholder="Areas where the product could improve..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-red-200 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 py-4 px-6 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:border-gray-400 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={submitting || rating === 0 || !title.trim() || !comment.trim()}
                  className="flex-1 flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Review</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}