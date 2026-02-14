import { Search } from "lucide-react";
import { useAuth } from "../AuthContext";

const Header = () => {
  const { user } = useAuth();

  /* ─── derive display values ─── */
  const firstName = user?.firstName || "You";

  // Profile picture: use the one from Google/FB if available,
  // otherwise generate an initials avatar that matches the app's teal accent.
  const avatarUrl = user?.profilePicture
    ? user.profilePicture
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=2dd4bf&color=0f172a&size=100&bold=true`;

  /* ─── time-of-day greeting ─── */
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" :
    hour < 18 ? "Good afternoon" :
                "Good evening";

  return (
    <header className="flex items-center justify-between px-6 pt-14 pb-4">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl overflow-hidden ring-2 ring-primary/30">
            <img
              src={avatarUrl}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          </div>
          <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-success border-2 border-background status-dot" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">{greeting}</p>
          <h1 className="text-lg font-bold text-foreground">{firstName}</h1>
        </div>
      </div>
      
      <button className="h-12 w-12 rounded-2xl icon-container flex items-center justify-center transition-all hover:border-primary/30">
        <Search className="h-5 w-5 text-muted-foreground" />
      </button>
    </header>
  );
};

export default Header;