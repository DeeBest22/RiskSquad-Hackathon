import { motion } from "framer-motion";
import { ArrowLeft, Plus, Clock, CheckCircle2, AlertTriangle, Camera, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";

const claims = [
  { id: "CLM-2026-001", type: "Motor – Fender damage", status: "reviewing" as const, date: "Feb 8, 2026", amount: "₦85,000" },
  { id: "CLM-2025-042", type: "Property – Water damage", status: "approved" as const, date: "Dec 15, 2025", amount: "₦250,000" },
  { id: "CLM-2025-038", type: "Gadget – Cracked screen", status: "declined" as const, date: "Nov 2, 2025", amount: "₦45,000" },
];

const statusConfig = {
  reviewing: { icon: Clock, label: "Reviewing", style: "bg-warning/10 text-warning" },
  approved: { icon: CheckCircle2, label: "Approved", style: "bg-success/10 text-success" },
  declined: { icon: AlertTriangle, label: "Declined", style: "bg-destructive/10 text-destructive" },
};

const Claims = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border/50">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="font-heading text-xl font-bold text-foreground">Claims</h1>
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        {/* New Claim Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20 p-6 text-center mb-6"
        >
          <div className="flex justify-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Camera className="h-6 w-6" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Upload className="h-6 w-6" />
            </div>
          </div>
          <h3 className="font-heading text-sm font-semibold text-foreground mb-1">Submit a New Claim</h3>
          <p className="text-xs text-muted-foreground">Take a photo or upload documents. AI will validate your claim instantly.</p>
        </motion.div>

        {/* Claims List */}
        <h2 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Claims</h2>
        <div className="space-y-3">
          {claims.map((claim, i) => {
            const cfg = statusConfig[claim.status];
            const StatusIcon = cfg.icon;
            return (
              <motion.div
                key={claim.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="rounded-xl bg-card border border-border/50 p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{claim.id}</span>
                  <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.style}`}>
                    <StatusIcon className="h-3 w-3" />
                    {cfg.label}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{claim.type}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{claim.date}</span>
                  <span className="font-heading text-sm font-bold text-foreground">{claim.amount}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Claims;
