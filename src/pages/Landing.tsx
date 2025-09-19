import { motion } from "framer-motion";
import { Search, Archive, History, Users, MapPin, Clock } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";

export default function Landing() {
  const features = [
    {
      icon: Search,
      title: "Browse Lost Items",
      description: "View all currently lost items with detailed descriptions and photos",
      link: "/lost-items",
    },
    {
      icon: History,
      title: "Collection History",
      description: "See items that have been successfully returned to their owners",
      link: "/history",
    },
    {
      icon: Archive,
      title: "Archive",
      description: "Browse older items that have been automatically archived",
      link: "/archive",
    },
    {
      icon: Users,
      title: "Admin Portal",
      description: "Teachers can log in to add new lost items and manage collections",
      link: "/admin",
    },
  ];

  const stats = [
    { label: "Items Found", value: "150+", icon: MapPin },
    { label: "Items Returned", value: "120+", icon: Search },
    { label: "Active Items", value: "30+", icon: Clock },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="gradient-orb gradient-orb-1" />
      <div className="gradient-orb gradient-orb-2" />
      <div className="gradient-orb gradient-orb-3" />
      
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="flex justify-center mb-8">
              <motion.img
                src="/logo.svg"
                alt="Lost & Found Logo"
                className="w-20 h-20"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Lost & Found
              <span className="block text-3xl md:text-4xl font-normal text-muted-foreground mt-2">
                College Portal
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Helping students and faculty reunite with their lost belongings through 
              our comprehensive digital lost and found system.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild className="text-lg px-8 py-6">
                <Link to="/lost-items">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Lost Items
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 py-6">
                <Link to="/admin">
                  <Users className="w-5 h-5 mr-2" />
                  Admin Login
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 mb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={index} className="text-center">
                  <Icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </GlassCard>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform makes it easy to report, browse, and reclaim lost items
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <GlassCard hover className="h-full text-center group cursor-pointer">
                    <Link to={feature.link} className="block">
                      <Icon className="w-12 h-12 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-200" />
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </Link>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <GlassCard variant="strong" className="p-12">
              <h2 className="text-3xl font-bold mb-4">Lost Something?</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Check our database of found items or contact the administration 
                to report your lost belongings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/lost-items">
                    <Search className="w-5 h-5 mr-2" />
                    Search Lost Items
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/history">
                    <History className="w-5 h-5 mr-2" />
                    View History
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
