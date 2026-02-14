import { motion } from "framer-motion";
import { ArrowLeft, User, Phone, MapPin, Shield, Bell, Lock, HelpCircle, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BottomNav from "./components/BottomNav";

const menuItems = [
  { icon: Shield, label: "My Documents", desc: "ID, license, vehicle docs" },
  { icon: Bell, label: "Notifications", desc: "Manage alerts" },
  { icon: Lock, label: "Security", desc: "Password & biometrics" },
  { icon: HelpCircle, label: "Help & Support", desc: "FAQ, contact us" },
];

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border/50">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="font-heading text-xl font-bold text-foreground">Profile</h1>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-heading text-lg font-bold text-foreground">Adebayo Johnson</h2>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-3.5 w-3.5" />
                +234 801 234 5678
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Lekki, Lagos
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          {[
            { value: "3", label: "Policies" },
            { value: "28", label: "Risk Score" },
            { value: "1", label: "Claims" },
          ].map(({ value, label }) => (
            <div key={label} className="rounded-xl bg-card border border-border/50 p-3 text-center shadow-sm">
              <span className="font-heading text-xl font-bold text-primary">{value}</span>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </motion.div>

        {/* Menu */}
        <div className="space-y-2">
          {menuItems.map(({ icon: Icon, label, desc }, i) => (
            <motion.button
              key={label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="flex w-full items-center gap-3 rounded-xl bg-card border border-border/50 p-4 text-left shadow-sm transition-all hover:border-primary/20"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">{label}</span>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </motion.button>
          ))}
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-destructive/20 py-3.5 text-sm font-medium text-destructive transition-all hover:bg-destructive/5"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </motion.button>
      </div>
      <BottomNav />
    </div>
  );
};

export default Profile;
