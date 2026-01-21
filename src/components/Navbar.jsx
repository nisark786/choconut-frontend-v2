import { useState, useEffect, useContext, memo } from "react";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Store,
  Home,
  Package,
  ChevronDown,
  LayoutDashboard
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  const { currentUser, cart, wishlist, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll logic for glassmorphism effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when changing pages
  useEffect(() => {
    setMenuOpen(false);
    setShowUserDropdown(false);
  }, [location]);

  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.length || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-2"
          : "bg-[#fffcf8] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          
          {/* LOGO AREA */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#4a2c2a] to-[#2d1b1a] rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                <span className="text-amber-50 font-bold text-lg tracking-tighter">CN</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-black text-[#2d1b1a] tracking-tight">
                Choco<span className="text-green-600">Nut</span>
              </span>
              <span className="text-[10px] font-bold text-amber-800 tracking-[0.2em] uppercase">Premium Treats</span>
            </div>
          </div>

          {/* DESKTOP NAVIGATION (Centered) */}
          <div className="hidden md:flex items-center space-x-1 bg-[#f3eae0]/50 p-1 rounded-full border border-amber-100">
            <NavIconLink to="/" icon={<Home size={18} />} label="Home" active={location.pathname === "/"} />
            <NavIconLink to="/shops" icon={<Store size={18} />} label="Shops" active={location.pathname === "/shops"} />
            <NavIconLink to="/orders" icon={<Package size={18} />} label="Orders" active={location.pathname === "/orders"} />
          </div>

          {/* ACTIONS & USER PROFILE */}
          <div className="hidden md:flex items-center space-x-2">
            <div className="flex items-center space-x-1 pr-2 border-r border-amber-200">
              <ActionButton 
                onClick={() => navigate("/wishlist")} 
                icon={<Heart size={20} />} 
                count={wishlistCount} 
                activeColor="text-rose-500" 
              />
              <ActionButton 
                onClick={() => navigate("/cart")} 
                icon={<ShoppingCart size={20} />} 
                count={cartCount} 
                activeColor="text-amber-700" 
              />
            </div>

            {currentUser ? (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 p-1.5 rounded-full bg-white border border-amber-100 hover:border-amber-300 transition-all shadow-sm"
                >
                  <div className="w-8 h-8 rounded-full bg-[#4a2c2a] text-amber-50 flex items-center justify-center font-bold text-sm">
                    {currentUser.name[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-[#2d1b1a] pr-1">
                    {currentUser.name.split(" ")[0]}
                  </span>
                  <ChevronDown size={14} className={`text-amber-800 transition-transform duration-300 ${showUserDropdown ? "rotate-180" : ""}`} />
                </button>

                {/* DROPDOWN MENU */}
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-amber-50 p-2 ring-1 ring-black/5"
                    >
                      <DropdownItem onClick={() => navigate("/profile")} icon={<User size={16} />} label="My Profile" />
                      {currentUser?.is_staff && (
                        <DropdownItem onClick={() => navigate("/admin")} icon={<LayoutDashboard size={16} />} label="Admin Dashboard" highlight />
                      )}
                      <div className="my-1 border-t border-amber-50" />
                      <DropdownItem onClick={handleLogout} icon={<LogOut size={16} />} label="Logout" danger />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="ml-2 px-6 py-2 bg-[#4a2c2a] text-white rounded-full font-bold text-sm hover:bg-[#36201f] transition-all shadow-md shadow-amber-900/20 active:scale-95"
              >
                Sign In
              </button>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl bg-amber-50 text-amber-900"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-amber-100 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <MobileLink to="/" icon={<Home size={20} />} label="Home" onClick={() => setMenuOpen(false)} />
              <MobileLink to="/shops" icon={<Store size={20} />} label="Shops" onClick={() => setMenuOpen(false)} />
              <MobileLink to="/orders" icon={<Package size={20} />} label="Orders" onClick={() => setMenuOpen(false)} />
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={() => navigate("/cart")} className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-amber-50 text-amber-900 font-bold border border-amber-100">
                  <ShoppingCart size={18} /> <span>Cart ({cartCount})</span>
                </button>
                <button onClick={() => navigate("/wishlist")} className="flex items-center justify-center space-x-2 p-3 rounded-xl bg-rose-50 text-rose-700 font-bold border border-rose-100">
                  <Heart size={18} /> <span>Wishlist</span>
                </button>
              </div>

              {currentUser ? (
                <div className="pt-2 space-y-2 border-t border-amber-50">
                   <button onClick={() => navigate("/profile")} className="w-full flex items-center space-x-3 p-3 text-[#2d1b1a] font-semibold">
                    <User size={20} /> <span>My Profile</span>
                   </button>
                   <button onClick={handleLogout} className="w-full flex items-center space-x-3 p-3 text-red-600 font-semibold bg-red-50 rounded-xl">
                    <LogOut size={20} /> <span>Logout</span>
                   </button>
                </div>
              ) : (
                <button onClick={() => navigate("/login")} className="w-full p-4 bg-[#4a2c2a] text-white rounded-xl font-bold">
                  Login / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

/* --- HELPER SUB-COMPONENTS (For Cleanliness & Performance) --- */

const NavIconLink = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`flex items-center space-x-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
      active 
        ? "bg-white text-amber-900 shadow-sm ring-1 ring-amber-100" 
        : "text-amber-800/60 hover:text-amber-900 hover:bg-white/50"
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const ActionButton = ({ icon, count, onClick, activeColor }) => (
  <button
    onClick={onClick}
    className="relative p-2.5 rounded-full text-amber-900/70 hover:bg-amber-50 hover:text-amber-900 transition-all group"
  >
    {icon}
    {count > 0 && (
      <span className="absolute top-1 right-1 bg-green-600 text-white text-[10px] font-black w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
        {count}
      </span>
    )}
  </button>
);

const DropdownItem = ({ icon, label, onClick, danger, highlight }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 p-3 rounded-xl text-sm font-semibold transition-colors ${
      danger ? "text-red-600 hover:bg-red-50" : 
      highlight ? "text-green-700 hover:bg-green-50" : "text-slate-700 hover:bg-amber-50"
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const MobileLink = ({ to, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex items-center space-x-4 p-4 rounded-xl hover:bg-amber-50 text-[#2d1b1a] font-bold transition-all"
  >
    <span className="text-amber-700">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default memo(Navbar);