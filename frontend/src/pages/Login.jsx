import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import {
  Brain,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Globe,
  CheckCircle2,
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [unauthorizedDomain, setUnauthorizedDomain] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Detect whether app is running on localhost or Vercel
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1");
  const currentHostname =
    typeof window !== "undefined" ? window.location.hostname : "localhost";

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/boards");
    }
  }, [navigate]);

  const handleCopyDomain = () => {
    navigator.clipboard.writeText(currentHostname);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ================= GOOGLE AUTHENTICATION ================= */
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setUnauthorizedDomain(false);
    setGoogleLoading(true);

    try {
      // 1. Sign in with Google via Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // 2. Synchronize user with MongoDB Atlas backend via axios (Render or local)
      const res = await axios.post("/auth/google", {
        name: googleUser.displayName || googleUser.email.split("@")[0],
        email: googleUser.email,
        googleId: googleUser.uid,
        avatar: googleUser.photoURL || "",
      });

      // 3. Save JWT session in context & localStorage
      setToast({
        type: "success",
        message: "Signed in successfully! Loading workspace...",
      });
      login(res.data.token, res.data.user);

      setTimeout(() => {
        navigate("/boards");
      }, 600);
    } catch (error) {
      console.error("Firebase Google Sign In Error:", error);

      if (error.code === "auth/unauthorized-domain") {
        setUnauthorizedDomain(true);
      } else if (error.code === "auth/popup-closed-by-user") {
        setErrorMsg("Google sign-in popup was closed before completing.");
      } else if (error.code === "auth/cancelled-popup-request") {
        setErrorMsg("Only one sign-in popup can be opened at a time.");
      } else if (error.code === "auth/network-request-failed") {
        setErrorMsg("Firebase network error. Please verify your connection or check if an ad-blocker is blocking Firebase.");
      } else if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        setErrorMsg("Cannot reach backend server. The Render instance may be spinning up from sleep (wait 30-50s and retry).");
      } else {
        setErrorMsg(
          error.response?.data?.message ||
            error.message ||
            "Failed to authenticate with Google."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  /* ================= STANDARD EMAIL/PASSWORD LOGIN ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setUnauthorizedDomain(false);
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      setToast({
        type: "success",
        message: "Signed in successfully! Loading workspace...",
      });
      login(res.data.token, res.data.user);

      setTimeout(() => {
        navigate("/boards");
      }, 600);
    } catch (error) {
      setErrorMsg(
        error.response?.data?.message || "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white relative overflow-hidden flex flex-col justify-center items-center px-4 py-12 selection:bg-indigo-500 selection:text-white">
      {/* Ambient background glow per TaskFlow UI v2 spec */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,.22),transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,.18),transparent_40%)] pointer-events-none" />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl border backdrop-blur-2xl shadow-2xl text-xs font-semibold ${
              toast.type === "success"
                ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-200"
                : "bg-rose-950/80 border-rose-500/40 text-rose-200"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-8 relative z-10"
      >
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">TaskFlow</h1>
          <p className="text-xs text-indigo-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Premium SaaS Workspace
          </p>
        </div>
      </motion.div>

      {/* Login Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        {/* Environment Pill Indicator */}
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
            <Globe className="w-3 h-3 text-indigo-400" />
            <span>{isLocalhost ? "Localhost Dev" : "Vercel Production"}</span>
          </span>
          <span className="text-[10px] font-mono text-slate-500 truncate max-w-[170px]">
            {currentHostname}
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign In to Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            One-click Google authentication or email sign-in
          </p>
        </div>

        {/* 🚨 SPECIALIZED UNAUTHORIZED DOMAIN DIAGNOSTIC CARD */}
        <AnimatePresence>
          {unauthorizedDomain && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-5 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-rose-200 text-sm leading-snug">
                    Google Sign-In isn't enabled for this domain
                  </h4>
                  <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                    This deployment URL hasn't been authorized in Firebase Authentication.
                  </p>
                </div>
              </div>

              {/* Copyable current domain */}
              <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-950/70 border border-white/10 font-mono text-[11px]">
                <span className="text-indigo-300 truncate">{currentHostname}</span>
                <button
                  type="button"
                  onClick={handleCopyDomain}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-semibold flex items-center gap-1 transition-all"
                  title="Copy domain to clipboard"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>
              </div>

              {/* Direct Firebase Console Action */}
              <div className="flex items-center justify-between pt-1 border-t border-rose-500/20 text-[11px]">
                <a
                  href="https://console.firebase.google.com/project/mern-e7943/authentication/settings"
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 hover:text-indigo-200 font-semibold underline flex items-center gap-1 transition-colors"
                >
                  <span>Authorize in Firebase Console</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={() => setUnauthorizedDomain(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Standard Error Alert */}
        <AnimatePresence>
          {errorMsg && !unauthorizedDomain && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-rose-300 text-xs font-medium"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg("")}
                className="text-rose-400 hover:text-rose-200 text-xs ml-2"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 GOOGLE AUTHENTICATION (PRIMARY ACTION) */}
        <div className="space-y-4">
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="group w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 shadow-lg shadow-black/20 flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Authenticating with Google...</span>
              </>
            ) : (
              <>
                {/* Official Google Brand SVG */}
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span className="text-sm font-semibold tracking-tight">
                  Sign in with Google
                </span>
              </>
            )}
          </motion.button>

          <div className="flex items-center gap-1.5 justify-center text-[11px] text-slate-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Secure OAuth 2.0 & Cloud Encryption</span>
          </div>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-[#020817] px-3 text-slate-400 font-medium">
              or continue with email
            </span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading || googleLoading}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading || googleLoading}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all disabled:opacity-50"
              />
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>Sign in with Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-indigo-400 hover:underline inline-flex items-center gap-0.5 ml-1"
          >
            Register with Google / Email
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
