import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong";
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  className, 
  variant = "default",
  hover = false 
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        "rounded-2xl p-6",
        variant === "default" ? "glass" : "glass-strong",
        hover && "transition-all duration-300 hover:shadow-lg hover:scale-[1.02]",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
