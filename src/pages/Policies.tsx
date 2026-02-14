import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PolicyCard from "./components/PolicyCard";
import BottomNav from "./components/BottomNav";
import carSide from "./assets/car-side.png";
import house from "./assets/house.png";
import equipment from "./assets/equipment.png";

const Policies = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border/50">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="font-heading text-xl font-bold text-foreground">My Policies</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["All", "Active", "Pending", "Expired"].map((tab, i) => (
            <button key={tab} className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              i === 0 ? "bg-primary text-primary-foreground" : "bg-card border border-border/50 text-muted-foreground hover:text-foreground"
            }`}>
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PolicyCard type="Motor Insurance" policyNumber="POL-2026-00847" status="active" premium="₦45,000/yr" image={carSide} delay={0.1} />
          <PolicyCard type="Property Insurance" policyNumber="POL-2026-01293" status="active" premium="₦120,000/yr" image={house} delay={0.15} />
          <PolicyCard type="Gadget Insurance" policyNumber="POL-2026-02105" status="pending" premium="₦8,500/yr" image={equipment} delay={0.2} />
          <PolicyCard type="Travel Insurance" policyNumber="POL-2026-03421" status="expired" premium="₦25,000/trip" delay={0.25} />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Policies;
