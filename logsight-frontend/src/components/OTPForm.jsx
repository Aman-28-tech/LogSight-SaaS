import { useState } from "react";
import { motion } from "framer-motion";

export default function OTPForm({ email, onVerify, onResend, loading, errorMsg, successMsg }) {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    onVerify(otp);
  };

  return (
    <div className="flex items-center justify-center px-4 pb-10 pt-20 sm:px-6 sm:pb-16 sm:pt-24 min-h-[calc(100vh-130px)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl glass p-10 shadow-2xl ring-1 ring-white/10"
      >
        <h2 className="mb-4 text-center text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
          Verify Email
        </h2>
        <p className="mb-8 text-center text-slate-400 text-sm">
          We've sent a 6-digit code to <span className="text-indigo-400 font-semibold">{email}</span>. 
          Please enter it below to verify your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Verification Code</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-indigo-500 focus:bg-slate-900/80 focus:ring-2 focus:ring-indigo-500/50 hover:bg-slate-800/60"
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || otp.length !== 6}
            className={`w-full rounded-xl py-3.5 font-bold tracking-wide text-white transition-all overflow-hidden relative ${
              loading || otp.length !== 6
                ? "cursor-not-allowed bg-indigo-500/50 shadow-none border border-indigo-500/20"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-[0_4px_20px_0_rgba(79,70,229,0.4)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)] border border-indigo-400/30"
            }`}
          >
            {loading ? "Verifying..." : "Verify & Continue"}
          </motion.button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={onResend}
            disabled={loading}
            className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300 hover:underline disabled:text-slate-500"
          >
            Didn't receive the code? Resend
          </button>
        </div>

        {errorMsg && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400 backdrop-blur-md"
          >
            {errorMsg}
          </motion.p>
        )}

        {successMsg && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-sm font-medium text-emerald-400 backdrop-blur-md"
          >
            {successMsg}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
