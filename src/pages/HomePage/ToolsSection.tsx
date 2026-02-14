import { Monitor, Mic, Users, Settings } from "lucide-react";

const ToolsSection = () => {
  const tools = [
    { icon: Monitor, label: "Screen Share" },
    { icon: Mic, label: "Record" },
    { icon: Users, label: "Contacts" },
    { icon: Settings, label: "Settings" },
  ];

  return (
    <section className="px-6 py-4">
      <h2 className="text-sm font-semibold text-foreground tracking-wide mb-4">Tools</h2>
      <div className="flex gap-3">
        {tools.map((tool) => (
          <button
            key={tool.label}
            className="flex-1 flex flex-col items-center gap-2.5 py-4 rounded-2xl hover:bg-secondary/50 transition-all active:scale-95"
          >
            <div className="h-11 w-11 rounded-xl icon-container flex items-center justify-center">
              <tool.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground tracking-wide">{tool.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ToolsSection;
