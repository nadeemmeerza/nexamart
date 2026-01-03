// app/components/layout/navbar/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Menu,
  X,
  Heart,
  ChevronDown,
  LogOut,
  User,
  LogIn,
  BookDashed,
  LayoutDashboard,
} from "lucide-react";
import Button from "@/app/components/ui/Button";
import SearchBar from "@/app/components/ui/SearchBar";
import useCart from "@/app/context/CartContext";
import { redirect, useRouter } from "next/navigation";
import { useNotification } from "@/app/context/NotificationContext";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

interface NavbarProps {
  onCartClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onCartClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ Move ALL hooks to the top level
  const { itemCount } = useCart();
  const { addNotification } = useNotification();
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if(session?.user.role === "admin")
      setIsAdmin(true);
    setIsMounted(true);
  }, []);

  function handleLogout() {
    addNotification("You logged out successfully", "success");
    signOut({ redirectTo: "/" });
    setUserMenuOpen(false);
  }

  const handleLogin = () => {
    router.push("/login");
  };

  const navLinks = [
    { label: "Shop", href: "/" },
    { label: "Collections", href: "/collections" },
    { label: "Best Sellers", href: "/best-sellers" },
    { label: "About", href: "/about" },
  ];

  // ✅ Early return for unmounted state
  if (!isMounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-2xl font-bold text-black">NEXAMART</div>
            <button className="text-gray-600">
              <ShoppingCart className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>
    );
  }

  const userName = session?.user?.name || "";

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop Navbar */}
        <div className="hidden md:flex items-center justify-between h-16">
          <div
            className="text-2xl font-bold text-black cursor-pointer"
            onClick={() => router.push("/")}
          >
             <span className=" text-4xl ">🛍️</span>
            NEXAMART
          </div>

          <div className="flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 hover:text-black font-medium transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          
         

          <div className="flex items-center gap-6 bg-amber-300 p-3">
            <SearchBar/>
            </div>
           
             {isAdmin && 
          <LayoutDashboard onClick={()=>redirect("/admin/dashboard")} className="text-4xl hover:text-cyan-300"/>}
{/* 
            <button className="text-gray-600 hover:text-black transition-colors">
              <Heart className="w-6 h-6" />
            </button> */}

            <div className="relative">
              {!userName ? (
                <button
                  onClick={handleLogin}
                  className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                >
                  <span className="flex gap-2">
                    Login <LogIn className="w-5 h-5" />
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
                  >
                    {userName}
                    <User className="w-6 h-6" />
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        👤 My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        📦 My Orders
                      </Link>
                      <Link
                        href="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        ❤️ Wishlist
                      </Link>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        ⚙️ Settings
                      </Link>
                      <hr className="my-1" />
                    
                      <button
                        onClick={handleLogout}
                        className="w-full cursor-pointer text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2 text-red-600"
                      >
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-black transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && userName && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
          
        </div>

        {/* Mobile Navbar */}
        <div className="md:hidden flex items-center justify-between h-14">
          <div
            className="text-xl font-bold cursor-pointer"
            onClick={() => router.push("/")}
          >
            NEXAMART
          </div>
          <div className="flex items-center gap-4">
            <div className="mr-2">
              <SearchBar />
            </div>
            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && userName && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="px-4 py-2 border-t border-gray-200 mt-2">
              {!userName ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
              ) : (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-900">
                    {userName}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
