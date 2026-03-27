import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Plus, Upload, Package, CheckCircle, Archive, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { GlassCard } from "@/components/GlassCard.jsx";
import { ItemCard } from "@/components/ItemCard.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import api from "@/lib/api";

export default function AdminDashboard() {
  const [teacher, setTeacher] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newItem, setNewItem] = useState({
    description: "",
    foundLocation: "",
    collectLocation: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("teacher");
    if (!stored) {
      navigate("/admin");
      return;
    }
    setTeacher(JSON.parse(stored));

    api.get("/lost-items/my-items")
      .then((res) => setItems(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacher");
    navigate("/admin");
    toast.success("Logged out successfully");
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("File size must be less than 2MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      let imageFilename = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const uploadRes = await api.post("/files/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = uploadRes.data.imageUrl;
        imageFilename = uploadRes.data.imageFilename;
      }

      const res = await api.post("/lost-items", {
        ...newItem,
        imageUrl,
        imageFilename,
      });

      setItems((prev) => [res.data, ...prev]);
      toast.success("Lost item added successfully!");
      setIsAddDialogOpen(false);
      setNewItem({ description: "", foundLocation: "", collectLocation: "" });
      setSelectedFile(null);
    } catch (err) {
      toast.error("Failed to add item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkCollected = async (itemId) => {
    try {
      await api.patch(`/lost-items/${itemId}/collect`);
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? { ...item, status: "collected", collectedAt: new Date() }
            : item
        )
      );
      toast.success("Item marked as collected!");
    } catch (err) {
      toast.error("Failed to mark item as collected");
    }
  };

  if (!teacher) return null;

  const activeItems = items.filter((i) => i.status === "active");
  const collectedItems = items.filter((i) => i.status === "collected");
  const archivedItems = items.filter((i) => i.status === "archived");

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="pt-8 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <GlassCard className="text-center">
              <Package className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{activeItems.length}</div>
              <div className="text-sm text-muted-foreground">Active</div>
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
              <Package className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </GlassCard>
          </div>

          <div className="mb-8">
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
                    <Label>Item Description</Label>
                    <Textarea
                      placeholder="Describe the lost item..."
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Found Location</Label>
                    <Input
                      placeholder="Where was it found?"
                      value={newItem.foundLocation}
                      onChange={(e) => setNewItem({ ...newItem, foundLocation: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Collection Location</Label>
                    <Input
                      placeholder="Where can it be collected?"
                      value={newItem.collectLocation}
                      onChange={(e) => setNewItem({ ...newItem, collectLocation: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>Photo (Optional, max 2MB)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="flex-1"
                      />
                      <Upload className="w-4 h-4 text-muted-foreground" />
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedFile.name}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Item"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <h2 className="text-2xl font-bold mb-6">My Lost Items</h2>
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
          ) : items.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => (
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
              <p className="text-muted-foreground mb-4">Start by adding your first lost item</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}