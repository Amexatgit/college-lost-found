import { motion } from "framer-motion";
import { MapPin, Calendar, Package, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "./GlassCard";
import { Doc } from "@/convex/_generated/dataModel";

interface ItemCardProps {
  item: Doc<"lostItems"> & { uploaderName?: string };
  showActions?: boolean;
  onMarkCollected?: (id: string) => void;
}

export function ItemCard({ item, showActions = false, onMarkCollected }: ItemCardProps) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "collected":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "archived":
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard hover className="h-full">
        <div className="space-y-4">
          {/* Image */}
          {item.imageUrl && (
            <div className="aspect-video rounded-lg overflow-hidden bg-muted/20">
              <img
                src={item.imageUrl}
                alt={item.description}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status Badge */}
          <div className="flex justify-between items-start">
            <Badge className={getStatusColor(item.status)}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {formatDate(item._creationTime)}
            </span>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">{item.description}</h3>
          </div>

          {/* Location Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Found at:</span>
              <span>{item.foundLocation}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Package className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Collect from:</span>
              <span>{item.collectLocation}</span>
            </div>
          </div>

          {/* Uploader Info */}
          {item.uploaderName && (
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Uploaded by: {item.uploaderName}</span>
            </div>
          )}

          {/* Collection Info */}
          {item.status === "collected" && item.collectedAt && (
            <div className="flex items-center space-x-2 text-sm text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span>Collected on {formatDate(item.collectedAt)}</span>
            </div>
          )}

          {/* Actions */}
          {showActions && item.status === "active" && onMarkCollected && (
            <Button
              onClick={() => onMarkCollected(item._id)}
              className="w-full"
              variant="default"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark as Collected
            </Button>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
