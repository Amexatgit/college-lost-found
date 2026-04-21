import { motion } from "framer-motion";
import { Search, Archive, History, Users, MapPin, Clock, Phone, Mail } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/GlassCard.jsx";
import { Navbar } from "@/components/Navbar.jsx";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function Landing() {
  const [stats, setStats] = useState({
    active: 0,
    collected: 0,
    total: 0,
  });

  useEffect(() => {
    // fetch real stats
    Promise.all([
      api.get("/lost-items/active"),
      api.get("/lost-items/collected"),
    ]).then(([activeRes, collectedRes]) => {
      setStats({
        active: activeRes.data.length,
        collected: collectedRes.data.length,
        total: activeRes.data.length + collectedRes.data.length,
      });
    }).catch(console.error);
  }, []);

  const features = [
    {
      icon: Search,
      title: "Browse Lost Items",
      description: "View all currently reported lost items with photos and pickup locations",
      link: "/lost-items",
    },
    {
      icon: History,
      title: "Collection History",
      description: "Items that have been successfully returned to their owners",
      link: "/history",
    },
    {
      icon: Archive,
      title: "Archive",
      description: "Browse older items automatically archived after 30 days",
      link: "/archive",
    },
    {
      icon: Users,
      title: "Staff Portal",
      description: "Teachers and Class Representatives can log in to manage items",
      link: "/admin",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="pt-24 pb-16 px-4 bg-gradient-to-b from-[#f5f0f0] to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row items-center gap-10"
          >
            {/* Left — text */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block bg-[#9F2C2C]/10 text-[#9F2C2C] text-sm font-medium px-3 py-1 rounded-full mb-4">
                Anantrao Pawar College of Engineering & Research
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                APCOER <span className="text-[#9F2C2C]">Lost & Found</span> Portal
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                A digital system to help students and faculty of APCOER Pune
                reunite with their lost belongings quickly and efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <Button
                  size="lg"
                  asChild
                  className="bg-[#9F2C2C] hover:bg-[#7a2020] text-white"
                >
                  <Link to="/lost-items">
                    <Search className="w-4 h-4 mr-2" />
                    Browse Lost Items
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild
                  className="border-[#9F2C2C] text-[#9F2C2C] hover:bg-[#f5f0f0]"
                >
                  <Link to="/admin">
                    <Users className="w-4 h-4 mr-2" />
                    Staff Login
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right — logo */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full bg-[#f5f0f0] flex items-center justify-center border-4 border-[#9F2C2C]/20">
                <img
                  src="/logo.png"
                  alt="APCOER"
                  className="w-36 h-36 object-contain"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Real Stats */}
      <div className="px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Active Items", value: stats.active, icon: MapPin },
              { label: "Items Returned", value: stats.collected, icon: Search },
              { label: "Total Reported", value: stats.total, icon: Clock },
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <GlassCard className="text-center">
                    <div className="w-12 h-12 bg-[#9F2C2C]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-[#9F2C2C]" />
                    </div>
                    <div className="text-3xl font-bold text-[#9F2C2C] mb-1">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 py-12 bg-[#f5f0f0]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Teachers and Class Representatives report found items.
              Students browse and collect their belongings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link to={feature.link}>
                    <GlassCard hover className="h-full text-center group cursor-pointer">
                      <div className="w-12 h-12 bg-[#9F2C2C]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#9F2C2C] transition-colors">
                        <Icon className="w-6 h-6 text-[#9F2C2C] group-hover:text-white transition-colors" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </GlassCard>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#9F2C2C] text-white px-4 py-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <img src="/logo.png" alt="APCOER" className="w-10 h-10 object-contain bg-white rounded-full p-1" />
                <div>
                  <div className="font-bold text-lg">APCOER</div>
                  <div className="text-sm text-red-200">Lost & Found Portal</div>
                </div>
              </div>
              <p className="text-sm text-red-200 max-w-xs">
                Anantrao Pawar College of Engineering & Research, Pune
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-red-200">
              <div className="font-semibold text-white mb-1">Contact</div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Parvati, Pune - 411009</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>020-24226060</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>info@apcoer.edu.in</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm text-red-200">
              <div className="font-semibold text-white mb-1">Quick Links</div>
              <Link to="/lost-items" className="hover:text-white transition-colors">Lost Items</Link>
              <Link to="/history" className="hover:text-white transition-colors">History</Link>
              <Link to="/archive" className="hover:text-white transition-colors">Archive</Link>
              <Link to="/admin" className="hover:text-white transition-colors">Staff Login</Link>
            </div>
          </div>
          <div className="border-t border-red-800 mt-8 pt-6 text-center text-sm text-red-300">
            © {new Date().getFullYear()} APCOER Lost & Found Portal. Built for APCOER Pune.
          </div>
        </div>
      </footer>
    </div>
  );
}