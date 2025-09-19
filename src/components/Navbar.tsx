import { motion } from "framer-motion";
import { Search, Archive, History, Home, LogIn } from "lucide-react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { GlassCard } from "./GlassCard";

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/lost-items", label: "Lost Items", icon: Search },
    { path: "/history", label: "History", icon: History },
    { path: "/archive", label: "Archive", icon: Archive },
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-4xl px-4"
    >
      <GlassCard className="flex items-center justify-between p-4">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.svg" alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-lg">Lost & Found</span>
        </Link>

        <div className="flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                asChild
                className={cn(
                  "transition-all duration-200",
                  // Fix type issue by avoiding boolean in the cn args
                  isActive ? "bg-primary/20 text-primary" : undefined
                )}
              >
                <Link to={item.path} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              </Button>
            );
          })}
          
          <Button variant="outline" size="sm" asChild className="ml-4">
            <Link to="/admin" className="flex items-center space-x-2">
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          </Button>
        </div>
      </GlassCard>
    </motion.nav>
  );
}

function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}