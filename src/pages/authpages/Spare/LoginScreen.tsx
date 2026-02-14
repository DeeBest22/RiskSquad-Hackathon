import { useNavigate } from "react-router-dom";
import { Mail, Smartphone } from "lucide-react";
import AuthButton from "./components/AuthButton";
import PageTransition from "./components/PageTransition";
import logo from "./assets/logo.png";

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
    />
    <path
      fill="#34A853"
      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
    />
    <path
      fill="#4A90E2"
      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
    />
    <path
      fill="#FBBC05"
      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7## L1.23746264,17.3349879 L5.27698177,14.2678769 Z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

const LoginScreen = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <div className="mobile-frame min-h-screen bg-background flex flex-col items-center px-8 py-16">
      {/* Logo */}
      <div className="pt-8">
        <div className="w-20 h-20 rounded-full bg-foreground flex items-center justify-center overflow-hidden">
          <img src={logo} alt="ConvoSpace" className="w-14 h-14 object-contain" />
        </div>
      </div>

      {/* Headline */}
      <h1 className="mt-10 text-3xl font-bold text-foreground text-center">
        Log in to ConvoSpace
      </h1>

      {/* Auth buttons */}
      <div className="w-full mt-12 space-y-3">
        <AuthButton
          variant="primary"
          icon={<Mail size={20} />}
        >
          Continue with email
        </AuthButton>

        <AuthButton
          variant="outlined"
          icon={<Smartphone size={20} />}
        >
          Continue with phone number
        </AuthButton>

        <AuthButton
          variant="outlined"
          icon={<GoogleIcon />}
        >
          Continue with Google
        </AuthButton>

        <AuthButton
          variant="outlined"
          icon={<FacebookIcon />}
        >
          Continue with Facebook
        </AuthButton>
      </div>

      {/* Footer */}
      <div className="mt-auto pt-12 text-center">
        <p className="text-muted-foreground">
          Don't have an account?
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="mt-1 text-foreground font-semibold hover:underline"
        >
          Sign up
        </button>
      </div>
      </div>
    </PageTransition>
  );
};

export default LoginScreen;
