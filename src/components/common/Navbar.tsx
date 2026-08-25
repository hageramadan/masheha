"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { useState, useEffect } from "react";
import Image from "next/image";
import AuthPopup from "@/src/components/common/AuthPopup";
import { useAuth } from "@/src/context/AuthContext";

export default function Navbar() {
  const {isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const openAuthPopup = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthPopup(true);
    setIsOpen(false);
  };

 

  const navLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/cars", label: "السيارات" },
    { href: "/#", label: "انضم الينا" },
    // { href: "/profile", label: "الملف الشخصي" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
              onClick={handleLinkClick}
            >
              <Image
                src="/logo.png"
                alt="Logo"
                width={155}
                height={72}
                className="max-w-30 md:max-w-38.75 max-h-12.5 md:max-h-18 object-contain"
                priority
              />
            </Link>

            {/* روابط الديسكتوب */}
            <div className="hidden lg:flex gap-1 xl:gap-2 items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 xl:px-6 py-2 rounded-lg font-bold text-sm xl:text-base transition-all duration-300 ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10 scale-105"
                      : "text-gray-600 hover:text-primary hover:bg-primary/5 hover:scale-105"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-primary rounded-full"></span>
                  )}
                </Link>
              ))}
            </div>

            {/* أزرار الديسكتوب - تعتمد على حالة المستخدم */}
            <div className="hidden lg:flex gap-3 xl:gap-4 items-center">
              {isAuthenticated ? (
               
                <div className="flex items-center gap-3 border rounded-full p-1 border-gray-400 hover:shadow-xl hover:scale-110 transition duration-150">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-gray-700 hover:text-primary transition-colors duration-300"
                  >
                    <BiUser className="text-2xl text-primary" />
                    
                  </Link>
                 
                </div>
              ) : (
               
                <>
                  <button
                    onClick={() => openAuthPopup('login')}
                    className="group flex items-center gap-2 border-2 border-primary/20 hover:border-primary py-2 px-5 xl:px-7 rounded-xl font-bold text-sm xl:text-base text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    الدخول
                  </button>
                  <button
                    onClick={() => openAuthPopup('register')}
                    className="group flex items-center gap-2 bg-primary hover:bg-primary/85 font-bold text-sm xl:text-base py-2.5 xl:py-3 px-5 xl:px-7 text-white rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/30"
                  >
                    انشاء حساب
                  </button>
                </>
              )}
            </div>

          
            <button
              className="lg:hidden text-2xl text-primary p-2 hover:bg-primary/5 rounded-lg transition-colors duration-300 relative z-50"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

 
      <div
        className={`lg:hidden fixed inset-0 top-16 md:top-20 z-40 transition-all duration-500 ease-in-out ${
          isOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        <div className="w-full h-full bg-white overflow-y-auto">
          <div className="container mx-auto px-6 py-6 flex flex-col min-h-full">
            <div className="flex flex-col gap-2 flex-1">
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-4 py-5 rounded-xl font-bold text-xl transition-all duration-300 ${
                    isActive(link.href)
                      ? "text-primary bg-primary/10 scale-[1.02]"
                      : "text-gray-700 hover:text-primary hover:bg-primary/5 hover:scale-[1.02]"
                  }`}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: isOpen ? "slideIn 0.4s ease forwards" : "none",
                  }}
                  onClick={handleLinkClick}
                >
                  <span className="flex items-center justify-between">
                    {link.label}
                    {isActive(link.href) && (
                      <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                    )}
                  </span>
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gray-100"></span>
                </Link>
              ))}
            </div>

          
            <div className="flex flex-col gap-4 mt-6">
              {isAuthenticated ? (
               
                <>
                  <Link
                    href="/profile"
                    className="group flex items-center justify-center gap-3 border-2 border-primary/30 hover:border-primary py-4 rounded-xl font-bold text-lg text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] w-full"
                    onClick={handleLinkClick}
                  >
                    <BiUser className="text-2xl group-hover:scale-110 transition-transform" />
                   
                  </Link>
               
                </>
              ) : (
               
                <>
                  <button
                    onClick={() => openAuthPopup('login')}
                    className="group flex items-center justify-center gap-3 border-2 border-primary/30 hover:border-primary py-4 rounded-xl font-bold text-lg text-primary hover:bg-primary/5 transition-all duration-300 hover:scale-[1.02] w-full"
                  >
                    الدخول
                  </button>
                  <button
                    onClick={() => openAuthPopup('register')}
                    className="group flex items-center justify-center gap-3 bg-primary hover:bg-primary/85 font-bold text-lg py-4 text-white rounded-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 w-full"
                  >
                    انشاء حساب
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-center text-xs text-gray-400">
                © {new Date().getFullYear()} جميع الحقوق محفوظة
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Popup */}
      <AuthPopup
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        initialMode={authMode}
        onSuccess={() => {
          
          setShowAuthPopup(false);
        }}
      />

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}