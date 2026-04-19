export default function Panel({ className = "", children }) {
  return (
    <div
      className={`glass group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 shadow-[0_20px_50px_rgba(0,0,0,0.3)] transition-all duration-300 ${className}`.trim()}
    >
      {/* Subtle Inner Glow */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="relative z-10 h-full w-full">
        {children}
      </div>
    </div>
  );
}
