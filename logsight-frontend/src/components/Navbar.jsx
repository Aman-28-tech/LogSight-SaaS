export default function Navbar({ logout }) {
  return (
    <div className="sticky top-0 z-50 mb-6 backdrop-blur-xl bg-white/5 border-b border-white/10 px-6 py-3 flex justify-between items-center">

      {/* LEFT */}
      <h1 className="text-2xl font-bold text-blue-400 tracking-wide">
        🚀 LogSight
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        {/* USER */}
        <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            U
          </div>
          <span>User</span>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="rounded-lg bg-red-500/80 px-4 py-2 text-sm font-semibold shadow-md transition-transform hover:scale-[1.02] hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
