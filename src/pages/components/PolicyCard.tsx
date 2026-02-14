import { motion } from "framer-motion";
import { Shield, ChevronRight } from "lucide-react";

interface PolicyCardProps {
  type: string;
  policyNumber: string;
  status: "active" | "pending" | "expired";
  premium: string;
  image?: string;
  delay?: number;
}

const PolicyCard = ({ type, policyNumber, status, premium, image, delay = 0 }: PolicyCardProps) => {
  const statusStyles = {
    active: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    expired: "bg-destructive/10 text-destructive",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-md"
    >
      {image && (
        <div className="h-36 w-full overflow-hidden bg-secondary">
          <img src={image} alt={type} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-heading font-semibold text-foreground">{type}</span>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{policyNumber}</p>
        <div className="flex items-center justify-between">
          <span className="font-heading text-lg font-bold text-foreground">{premium}</span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </motion.div>
  );
};

export default PolicyCard;
