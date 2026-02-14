import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface InsuranceProductCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  image?: string;
  delay?: number;
}

const InsuranceProductCard = ({ title, description, icon, image, delay = 0 }: InsuranceProductCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      onClick={() => navigate("/quote")}
      className="group flex cursor-pointer items-center gap-4 rounded-2xl bg-card p-4 shadow-sm border border-border/50 transition-all duration-200 hover:shadow-md hover:border-primary/20"
    >
      {image ? (
        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-secondary">
          <img src={image} alt={title} className="h-full w-full object-cover" />
        </div>
      ) : (
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-heading font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
      <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
    </motion.div>
  );
};

export default InsuranceProductCard;
