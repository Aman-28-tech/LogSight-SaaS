import { motion } from "framer-motion";
import { useState } from "react";

export default function AuthForm({
  isLogin,
  setIsLogin,
  email,
  setEmail,
  password,
  setPassword,
  handleAuth,
  handleGithubAuth,
  loading,
  errorMsg,
  onForgotPassword,
}) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex items-center justify-center px-4 pb-10 pt-20 sm:px-6 sm:pb-16 sm:pt-24 min-h-[calc(100vh-130px)]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md rounded-3xl glass p-10 shadow-2xl ring-1 ring-white/10"
      >
        <h2 className="mb-8 text-center text-3xl font-extrabold tracking-tight text-white drop-shadow-sm">
          {isLogin ? "Log in" : "Create Account"}
        </h2>

        {/* EMAIL & PASSWORD FORM */}
        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Email Address</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-3.5 text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-indigo-500 focus:bg-slate-900/80 focus:ring-2 focus:ring-indigo-500/50 hover:bg-slate-800/60"
              placeholder="you@example.com"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              {isLogin && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-white/10 bg-slate-900/50 p-3.5 pr-12 text-white outline-none backdrop-blur-md transition-all duration-300 focus:border-indigo-500 focus:bg-slate-900/80 focus:ring-2 focus:ring-indigo-500/50 hover:bg-slate-800/60"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 px-4 flex items-center text-slate-400 hover:text-white transition-colors"
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

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className={`mt-6 w-full rounded-xl py-3.5 font-bold tracking-wide text-white transition-all overflow-hidden relative ${
              loading
                ? "cursor-not-allowed bg-indigo-500/50 shadow-none border border-indigo-500/20"
                : "bg-gradient-to-r from-indigo-600 to-blue-600 shadow-[0_4px_20px_0_rgba(79,70,229,0.4)] hover:shadow-[0_8px_25px_rgba(79,70,229,0.5)] border border-indigo-400/30"
            }`}
          >
            {loading ? (
               <span className="flex items-center justify-center gap-2">
                 <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                 Running...
                 <div className="absolute inset-0 bg-white/20 animate-pulse rounded-xl" />
               </span>
            ) : isLogin ? (
              "Sign in to LogSight"
            ) : (
              "Register Account"
            )}
          </motion.button>
        </form>

        <div className="mt-5 flex items-center justify-center space-x-4">
             <div className="h-px bg-white/10 w-full"></div>
             <span className="text-xs text-slate-500 uppercase font-semibold tracking-wider">or</span>
             <div className="h-px bg-white/10 w-full"></div>
          </div>

          {/* GITHUB OAUTH BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={handleGithubAuth}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 rounded-xl py-3 font-semibold tracking-wide text-white transition-all overflow-hidden relative ${
              loading
                ? "cursor-not-allowed bg-slate-800/80 shadow-none border border-slate-700/50"
                : "bg-[#24292e] shadow-[0_4px_14px_0_rgba(0,0,0,0.39)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] border border-slate-700/50 hover:bg-[#2f363d]"
            }`}
          >
            <svg height="22" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="22" fill="currentColor">
               <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
            Continue with GitHub
          </motion.button>

        {/* ERROR / SUCCESS MESSAGE */}
        {errorMsg && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-center text-sm font-medium text-red-400 backdrop-blur-md"
          >
            {errorMsg}
          </motion.p>
        )}

        {/* SWITCH */}
        <p className="mt-8 text-center text-sm font-medium text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="cursor-pointer text-indigo-400 font-semibold transition-colors hover:text-indigo-300 hover:underline"
          >
            {isLogin ? "Sign up" : "Log in now"}
          </span>
        </p>
      </motion.div>
    </div>
  );
}
