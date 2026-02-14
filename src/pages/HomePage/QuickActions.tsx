import { Link } from "react-router-dom";
import { Users, Calendar, Link2 } from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      icon: Users,
      label: "Join",
      subtitle: "Enter code",
      route: "/JoinMeeting",
    },
    {
      icon: Calendar,
      label: "Schedule",
      subtitle: "Plan ahead",
      route: null,
    },
    {
      icon: Link2,
      label: "Share",
      subtitle: "Invite link",
      route: null,
    },
  ];

  return (
    <section className="px-6 py-6">
      <div className="flex gap-3">
        {actions.map((action) => {
          const content = (
            <>
              <div className="h-12 w-12 rounded-xl icon-container flex items-center justify-center">
                <action.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">{action.label}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{action.subtitle}</p>
              </div>
            </>
          );

          const className = "flex-1 card-interactive rounded-2xl p-4 flex flex-col items-center gap-3 active:scale-[0.97]";

          return action.route ? (
            <Link key={action.label} to={action.route} className={className}>
              {content}
            </Link>
          ) : (
            <button key={action.label} className={className}>
              {content}
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;