import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Upload, BarChart3, Package, CheckCircle, Archive, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GlassCard } from "@/components/GlassCard";
import { ItemCard } from "@/components/ItemCard";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const [teacher, setTeacher] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    description: "",
    foundLocation: "",
    collectLocation: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const myItems = useQuery(api.lostItems.getMyLostItems);
  const monthlyStats = useQuery(api.lostItems.getMonthlyStats);
  const addLostItem = useMutation(api.lostItems.addLostItem);
  const markAsCollected = useMutation(api.lostItems.markAsCollected);

  useEffect(() => {
    const storedTeacher = localStorage.getItem("teacher");
    if (storedTeacher) {
      setTeacher(JSON.parse(storedTeacher));
    } else {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("teacher");
    navigate("/admin");
    toast.success("Logged out successfully");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit
        toast.error("File size must be less than 1MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageStorageId;
      
      if (selectedFile) {
        // Upload file to Convex storage
        const uploadUrl = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: selectedFile.name }),
        }).then(res => res.json());

        await fetch(uploadUrl, {
          method: "POST",
          body: selectedFile,
        });

        imageStorageId = uploadUrl.storageId;
      }

      await addLostItem({
        description: newItem.description,
        foundLocation: newItem.foundLocation,
        collectLocation: newItem.collectLocation,
        imageStorageId,
      });

      toast.success("Lost item added successfully!");
      setIsAddDialogOpen(false);
      setNewItem({ description: "", foundLocation: "", collectLocation: "" });
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkCollected = async (itemId: string) => {
    try {
      await markAsCollected({ itemId: itemId as any });
      toast.success("Item marked as collected!");
    } catch (error) {
      toast.error("Failed to mark item as collected");
    }
  };

  if (!teacher) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const activeItems = myItems?.filter(item => item.status === "active") || [];
  const collectedItems = myItems?.filter(item => item.status === "collected") || [];
  const archivedItems = myItems?.filter(item => item.status === "archived") || [];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      
      <div className="pt-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {teacher.name}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <GlassCard className="text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{activeItems.length}</div>
              <div className="text-sm text-muted-foreground">Active Items</div>
            </GlassCard>
            <GlassCard className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">{collectedItems.length}</div>
              <div className="text-sm text-muted-foreground">Collected</div>
            </GlassCard>
            <GlassCard className="text-center">
              <Archive className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <div className="text-2xl font-bold">{archivedItems.length}</div>
              <div className="text-sm text-muted-foreground">Archived</div>
            </GlassCard>
            <GlassCard className="text-center">
              <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">{myItems?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Total Items</div>
            </GlassCard>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="w-5 h-5 mr-2" />
                  Add Lost Item
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Lost Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="description">Item Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the lost item..."
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="foundLocation">Found Location</Label>
                    <Input
                      id="foundLocation"
                      placeholder="Where was it found?"
                      value={newItem.foundLocation}
                      onChange={(e) => setNewItem({ ...newItem, foundLocation: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="collectLocation">Collection Location</Label>
                    <Input
                      id="collectLocation"
                      placeholder="Where can it be collected?"
                      value={newItem.collectLocation}
                      onChange={(e) => setNewItem({ ...newItem, collectLocation: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Item Photo (Optional)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Adding Item...
                      </>
                    ) : (
                      "Add Item"
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* My Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-6">My Lost Items</h2>
            {myItems && myItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myItems.map((item) => (
                  <ItemCard
                    key={item._id}
                    item={item}
                    showActions={item.status === "active"}
                    onMarkCollected={handleMarkCollected}
                  />
                ))}
              </div>
            ) : (
              <GlassCard className="text-center p-8">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No Items Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first lost item
                </p>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </GlassCard>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
