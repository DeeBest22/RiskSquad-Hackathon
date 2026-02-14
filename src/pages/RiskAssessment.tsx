import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, AlertTriangle, MapPin, Car, Activity, Brain, Download, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RiskScoreGauge from "./components/RiskScoreGauge";
import BottomNav from "./components/BottomNav";

const riskFactors = [
  { label: "Location Risk", score: 22, icon: MapPin, detail: "Lekki, Lagos — Low crime zone" },
  { label: "Vehicle Risk", score: 35, icon: Car, detail: "Toyota Camry 2024 — Low theft rate" },
  { label: "Behavioral Risk", score: 18, icon: Activity, detail: "Consistent responses, no anomalies" },
  { label: "AI Confidence", score: 92, icon: Brain, detail: "High data quality, reliable assessment" },
];

const RiskAssessment = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border/50">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="font-heading text-xl font-bold text-foreground">AI Risk Assessment</h1>
        </div>
      </div>

      <div className="px-5 space-y-6">
        {/* Decision Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-success/10 border border-success/20 p-5 text-center"
        >
          <CheckCircle2 className="h-10 w-10 text-success mx-auto mb-3" />
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">Approved</h2>
          <p className="text-sm text-muted-foreground">Your application has been approved by our AI underwriting engine.</p>
        </motion.div>

        {/* Risk Score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-card border border-border/50 p-6 shadow-sm"
        >
          <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">Overall Risk Score</h3>
          <div className="flex justify-center">
            <RiskScoreGauge score={28} size="lg" />
          </div>
        </motion.div>

        {/* Risk Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Risk Breakdown</h3>
          <div className="space-y-3">
            {riskFactors.map(({ label, score, icon: Icon, detail }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="rounded-xl bg-card border border-border/50 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{label}</span>
                      <span className="font-heading text-sm font-bold text-foreground">{score}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-12">
                  <div className="h-1.5 w-full rounded-full bg-border mb-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.8 }}
                      className={`h-full rounded-full ${
                        score <= 35 ? "bg-risk-low" : score <= 65 ? "bg-risk-medium" : "bg-risk-high"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-primary" />
            <h3 className="font-heading text-sm font-semibold text-foreground">Why was I approved?</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
              Your location in Lekki has a low accident and crime rate
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
              Toyota Camry 2024 has a strong safety record and low theft rate
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
              Your responses were consistent with no anomalies detected
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
              Payment behavior indicates financial responsibility
            </li>
          </ul>
        </motion.div>

        {/* Premium */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl bg-primary p-5"
        >
          <p className="text-primary-foreground/70 text-xs font-medium mb-1">Your Premium</p>
          <div className="flex items-end justify-between">
            <div>
              <span className="font-heading text-3xl font-bold text-primary-foreground">₦45,000</span>
              <span className="text-primary-foreground/70 text-sm">/year</span>
            </div>
            <div className="flex gap-2">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-foreground/10">
                <Download className="h-4 w-4 text-primary-foreground" />
              </button>
              <button className="flex items-center gap-2 rounded-xl bg-primary-foreground px-4 py-2.5 text-sm font-semibold text-primary">
                Pay Now <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Improvement Tips */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-2xl bg-card border border-border/50 p-5 shadow-sm mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <h3 className="font-heading text-sm font-semibold text-foreground">How to lower your premium</h3>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Install a GPS tracker for up to 10% discount</li>
            <li>• Maintain a claims-free record for 12 months</li>
            <li>• Provide additional documentation (NIN, driver's license)</li>
          </ul>
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};

export default RiskAssessment;
