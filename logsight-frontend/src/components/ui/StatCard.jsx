import Panel from "./Panel";

export default function StatCard({ label, value, valueClassName = "", icon: Icon, colorClass = "blue" }) {
  const colors = {
    blue: "from-blue-500/20 to-transparent text-blue-400 border-blue-500/20",
    red: "from-red-500/20 to-transparent text-red-400 border-red-500/20",
    violet: "from-violet-500/20 to-transparent text-violet-400 border-violet-500/20",
    amber: "from-amber-500/20 to-transparent text-amber-400 border-amber-500/20",
  };

  const selectedColor = colors[colorClass] || colors.blue;

  return (
    <div className="group relative overflow-hidden rounded-2xl transition-all duration-300 hover:translate-y--1">
      <Panel className={`glass-premium h-full p-6 ${selectedColor.split(" ")[2]}`}>
        <div className={`absolute inset-0 bg-gradient-to-br ${selectedColor.split(" ")[0]} ${selectedColor.split(" ")[1]} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
        
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-400 transition-colors">
              {label}
            </p>
            <h2 className={`mt-3 text-3xl font-black tracking-tight sm:text-4xl ${valueClassName}`}>
              {value}
            </h2>
          </div>
          {Icon && (
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950/50 ${selectedColor.split(" ")[2]} shadow-inner`}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        
        {/* Decorative corner element */}
        <div className={`absolute -bottom-6 -right-6 h-12 w-12 rounded-full opacity-10 blur-xl ${selectedColor.split(" ")[2].replace("text", "bg")}`} />
      </Panel>
    </div>
  );
}
