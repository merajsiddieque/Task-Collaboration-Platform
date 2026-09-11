import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
} from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/boards");
    }
  }, [navigate]);

  /* ================= GOOGLE AUTHENTICATION (FIREBASE + MONGODB) ================= */
  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setGoogleLoading(true);

    try {
      // 1. Sign in with Google via Firebase popup
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;

      // 2. Persist / synchronize user with MongoDB Atlas backend
      const res = await axios.post("/auth/google", {
        name: googleUser.displayName || googleUser.email.split("@")[0],
        email: googleUser.email,
        googleId: googleUser.uid,
        avatar: googleUser.photoURL || "",
      });

      // 3. Save JWT session in context & localStorage
      login(res.data.token, res.data.user);
      navigate("/boards");
    } catch (error) {
      console.error("Firebase Google Sign In Error:", error);
      if (error.code === "auth/popup-closed-by-user") {
        setErrorMsg("Google sign-in popup was closed before completing.");
      } else if (error.code === "auth/unauthorized-domain") {
        setErrorMsg(
          `Domain "${window.location.hostname}" is not authorized in Firebase Console. Please add "${window.location.hostname}" to Authorized Domains in Firebase Authentication Settings.`
        );
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
    setLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      login(res.data.token, res.data.user);
      navigate("/boards");
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

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-8 relative z-10">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
          <Brain className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">TaskFlow</h1>
          <p className="text-xs text-indigo-300 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Premium SaaS Workspace
          </p>
        </div>
      </div>

      {/* Login Glass Card per TaskFlow UI v2 spec */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            Sign In to Workspace
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            One-click Google authentication or email sign-in
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-300 text-xs font-medium animate-fade-in">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 🌟 GOOGLE AUTHENTICATION (PRIMARY ACTION) */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || loading}
            className="group w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold border border-white/10 shadow-lg shadow-black/20 flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 cursor-pointer"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span>Connecting to Google...</span>
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
          </button>

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
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
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
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:scale-[1.02] text-white text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition duration-200 disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Sign in with Email</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
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
      </div>
    </div>
  );
}
