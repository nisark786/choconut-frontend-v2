import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../Navbar";
import Footer from "../Footer";

export default function UserLayout() {
  const { pathname } = useLocation();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fffcf8]">
      {/* Stick with one consistent Header height */}
      <header className="fixed top-0 z-50 w-full border-b border-amber-900/5 bg-white/80 backdrop-blur-xl">
        <Navbar />
      </header>

      {/* This pt-24 ensures all pages start below the Navbar */}
      <main className="flex-grow pt-24 md:pt-28">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}