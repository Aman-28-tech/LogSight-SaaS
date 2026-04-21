import { useState } from "react";
import { motion } from "framer-motion";

export default function ResetPasswordForm({
  email,
  handleResetPassword,
  onBackToLogin,
  onResend,
  loading,
  errorMsg,
  successMsg,
}) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6 || !newPassword) return;
    handleResetPassword(otp, newPassword);
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
          Set New Password
        </h2>
        <p className="mb-8 text-center text-slate-400 text-sm">
          A reset code was sent to <span className="text-indigo-400 font-semibold">{email}</span>. 
          Enter it below along with your new password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Reset Code</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-4 text-center text-2xl font-bold tracking-[0.5em] text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-indigo-500 focus:bg-slate-900/80 focus:ring-2 focus:ring-indigo-500/50 hover:bg-slate-800/60"
              placeholder="000000"
              maxLength="6"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">New Password</label>
            <div className="relative">
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-3.5 pr-12 text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-indigo-500 focus:bg-slate-900/80 focus:ring-2 focus:ring-indigo-500/50 hover:bg-slate-800/60"
                placeholder="New password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-white transition-colors"
                tabIndex="-1"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading || otp.length !== 6 || !newPassword}
            className={`w-full rounded-xl py-3.5 font-bold tracking-wide text-white transition-all overflow-hidden relative ${
              loading || otp.length !== 6 || !newPassword
                ? "cursor-not-allowed bg-indigo-500/50 shadow-none border border-indigo-500/20"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-[0_4px_20px_0_rgba(79,70,229,0.4)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)] border border-indigo-400/30"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToLogin}
            disabled={loading}
            className="text-sm font-medium text-slate-400 transition-colors hover:text-white hover:underline disabled:text-slate-600"
          >
            &larr; Back to Login
          </button>
          <button
            type="button"
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
