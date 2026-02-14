import { Home, Clock, MessageCircle, User } from "lucide-react";

const BottomNavigation = () => {
  const navItems = [
    { icon: Home, label: "Home", active: true },
    { icon: Clock, label: "History", active: false },
    { icon: MessageCircle, label: "Chat", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-xl border-t border-border/50 px-8 pt-3 pb-8">
      <div className="max-w-md mx-auto flex items-center justify-between">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`flex flex-col items-center gap-1.5 py-1 px-3 transition-all duration-200 ${
              item.active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon className={`h-6 w-6 ${item.active ? "stroke-[2.5px]" : ""}`} />
            <span className="text-[10px] font-semibold tracking-wide">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
