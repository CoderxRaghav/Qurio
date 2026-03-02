import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Check, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import GlowBackground from "@/components/GlowBackground";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toAuthMessage } from "@/lib/authErrors";

const getPasswordStrength = (pw: string) => {
  let s = 0;
  if (pw.length >= 8) s += 1;
  if (/[A-Z]/.test(pw)) s += 1;
  if (/[0-9]/.test(pw)) s += 1;
  if (/[^A-Za-z0-9]/.test(pw)) s += 1;
  return s;
};

const strengthColors = ["", "bg-destructive", "bg-orange-500", "bg-yellow-500", "bg-primary"];

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signUpWithEmail, signInWithGoogle, isConfigured } = useAuth();
  const navigate = useNavigate();

  const strength = getPasswordStrength(password);
  const passwordsMatch = password.length > 0 && password === confirm;

  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase", met: /[A-Z]/.test(password) },
    { label: "Number", met: /[0-9]/.test(password) },
    { label: "Special char", met: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passwordsMatch) {
      setError("Password and confirm password do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signUpWithEmail(name, email.trim(), password);
      navigate("/dashboard");
    } catch (err) {
      setError(toAuthMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate("/dashboard");
    } catch (err) {
      setError(toAuthMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <GlowBackground />
      <div className="flex-1 flex items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          <div className="glass-panel rounded-2xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold gradient-text">Create Account</h1>
              <p className="text-muted-foreground text-sm">Start generating AI-powered papers</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <motion.div className="space-y-1.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    placeholder="John Doe"
                    required
                    disabled={submitting || googleLoading}
                  />
                </div>
              </motion.div>

              <motion.div className="space-y-1.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                <label className="text-sm text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-glass w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                    placeholder="you@example.com"
                    required
                    disabled={submitting || googleLoading}
                  />
                </div>
              </motion.div>

              <motion.div className="space-y-1.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <label className="text-sm text-muted-foreground">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-glass w-full pl-10 pr-12 py-3 rounded-xl text-sm"
                    placeholder="********"
                    required
                    disabled={submitting || googleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={submitting || googleLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {password.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColors[strength] : "bg-border"}`} />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {checks.map((c) => (
                        <span key={c.label} className={`text-xs flex items-center gap-1 ${c.met ? "text-primary" : "text-muted-foreground"}`}>
                          {c.met ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                          {c.label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              <motion.div className="space-y-1.5" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                <label className="text-sm text-muted-foreground">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="input-glass w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                    placeholder="********"
                    required
                    disabled={submitting || googleLoading}
                  />
                  {confirm.length > 0 && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {passwordsMatch ? <Check className="w-4 h-4 text-primary" /> : <X className="w-4 h-4 text-destructive" />}
                    </span>
                  )}
                </div>
              </motion.div>

              <motion.label className="flex items-start gap-2 cursor-pointer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 accent-primary"
                  disabled={submitting || googleLoading}
                />
                <span className="text-xs text-muted-foreground">I agree to the Terms of Service and Privacy Policy</span>
              </motion.label>

              <motion.button
                type="submit"
                disabled={!agreed || submitting || googleLoading || !isConfigured}
                className="btn-neon w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                whileHover={{ scale: agreed ? 1.01 : 1 }}
                whileTap={{ scale: agreed ? 0.99 : 1 }}
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <motion.button
              className="btn-glass w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="button"
              onClick={handleGoogle}
              disabled={submitting || googleLoading || !isConfigured}
            >
              {googleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Continue with Google
            </motion.button>

            {!isConfigured && (
              <p className="text-xs text-amber-300/90 text-center">
                Firebase is not configured yet. Add VITE_FIREBASE_* env variables in Vercel.
              </p>
            )}
            {error && <p className="text-sm text-destructive text-center">{error}</p>}

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
