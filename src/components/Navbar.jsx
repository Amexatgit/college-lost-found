import { useState } from "react";
import { Search, Archive, History, Home, LogIn, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/lost-items", label: "Lost Items", icon: Search },
    { path: "/history", label: "History", icon: History },
    { path: "/archive", label: "Archive", icon: Archive },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e5d5d5] shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo + College Name */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="APCOER Logo"
              className="w-10 h-10 object-contain"
            />
            <div className="hidden sm:block">
              <div className="font-bold text-[#9F2C2C] text-sm leading-tight">
                APCOER
              </div>
              <div className="text-xs text-muted-foreground leading-tight">
                Lost & Found Portal
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#9F2C2C] text-white"
                      : "text-gray-600 hover:bg-[#f5f0f0] hover:text-[#9F2C2C]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/admin"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-md text-sm font-medium border border-[#9F2C2C] text-[#9F2C2C] hover:bg-[#9F2C2C] hover:text-white transition-colors ml-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Staff Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-[#9F2C2C]"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#e5d5d5] py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#9F2C2C] text-white"
                      : "text-gray-600 hover:bg-[#f5f0f0] hover:text-[#9F2C2C]"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <Link
              to="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-md text-sm font-medium border border-[#9F2C2C] text-[#9F2C2C] mx-1"
            >
              <LogIn className="w-4 h-4" />
              <span>Staff Login</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}