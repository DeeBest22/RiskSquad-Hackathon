import { Link } from "react-router-dom";
import { Clock, Users } from "lucide-react";

const UpcomingMeeting = () => {
  const participants = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&h=60&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&h=60&fit=crop&crop=face",
  ];

  return (
    <section className="px-6 py-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground tracking-wide">Next Up</h2>
        <span className="text-xs text-muted-foreground">In 35 min</span>
      </div>
      
      <div className="card-elevated rounded-3xl p-5 relative overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-foreground mb-1">Product Review</h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span className="text-xs font-medium">4:30 PM — 5:00 PM</span>
              </div>
            </div>
            <Link to="/oinMeeting" className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/15 transition-colors">
              Join
            </Link>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t border-border/50">
            <div className="flex -space-x-2">
              {participants.map((avatar, i) => (
                <img
                  key={i}
                  src={avatar}
                  alt="Participant"
                  className="h-8 w-8 rounded-full border-2 border-card object-cover"
                />
              ))}
              <div className="h-8 w-8 rounded-full border-2 border-card bg-secondary flex items-center justify-center">
                <span className="text-[10px] font-bold text-muted-foreground">+2</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">5 people</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingMeeting;