import { useEffect, useRef, useCallback } from "react";

declare global {
  interface Window {
    fbAsyncInit?: () => void;
    FB?: any;
  }
}

const FB_APP_ID = import.meta.env.VITE_FB_APP_ID || "YOUR_FB_APP_ID";

/**
 * Loads the Facebook SDK once, then exposes a `fbLogin()` that resolves
 * with { id, name, email, picture } or rejects on failure / denial.
 */
export function useFacebook() {
  const sdkReady = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (sdkReady.current) return; // already loading / loaded

    sdkReady.current = new Promise<void>((resolve) => {
      // If already loaded (e.g. HMR), just resolve
      if (window.FB) {
        window.FB.init({ appId: FB_APP_ID, cookie: true, xfbml: true, version: "v19.0" });
        resolve();
        return;
      }

      window.fbAsyncInit = () => {
        window.FB.init({ appId: FB_APP_ID, cookie: true, xfbml: true, version: "v19.0" });
        resolve();
      };

      // Inject the async SDK script (idempotent – FB guards against double-insert)
      (function (d: Document, s: string, id: string) {
        if (d.getElementById(id)) { resolve(); return; }
        const fjs = d.getElementsByTagName(s)[0];
        const js = d.createElement(s) as HTMLScriptElement;
        js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode!.insertBefore(js, fjs);
      })(document, "script", "facebook-jssdk");
    });
  }, []);

  /**
   * Resolves with the user profile **plus** the raw accessToken so the
   * backend can verify it independently via the Graph API.
   */
  const fbLogin = useCallback((): Promise<{
    id: string;
    name: string;
    email?: string;
    picture?: string;
    _accessToken: string; // raw FB short-lived token – pass to /api/auth/facebook
  }> => {
    return new Promise((resolve, reject) => {
      const doLogin = () => {
        window.FB.login(
          (response: any) => {
            if (response.status === "connected") {
              const token = response.authResponse.accessToken;
              window.FB.api(
                "/me?fields=name,email,picture.size(200)",
                { access_token: token },
                (profile: any) => {
                  resolve({
                    id:            profile.id,
                    name:          profile.name,
                    email:         profile.email,
                    picture:       profile.picture?.data?.url,
                    _accessToken:  token, // ← exposed for backend verification
                  });
                }
              );
            } else {
              reject(new Error("Facebook login cancelled or failed"));
            }
          },
          { scope: "email" }
        );
      };

      if (sdkReady.current) {
        sdkReady.current.then(doLogin);
      } else {
        reject(new Error("Facebook SDK not initialised"));
      }
    });
  }, []);

  return { fbLogin };
}