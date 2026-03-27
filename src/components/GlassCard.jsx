import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function GlassCard({ children, className, variant = "default", hover = false }) {
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