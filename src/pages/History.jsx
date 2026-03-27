import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";
import { GlassCard } from "@/components/GlassCard.jsx";
import { ItemCard } from "@/components/ItemCard.jsx";
import { Navbar } from "@/components/Navbar.jsx";
import api from "@/lib/api";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/lost-items/collected")
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <Navbar />
      <div className="pt-32 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Collection History</h1>
            <p className="text-xl text-muted-foreground">
              Items successfully returned to their owners
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <GlassCard className="max-w-md mx-auto p-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Collected Items</h3>
                <p className="text-muted-foreground">
                  Items marked as collected will appear here
                </p>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}