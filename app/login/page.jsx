"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const supabase = createSupabaseBrowserClient();

// stagger container for the card's children — each direct child fades/rises in sequence
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 0.9, 0.3, 1] } },
};

// error shakes horizontally once instead of just fading in — reads as "wrong", not just "new text"
const errorVariants = {
  hidden: { opacity: 0, x: 0 },
  visible: {
    opacity: 1,
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4 },
  },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/auth/callback" },
    });
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { email, password } = formData;

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      window.location.href = "/";
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d14] relative overflow-hidden">
      {/* ambient glow blobs — slow drifting, purely decorative, matches the hero's dark/violet language */}
      <motion.div
        className="absolute w-[420px] h-[420px] rounded-full bg-violet-600/20 blur-[100px]"
        style={{ top: "-10%", left: "-8%" }}
        animate={{ x: [0, 30, 0], y: [0, 20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-[380px] h-[380px] rounded-full bg-fuchsia-600/15 blur-[100px]"
        style={{ bottom: "-12%", right: "-6%" }}
        animate={{ x: [0, -25, 0], y: [0, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative bg-white/[0.05] backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] w-full max-w-md"
      >
        <motion.h1 variants={fieldVariants} className="text-2xl font-bold text-white mb-6 text-center tracking-tight">
          {isSignUp ? "Create an account" : "Sign in to Content Studio"}
        </motion.h1>

        {/* google */}
        <motion.button
          variants={fieldVariants}
          onClick={handleGoogleSignIn}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          className="w-full border border-white/10 bg-white/[0.03] rounded-lg py-2.5 text-sm text-neutral-200 hover:bg-white/[0.06] mb-4 flex items-center justify-center gap-2 transition-colors"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt=""
          />
          Continue with Google
        </motion.button>

        <motion.div variants={fieldVariants} className="flex items-center gap-3 mb-4">
          <hr className="flex-1 border-white/10" />
          <span className="text-xs text-neutral-500">or</span>
          <hr className="flex-1 border-white/10" />
        </motion.div>

        {/* email form */}
        <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
          <motion.input
            variants={fieldVariants}
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            whileFocus={{ borderColor: "rgba(167,139,250,0.6)" }}
            className="bg-white/[0.03] border border-white/10 text-neutral-200 placeholder:text-neutral-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400/60 transition-colors"
          />
          <motion.input
            variants={fieldVariants}
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            whileFocus={{ borderColor: "rgba(167,139,250,0.6)" }}
            className="bg-white/[0.03] border border-white/10 text-neutral-200 placeholder:text-neutral-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400/60 transition-colors"
          />

          <AnimatePresence>
            {error && (
              <motion.p
                key={error}
                variants={errorVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-xs text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            variants={fieldVariants}
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.015 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="bg-violet-600 text-white rounded-lg py-2.5 text-sm hover:bg-violet-500 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <motion.span
                  className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
                />
                Please wait...
              </span>
            ) : isSignUp ? (
              "Create account"
            ) : (
              "Sign in"
            )}
          </motion.button>
        </form>

        <motion.p variants={fieldVariants} className="text-xs text-neutral-500 text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-violet-400 ml-1 hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </button>
        </motion.p>
      </motion.div>
    </div>
  );
}