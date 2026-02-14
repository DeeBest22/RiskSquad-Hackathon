import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* ─── shape of the user object we persist ─── */
export interface AuthUser {
  id: string;
  name: string;          // "firstName lastName"
  firstName: string;
  email: string;
  profilePicture?: string;
  authProvider: "local" | "google" | "facebook";
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* On mount – check whether the server still considers us authenticated */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          const u = data.user;
          setUser({
            id: u.id,
            name: u.name,
            firstName: u.name.split(" ")[0],
            email: u.email,
            profilePicture: u.profilePicture,
            authProvider: u.authProvider || "local",
          });
        }
      } catch {
        // not logged in – that's fine
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = (u: AuthUser) => {
    setUser(u);
  };

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } catch {
      // best-effort
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};
