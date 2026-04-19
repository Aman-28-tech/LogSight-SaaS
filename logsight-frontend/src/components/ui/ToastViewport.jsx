function toastStyles(variant) {
  if (variant === "error") {
    return "border-red-400/30 bg-red-500/15 text-red-50";
  }

  if (variant === "warning") {
    return "border-amber-300/30 bg-amber-400/15 text-amber-50";
  }

  return "border-slate-300/20 bg-slate-400/15 text-slate-50";
}

export default function ToastViewport({ toasts, onDismiss }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[9999] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3 sm:right-6 sm:top-6">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto rounded-2xl border px-4 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.35)] backdrop-blur-xl transition-all duration-300 ${
            toast.exiting
              ? "translate-y-1 opacity-0"
              : "translate-y-0 opacity-100"
          } ${toastStyles(
            toast.variant
          )}`}
        >
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.message ? (
                <p className="mt-1 text-sm leading-5 text-current/80">
                  {toast.message}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="rounded-full px-2 py-1 text-xs font-medium text-current/70 transition hover:bg-black/10 hover:text-current"
            >
              Close
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
