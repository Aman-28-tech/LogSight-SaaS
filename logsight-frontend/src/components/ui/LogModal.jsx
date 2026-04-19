import { motion, AnimatePresence } from "framer-motion";

export default function LogModal({ log, isOpen, onClose }) {
  if (!isOpen || !log) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            <h3 className="text-lg font-semibold text-white">Log Details</h3>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-6">
            <pre className="rounded-xl bg-slate-950/50 p-4 text-sm text-slate-300 overflow-x-auto border border-white/5">
              <code>
                {JSON.stringify(
                  (() => {
                    const { _id, user, updatedAt, __v, ...safeLog } = log;
                    return safeLog;
                  })(),
                  null,
                  2
                )}
              </code>
            </pre>
          </div>
          <div className="border-t border-white/10 bg-white/5 px-6 py-4 text-right">
            <button
              onClick={onClose}
              className="rounded-lg bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/20"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
