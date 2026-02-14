import { useState } from "react";
import { Users } from "lucide-react";

const FloatingCallButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    } else {
      console.log("Create meeting");
    }
  };

  const handleBlur = () => {
    setTimeout(() => setIsExpanded(false), 150);
  };

  return (
    <button
      onClick={handleClick}
      onBlur={handleBlur}
      className="fixed bottom-28 right-6 h-12 rounded-full btn-hero flex items-center justify-end active:scale-95 z-50 overflow-hidden transition-all duration-300 ease-out"
      style={{ width: isExpanded ? "180px" : "48px" }}
    >
      {/* Icon - always centered when collapsed, left-aligned when expanded */}
      <div
        className={`absolute inset-0 flex items-center transition-all duration-300 ease-out ${
          isExpanded ? "pl-5" : "justify-center"
        }`}
      >
        <Users className="h-5 w-5 text-primary-foreground flex-shrink-0" />
      </div>

      {/* Text */}
      <div
        className={`relative z-0 flex items-center transition-all duration-300 ease-out ${
          isExpanded ? "opacity-100 pr-6 pl-12" : "opacity-0 pr-0 pl-0 w-0"
        }`}
      >
        <span className="text-primary-foreground font-semibold text-sm whitespace-nowrap">
          Create Meeting
        </span>
      </div>
    </button>
  );
};

export default FloatingCallButton;