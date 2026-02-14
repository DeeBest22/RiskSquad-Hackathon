import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Car, MapPin, Calendar, User, Shield, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import carTop from "./assets/car-top.png";

const steps = ["Vehicle", "Owner", "Coverage", "Review"];

const Quote = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    plateNumber: "",
    fullName: "",
    phone: "",
    location: "",
    coverageType: "comprehensive",
  });

  const updateField = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else navigate("/risk-assessment");
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
    else navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={handleBack} className="flex h-10 w-10 items-center justify-center rounded-full bg-card border border-border/50">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-bold text-foreground">Get a Quote</h1>
            <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {steps.length} · {steps[currentStep]}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= currentStep ? "bg-primary" : "bg-border"
            }`} />
          ))}
        </div>
      </div>

      <div className="px-5 pb-32">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div key="vehicle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex justify-center mb-4">
                <img src={carTop} alt="Vehicle" className="h-32 object-contain opacity-80" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Vehicle Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Make</label>
                  <input value={formData.vehicleMake} onChange={(e) => updateField("vehicleMake", e.target.value)} placeholder="e.g. Toyota" className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Model</label>
                  <input value={formData.vehicleModel} onChange={(e) => updateField("vehicleModel", e.target.value)} placeholder="e.g. Camry" className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Year</label>
                    <input value={formData.vehicleYear} onChange={(e) => updateField("vehicleYear", e.target.value)} placeholder="2024" className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">Plate Number</label>
                    <input value={formData.plateNumber} onChange={(e) => updateField("plateNumber", e.target.value)} placeholder="LAG-123-XY" className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div key="owner" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                <User className="h-8 w-8" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Owner Information</h2>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Full Name</label>
                  <input value={formData.fullName} onChange={(e) => updateField("fullName", e.target.value)} placeholder="Adebayo Johnson" className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number</label>
                  <input value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+234 800 000 0000" className="w-full rounded-xl bg-card border border-border/50 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input value={formData.location} onChange={(e) => updateField("location", e.target.value)} placeholder="Lagos, Nigeria" className="w-full rounded-xl bg-card border border-border/50 py-3 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div key="coverage" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
                <Shield className="h-8 w-8" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Coverage Type</h2>
              <p className="text-sm text-muted-foreground">Select the level of protection for your vehicle.</p>
              <div className="space-y-3">
                {[
                  { id: "comprehensive", title: "Comprehensive", desc: "Full coverage including theft, fire, and accident damage", price: "₦45,000/yr" },
                  { id: "thirdparty", title: "Third Party", desc: "Covers damage to other people and property", price: "₦15,000/yr" },
                  { id: "thirdpartyfire", title: "Third Party + Fire & Theft", desc: "Third party plus fire and theft protection", price: "₦28,000/yr" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => updateField("coverageType", opt.id)}
                    className={`w-full text-left rounded-2xl p-4 border-2 transition-all ${
                      formData.coverageType === opt.id
                        ? "border-primary bg-primary/5"
                        : "border-border/50 bg-card hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-heading font-semibold text-foreground">{opt.title}</span>
                      <span className="font-heading text-sm font-bold text-primary">{opt.price}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10 text-success mb-2">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="font-heading text-lg font-semibold text-foreground">Review Application</h2>
              <p className="text-sm text-muted-foreground">Our AI will analyze your data and provide an instant risk assessment.</p>
              <div className="space-y-3">
                {[
                  { label: "Vehicle", value: `${formData.vehicleMake || "Toyota"} ${formData.vehicleModel || "Camry"} ${formData.vehicleYear || "2024"}` },
                  { label: "Plate", value: formData.plateNumber || "LAG-123-XY" },
                  { label: "Owner", value: formData.fullName || "Adebayo Johnson" },
                  { label: "Location", value: formData.location || "Lagos, Nigeria" },
                  { label: "Coverage", value: formData.coverageType === "comprehensive" ? "Comprehensive" : formData.coverageType === "thirdparty" ? "Third Party" : "Third Party + Fire & Theft" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between rounded-xl bg-card border border-border/50 px-4 py-3">
                    <span className="text-sm text-muted-foreground">{label}</span>
                    <span className="text-sm font-medium text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border p-5 safe-area-bottom">
        <button
          onClick={handleNext}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 active:scale-[0.98]"
        >
          {currentStep === steps.length - 1 ? "Submit for AI Analysis" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Quote;
