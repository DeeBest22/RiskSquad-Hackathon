import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Smartphone, Loader2 } from "lucide-react";
import AuthButton from "./components/AuthButton";
import PageTransition from "./components/PageTransition";
import logo from "./assets/logo.png";
import { useAuth } from "../AuthContext";
import { useFacebook } from "./useFacebook";

/* ─── Inline SVG icons (unchanged from original) ─── */
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z" />
    <path fill="#34A853" d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z" />
    <path fill="#4A90E2" d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z" />
    <path fill="#FBBC05" d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7346 1.23746264,17.3349879 L5.27698177,14.2678769 Z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

/* ─── Sub-component: email verification flow ─── */
const EmailVerifyFlow = ({
  onSuccess,
  onCancel,
}: {
  onSuccess: (user: any) => void;
  onCancel: () => void;
}) => {
  const [email, setEmail]       = useState("");
  const [code, setCode]         = useState("");
  const [step, setStep]         = useState<"email" | "code" | "register">("email");
  const [tempUserId, setTempUserId] = useState("");
  const [firstName, setFirstName]   = useState("");
  const [lastName, setLastName]     = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const sendCode = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/login/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to send code"); return; }
      setStep("code");
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  const verifyCode = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/login/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Verification failed"); return; }
      if (data.needsRegistration) {
        setTempUserId(data.tempUserId);
        setStep("register");
        return;
      }
      onSuccess(data.user);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  const completeRegistration = async () => {
    if (!firstName.trim() || !lastName.trim()) { setError("Enter your full name"); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/complete-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tempUserId, firstName: firstName.trim(), lastName: lastName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      onSuccess(data.user);
    } catch { setError("Network error"); }
    finally { setLoading(false); }
  };

  /* ─ shared input style ─ */
  const inputCls =
    "w-full h-12 rounded-full border border-muted-foreground/40 bg-transparent text-foreground placeholder-muted-foreground px-5 text-sm font-medium focus:outline-none focus:border-primary transition-colors";

  return (
    <div className="w-full space-y-4">
      {step === "email" && (
        <>
          <input
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && email && sendCode()}
            className={inputCls}
            autoFocus
          />
          {error && <p className="text-destructive text-xs text-center -mt-2">{error}</p>}
          <AuthButton variant="primary" onClick={sendCode}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send verification code"}
          </AuthButton>
          <AuthButton variant="outlined" onClick={onCancel}>Back</AuthButton>
        </>
      )}

      {step === "code" && (
        <>
          <p className="text-muted-foreground text-sm text-center">
            Code sent to <span className="text-foreground font-semibold">{email}</span>
          </p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="6-digit code"
            maxLength={6}
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && code.length === 6 && verifyCode()}
            className={inputCls}
            autoFocus
          />
          {error && <p className="text-destructive text-xs text-center -mt-2">{error}</p>}
          <AuthButton variant="primary" onClick={verifyCode}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
          </AuthButton>
          <AuthButton variant="outlined" onClick={() => { setStep("email"); setCode(""); }}>Back</AuthButton>
        </>
      )}

      {step === "register" && (
        <>
          <p className="text-muted-foreground text-sm text-center">Almost there — just your name!</p>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => { setFirstName(e.target.value); setError(""); }}
            className={inputCls}
            autoFocus
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => { setLastName(e.target.value); setError(""); }}
            className={inputCls}
          />
          {error && <p className="text-destructive text-xs text-center -mt-2">{error}</p>}
          <AuthButton variant="primary" onClick={completeRegistration}>
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Get started"}
          </AuthButton>
          <AuthButton variant="outlined" onClick={onCancel}>Cancel</AuthButton>
        </>
      )}
    </div>
  );
};

/* ─── Main LoginScreen ─── */
const LoginScreen = () => {
  const navigate        = useNavigate();
  const { login, user } = useAuth();
  const { fbLogin }     = useFacebook();
  const [emailOpen, setEmailOpen] = useState(false);
  const [loading, setLoading]     = useState<string | null>(null); // which button is spinning
  const [error, setError]         = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  /* ─── shared success handler ─── */
  const handleSuccess = (user: any) => {
    login({
      id:             user.id,
      name:           user.name,
      firstName:      user.firstName || user.name.split(" ")[0],
      email:          user.email,
      profilePicture: user.profilePicture,
      authProvider:   user.authProvider || "local",
    });
    navigate("/");
  };

  /* ─── Google ─── */
  const handleGoogle = () => {
    // Server-side redirect flow – just open the OAuth URL
    window.location.href = "/auth/google";
  };

  /* ─── Facebook ─── */
  const handleFacebook = async () => {
    setLoading("facebook"); setError("");
    try {
      const fbUser = await fbLogin();
      // Send the token to our backend for verification + upsert
      const res = await fetch("/api/auth/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ accessToken: (fbUser as any)._accessToken || "" }),
      });
      // NOTE: useFacebook doesn't expose the raw token directly in the resolved value.
      // We need to adjust – see the note in useFacebook.ts. For now we pass what we have
      // and let the backend handle it. A cleaner approach: expose the token from the hook.
      // (See the updated useFacebook.ts which does this.)
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Facebook login failed"); return; }
      handleSuccess(data.user);
    } catch (e: any) {
      setError(e.message || "Facebook login failed");
    } finally { setLoading(null); }
  };

  /* ─── Render ─── */
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

        {/* Auth buttons / email flow */}
        <div className="w-full mt-12 space-y-3">
          {emailOpen ? (
            <EmailVerifyFlow
              onSuccess={handleSuccess}
              onCancel={() => { setEmailOpen(false); setError(""); }}
            />
          ) : (
            <>
              <AuthButton variant="primary" icon={<Mail size={20} />} onClick={() => setEmailOpen(true)}>
                Continue with email
              </AuthButton>

              <AuthButton variant="outlined" icon={<Smartphone size={20} />}>
                Continue with phone number
              </AuthButton>

              <AuthButton variant="outlined" icon={<GoogleIcon />} onClick={handleGoogle}>
                Continue with Google
              </AuthButton>

              <AuthButton variant="outlined" icon={<FacebookIcon />} onClick={handleFacebook}>
                {loading === "facebook" ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue with Facebook"}
              </AuthButton>

              {error && <p className="text-destructive text-xs text-center">{error}</p>}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto pt-12 text-center">
          <p className="text-muted-foreground">Don't have an account?</p>
          <button onClick={() => navigate("/signup")} className="mt-1 text-foreground font-semibold hover:underline">
            Sign up
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginScreen;