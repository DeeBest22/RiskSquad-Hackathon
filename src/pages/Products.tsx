import { motion } from "framer-motion";
import { ArrowLeft, Car, Home, Briefcase, Smartphone, Plane, Shield, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InsuranceProductCard from "./components/InsuranceProductCard";
import BottomNav from "./components/BottomNav";
import carSide from "./assets/car-side.png";
import house from "./assets/house.png";
import equipment from "./assets/equipment.png";

const Products = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border/50">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="font-heading text-xl font-bold text-foreground">Insurance Products</h1>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-6"
        >
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full rounded-xl bg-card border border-border/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40"
          />
        </motion.div>

        {/* Featured */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Featured</h2>
          <div className="rounded-2xl bg-primary overflow-hidden cursor-pointer" onClick={() => navigate("/quote")}>
            <div className="flex items-center p-5">
              <div className="flex-1">
                <h3 className="font-heading text-lg font-bold text-primary-foreground mb-1">Motor Insurance</h3>
                <p className="text-sm text-primary-foreground/70 mb-3">Comprehensive coverage with AI-powered pricing</p>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-medium text-primary-foreground">
                  Get Quote →
                </span>
              </div>
              <img src={carSide} alt="Car" className="h-24 w-32 object-contain flex-shrink-0" />
            </div>
          </div>
        </motion.div>

        {/* All Products */}
        <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">All Products</h2>
        <div className="space-y-3">
          <InsuranceProductCard title="Motor Insurance" description="Comprehensive & third-party coverage for vehicles" icon={<Car className="h-6 w-6" />} image={carSide} delay={0.15} />
          <InsuranceProductCard title="Property Insurance" description="Protect your home, office, and real estate" icon={<Home className="h-6 w-6" />} image={house} delay={0.2} />
          <InsuranceProductCard title="SME / Business" description="Coverage for small & medium enterprises" icon={<Briefcase className="h-6 w-6" />} delay={0.25} />
          <InsuranceProductCard title="Gadget Insurance" description="Protect phones, laptops, and electronics" icon={<Smartphone className="h-6 w-6" />} image={equipment} delay={0.3} />
          <InsuranceProductCard title="Travel Insurance" description="Coverage for domestic & international trips" icon={<Plane className="h-6 w-6" />} delay={0.35} />
          <InsuranceProductCard title="Micro-Insurance" description="Affordable coverage starting from ₦500/month" icon={<Shield className="h-6 w-6" />} delay={0.4} />
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Products;
