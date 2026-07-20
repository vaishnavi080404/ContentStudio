"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/layout/Sidebar";
import { createSupabaseBrowserClient } from "@/lib/supabase";

const supabase = createSupabaseBrowserClient();

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, delay: i * 0.07, ease: [0.16, 0.9, 0.3, 1] },
  }),
};

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwStatus, setPwStatus] = useState({ type: "", message: "" }); // type: 'success' | 'error'
  const [pwLoading, setPwLoading] = useState(false);

  // destructive actions ask for one extra click before they fire — no browser confirm(), animated inline instead
  const [confirmingDesigns, setConfirmingDesigns] = useState(false);
  const [confirmingAccount, setConfirmingAccount] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setEmail(data.user.email);
    });
  }, []);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwStatus({ type: "", message: "" });

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      setPwStatus({ type: "error", message: error.message });
    } else {
      setPwStatus({ type: "success", message: "Password updated." });
      setNewPassword("");
    }
    setPwLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const handleDeleteDesigns = async () => {
    setBusy(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    await supabase.from("Designs").delete().eq("user_id", user.id);
    setBusy(false);
    setConfirmingDesigns(false);
  };

  const handleDeleteAccount = async () => {
    setBusy(true);
    // the route verifies who's calling from the session cookie itself —
    // we don't send a user id, it can't be spoofed
    const res = await fetch("/api/account/delete", { method: "POST" });
    const result = await res.json();

    if (!res.ok) {
      setBusy(false);
      setConfirmingAccount(false);
      alert(result.error || "Something went wrong deleting your account.");
      return;
    }

    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#0d0d14]">
      <Sidebar />

      <div className="flex-1 overflow-y-auto ">
        <div className="px-8 pt-8 pb-6 border-b border-white/5">
          <p className="text-xs text-violet-400 font-medium tracking-widest uppercase mb-1">
            ContentStudio
          </p>
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-sm text-neutral-500 mt-1">Manage your account.</p>
        </div>

        <div className="px-8 py-6 max-w-xl flex flex-col gap-5 ">
          {/* account info */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Email</p>
            <p className="text-sm text-neutral-200">{email || "—"}</p>
          </motion.div>

          {/* change password */}
          <motion.div
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <p className="text-sm font-medium text-neutral-200 mb-3">Change password</p>
            <form onSubmit={handleChangePassword} className="flex flex-col gap-3">
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="bg-white/[0.03] border border-white/10 text-neutral-200 placeholder:text-neutral-600 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-violet-400/60 transition-colors"
              />

              <AnimatePresence mode="wait">
                {pwStatus.message && (
                  <motion.p
                    key={pwStatus.message}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`text-xs ${pwStatus.type === "error" ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {pwStatus.message}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={pwLoading}
                whileHover={{ scale: pwLoading ? 1 : 1.015 }}
                whileTap={{ scale: pwLoading ? 1 : 0.98 }}
                className="self-start bg-violet-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-violet-500 disabled:opacity-50 transition-colors"
              >
                {pwLoading ? "Updating..." : "Update password"}
              </motion.button>
            </form>
          </motion.div>

          {/* sign out */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-neutral-200">Sign out</p>
              <p className="text-xs text-neutral-500 mt-0.5">End your current session.</p>
            </div>
            <motion.button
              onClick={handleSignOut}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              className="border border-white/10 text-neutral-300 rounded-lg px-4 py-2 text-sm hover:bg-white/[0.06] transition-colors"
            >
              Sign out
            </motion.button>
          </motion.div>

          {/* danger zone */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-red-500/[0.04] backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 flex flex-col gap-5"
          >
            <p className="text-xs text-red-400 uppercase tracking-widest font-medium">Danger zone</p>

            {/* delete all designs */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-200">Delete all designs</p>
                <p className="text-xs text-neutral-500 mt-0.5">Removes every design you've saved. Cannot be undone.</p>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {!confirmingDesigns ? (
                  <motion.button
                    key="ask"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setConfirmingDesigns(true)}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    className="shrink-0 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </motion.button>
                ) : (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="shrink-0 flex items-center gap-2"
                  >
                    <button
                      onClick={() => setConfirmingDesigns(false)}
                      className="text-xs text-neutral-500 hover:text-neutral-300 px-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteDesigns}
                      disabled={busy}
                      className="bg-red-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      {busy ? "Deleting..." : "Confirm delete"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <hr className="border-red-500/10" />

            {/* delete account */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-neutral-200">Delete account</p>
                <p className="text-xs text-neutral-500 mt-0.5">Permanently deletes your account and all data.</p>
              </div>

              <AnimatePresence mode="wait" initial={false}>
                {!confirmingAccount ? (
                  <motion.button
                    key="ask"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setConfirmingAccount(true)}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    className="shrink-0 border border-red-500/30 text-red-400 rounded-lg px-4 py-2 text-sm hover:bg-red-500/10 transition-colors"
                  >
                    Delete
                  </motion.button>
                ) : (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="shrink-0 flex items-center gap-2"
                  >
                    <button
                      onClick={() => setConfirmingAccount(false)}
                      className="text-xs text-neutral-500 hover:text-neutral-300 px-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={busy}
                      className="bg-red-500 text-white rounded-lg px-4 py-2 text-sm hover:bg-red-600 disabled:opacity-50 transition-colors"
                    >
                      {busy ? "Deleting..." : "Confirm delete"}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}