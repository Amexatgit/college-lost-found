import { motion } from "framer-motion";
import { useState } from "react";
import { LogIn, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/GlassCard.jsx";
import { Navbar } from "@/components/Navbar.jsx";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import api from "@/lib/api";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/teachers/login", { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("teacher", JSON.stringify(res.data.teacher));
      toast.success(`Welcome back, ${res.data.teacher.name}!`);
      navigate("/admin/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <Navbar />
      <div className="pt-32 px-4 pb-20">
        <div className="max-w-md mx-auto">
          
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="text-center mb-8"
>
  <img src="/logo.png" alt="APCOER" className="w-16 h-16 mx-auto mb-4 object-contain" />
  <h1 className="text-3xl font-bold text-[#9F2C2C] mb-1">APCOER Staff Login</h1>
  <p className="text-muted-foreground">
    Teachers and Class Representatives
  </p>
</motion.div>

          <GlassCard>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <LogIn className="w-4 h-4 mr-2" />
                )}
                Login
              </Button>
            </form>
            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Demo Credentials:</p>
              <p className="text-sm">Username: <code>teacher1</code></p>
              <p className="text-sm">Password: <code>password123</code></p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}