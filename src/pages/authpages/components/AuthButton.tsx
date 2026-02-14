import { ReactNode } from "react";

interface AuthButtonProps {
  variant: "primary" | "outlined";
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}

const AuthButton = ({ variant, icon, children, onClick }: AuthButtonProps) => {
  const baseClasses =
    "w-full h-14 rounded-full flex items-center justify-center gap-3 text-base font-semibold transition-all duration-200";

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    outlined:
      "bg-transparent border border-muted-foreground/40 text-foreground hover:border-foreground",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default AuthButton;
