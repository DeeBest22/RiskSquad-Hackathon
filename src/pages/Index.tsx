import { motion } from "framer-motion";
import { Bell, Car, Home, Briefcase, Smartphone, Plane, Shield, ArrowRight, TrendingUp, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import PolicyCard from "./components/PolicyCard";
import carSide from "./assets/car-side.png";
import house from "./assets/house.png";

const quickActions = [
  { icon: Car, label: "Motor", color: "bg-primary/10 text-primary" },
  { icon: Home, label: "Property", color: "bg-success/10 text-success" },
  { icon: Briefcase, label: "SME", color: "bg-warning/10 text-warning" },
  { icon: Smartphone, label: "Gadget", color: "bg-info/10 text-info" },
  { icon: Plane, label: "Travel", color: "bg-primary/10 text-primary" },
  { icon: Shield, label: "Micro", color: "bg-success/10 text-success" },
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pb-10 pt-12 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-primary-foreground/70 text-sm font-body">Good morning</p>
            <h1 className="font-heading text-2xl font-bold text-primary-foreground">Hi, Adebayo 👋</h1>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary-foreground/10"
          >
            <Bell className="h-5 w-5 text-primary-foreground" />
            <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full bg-destructive border-2 border-primary" />
          </motion.button>
        </div>

        {/* AI Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-primary-foreground/10 backdrop-blur-sm p-4 border border-primary-foreground/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-foreground/70 text-xs font-medium mb-1">Your AI Risk Score</p>
              <div className="flex items-center gap-2">
                <span className="font-heading text-3xl font-bold text-primary-foreground">28</span>
                <span className="rounded-full bg-primary-foreground/15 px-2 py-0.5 text-xs font-medium text-primary-foreground">Low Risk</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-primary-foreground/70">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">-3 this month</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="px-5 -mt-4">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card p-4 shadow-sm border border-border/50 mb-6"
        >
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map(({ icon: Icon, label, color }) => (
              <button
                key={label}
                onClick={() => navigate("/products")}
                className="flex flex-col items-center gap-1.5 rounded-xl py-3 transition-all hover:bg-secondary"
              >
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-foreground">{label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Active Policies */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-heading text-lg font-semibold text-foreground">Your Policies</h2>
            <button onClick={() => navigate("/policies")} className="flex items-center gap-1 text-sm font-medium text-primary">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <PolicyCard
              type="Motor Insurance"
              policyNumber="POL-2026-00847"
              status="active"
              premium="₦45,000/yr"
              image={carSide}
              delay={0.3}
            />
            <PolicyCard
              type="Property Insurance"
              policyNumber="POL-2026-01293"
              status="active"
              premium="₦120,000/yr"
              image={house}
              delay={0.4}
            />
          </div>
        </div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6"
        >
          <h2 className="font-heading text-lg font-semibold text-foreground mb-3">AI Insights</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-2xl bg-card p-4 border border-border/50 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10 flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Premium Optimization</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your driving pattern data suggests you may qualify for a 15% discount on motor insurance.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl bg-card p-4 border border-border/50 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Coverage Gap Detected</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Your business equipment is not covered. Consider adding gadget or SME insurance.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Index;
