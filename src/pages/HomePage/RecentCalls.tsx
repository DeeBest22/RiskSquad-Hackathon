import { useState, useEffect } from "react";
import { Video, Phone, ArrowUpRight, ArrowDownLeft, Loader2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CallRecord {
  _id:              string;
  meetingId:        string;
  meetingName:      string;
  participantNames: string[];
  startTime:        string;   // ISO string from Mongo
  endTime:          string | null;
  duration:         number;   // seconds
  callType:         "video" | "audio";
  direction:        "outgoing" | "incoming";
  missed:           boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
/** "45:12", "1:02:34", etc. */
function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** "2 min ago", "3h ago", "Yesterday", or a date string */
function formatTimeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 120)  return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    return `${h}h ago`;
  }
  if (seconds < 172800) return "Yesterday";
  // fallback to locale date
  return new Date(isoString).toLocaleDateString();
}

/** "Sarah, Alex & 2 more" or just the names joined */
function formatParticipants(names: string[]): string {
  if (!names || names.length === 0) return "You";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} & ${names[1]}`;
  return `${names[0]}, ${names[1]} & ${names.length - 2} more`;
}

/** Deterministic colour from a string (for the avatar fallback) */
function stringToColor(str: string): string {
  const colors = [
    "#667eea", "#764ba2", "#f093fb", "#4facfe",
    "#43e97b", "#fa709a", "#a18cd1", "#fbc2eb",
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

/** Two-letter initials avatar */
function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const bg = stringToColor(name);

  return (
    <div
      className="h-12 w-12 rounded-xl flex items-center justify-center text-white text-sm font-bold select-none"
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
const RecentCalls = () => {
  const [calls, setCalls]       = useState<CallRecord[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/recent-calls", { credentials: "include" });
        if (!res.ok) {
          // 401 just means not logged in – show empty list silently
          if (res.status === 401) { setCalls([]); return; }
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setCalls(data.calls || []);
      } catch (e) {
        console.error("[RecentCalls] fetch error:", e);
        setError("Could not load recent calls");
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, []);                         // run once on mount

  // ── loading spinner ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="px-6 py-4 flex-1 flex flex-col items-center justify-center">
        <Loader2 className="h-5 w-5 text-primary animate-spin" />
      </section>
    );
  }

  // ── empty state ────────────────────────────────────────────────────────────
  if (calls.length === 0) {
    return (
      <section className="px-6 py-4 flex-1">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground tracking-wide">Recent</h2>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-8">
          {error || "No recent calls yet"}
        </p>
      </section>
    );
  }

  // ── main list ──────────────────────────────────────────────────────────────
  return (
    <section className="px-6 py-4 flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground tracking-wide">Recent</h2>
        <button className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
          See all
        </button>
      </div>

      <div className="space-y-2">
        {calls.slice(0, 4).map((call) => {
          const isOutgoing = call.direction === "outgoing";
          const isMissed  = call.missed;
          // The "display name" is the meeting name when it's a group or has a custom name;
          // otherwise fall back to the first other participant's name.
          const displayName =
            call.participantNames.length > 0
              ? formatParticipants(call.participantNames)
              : call.meetingName;

          return (
            <div
              key={call._id}
              className="flex items-center gap-4 p-3 rounded-2xl hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              {/* Avatar – initials fallback keyed on displayName */}
              <div className="relative">
                <AvatarFallback name={displayName} />
                <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-lg bg-card border border-border flex items-center justify-center">
                  {call.callType === "video" ? (
                    <Video className="h-2.5 w-2.5 text-primary" />
                  ) : (
                    <Phone className="h-2.5 w-2.5 text-primary" />
                  )}
                </div>
              </div>

              {/* Name + direction / duration row */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {isOutgoing ? (
                    <ArrowUpRight className={`h-3 w-3 ${isMissed ? "text-destructive" : "text-success"}`} />
                  ) : (
                    <ArrowDownLeft className={`h-3 w-3 ${isMissed ? "text-destructive" : "text-success"}`} />
                  )}
                  <span className={`text-xs ${isMissed ? "text-destructive" : "text-muted-foreground"}`}>
                    {isMissed ? "Missed" : formatDuration(call.duration)}
                  </span>
                </div>
              </div>

              {/* Relative timestamp */}
              <span className="text-xs text-muted-foreground">{formatTimeAgo(call.startTime)}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default RecentCalls;