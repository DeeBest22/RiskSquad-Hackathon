import { Video } from "lucide-react";

interface ConvoSpaceLogoProps {
  size?: "sm" | "md" | "lg";
}

const ConvoSpaceLogo = ({ size = "md" }: ConvoSpaceLogoProps) => {
  const dimensions = {
    sm: { container: 64, icon: 32 },
    md: { container: 80, icon: 40 },
    lg: { container: 96, icon: 48 },
  };

  const { container, icon } = dimensions[size];

  return (
    <div
      className="rounded-full bg-foreground flex items-center justify-center"
      style={{ width: container, height: container }}
    >
      <Video size={icon} className="text-background" strokeWidth={2.5} />
    </div>
  );
};

export default ConvoSpaceLogo;
