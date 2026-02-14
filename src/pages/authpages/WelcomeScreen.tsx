import { useNavigate } from "react-router-dom";
import AuthButton from "./components/AuthButton";
import PageTransition from "./components/PageTransition";
import logo from "./assets/logo.png";

const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="mobile-frame min-h-screen bg-background flex flex-col items-center justify-between px-8 py-16">
      {/* Top section with logo and headline */}
      <div className="flex-1 flex flex-col items-center justify-center pt-8">
        <div className="w-24 h-24 rounded-full bg-foreground flex items-center justify-center overflow-hidden">
          <img src={logo} alt="ConvoSpace" className="w-16 h-16 object-contain" />
        </div>
        
        <h1 className="mt-12 text-3xl font-bold text-foreground text-center leading-tight">
          Connect instantly through
          <br />
          seamless video calls.
        </h1>
      </div>

      {/* Bottom section with buttons */}
      <div className="w-full space-y-3 pb-8">
        <AuthButton variant="primary" onClick={() => navigate("/signup")}>
          Create an account
        </AuthButton>
        
        <AuthButton variant="outlined" onClick={() => navigate("/login")}>
          Log in
        </AuthButton>
      </div>
    </div>
    </PageTransition>
  );
};

export default WelcomeScreen;
