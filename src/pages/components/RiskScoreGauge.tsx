import { motion } from "framer-motion";

interface RiskScoreGaugeProps {
  score: number;
  size?: "sm" | "md" | "lg";
}

const RiskScoreGauge = ({ score, size = "md" }: RiskScoreGaugeProps) => {
  const getRiskColor = () => {
    if (score <= 35) return "text-risk-low";
    if (score <= 65) return "text-risk-medium";
    return "text-risk-high";
  };

  const getRiskLabel = () => {
    if (score <= 35) return "Low Risk";
    if (score <= 65) return "Medium Risk";
    return "High Risk";
  };

  const getBgRing = () => {
    if (score <= 35) return "stroke-risk-low/20";
    if (score <= 65) return "stroke-risk-medium/20";
    return "stroke-risk-high/20";
  };

  const getStrokeColor = () => {
    if (score <= 35) return "stroke-risk-low";
    if (score <= 65) return "stroke-risk-medium";
    return "stroke-risk-high";
  };

  const dims = { sm: 80, md: 120, lg: 160 };
  const s = dims[size];
  const strokeWidth = size === "sm" ? 6 : size === "md" ? 8 : 10;
  const r = (s - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: s, height: s }}>
        <svg width={s} height={s} className="-rotate-90">
          <circle
            cx={s / 2}
            cy={s / 2}
            r={r}
            fill="none"
            strokeWidth={strokeWidth}
            className={getBgRing()}
          />
          <motion.circle
            cx={s / 2}
            cy={s / 2}
            r={r}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={getStrokeColor()}
            initial={{ strokeDasharray: `0 ${circumference}` }}
            animate={{ strokeDasharray: `${progress} ${circumference - progress}` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={`font-heading font-bold ${getRiskColor()} ${
              size === "sm" ? "text-lg" : size === "md" ? "text-2xl" : "text-4xl"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className={`font-medium text-sm ${getRiskColor()}`}>{getRiskLabel()}</span>
    </div>
  );
};

export default RiskScoreGauge;
