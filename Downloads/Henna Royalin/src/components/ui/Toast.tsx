import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (type: Toast["type"], message: string) => void;
  removeToast: (id: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (type: Toast["type"], message: string) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, message }]);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>.");
  }
  const { toasts, addToast, removeToast } = ctx;
  return { toasts, addToast, removeToast };
}

// ─── Toast item ──────────────────────────────────────────────────────────────

const toastConfig: Record<
  Toast["type"],
  { Icon: React.ElementType; border: string; iconColor: string; bg: string }
> = {
  success: {
    Icon: CheckCircle2,
    border: "border-l-[#16a34a]",
    iconColor: "text-[#16a34a]",
    bg: "bg-white",
  },
  error: {
    Icon: AlertCircle,
    border: "border-l-[#dc2626]",
    iconColor: "text-[#dc2626]",
    bg: "bg-white",
  },
  warning: {
    Icon: AlertTriangle,
    border: "border-l-[#d97706]",
    iconColor: "text-[#d97706]",
    bg: "bg-white",
  },
  info: {
    Icon: Info,
    border: "border-l-[#2563eb]",
    iconColor: "text-[#2563eb]",
    bg: "bg-white",
  },
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { Icon, border, iconColor, bg } = toastConfig[toast.type];

  // Slide in
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-dismiss after 4 s
  useEffect(() => {
    timerRef.current = setTimeout(() => handleClose(), 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(() => onRemove(toast.id), 280);
  }

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 w-80 px-4 py-3
        ${bg} rounded-[10px] border border-[#E8E0D4] border-l-4 ${border}
        shadow-lg
        transition-all duration-280 ease-out
        ${visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"}
      `}
      style={{ transitionDuration: "280ms" }}
    >
      <Icon size={18} className={`shrink-0 mt-0.5 ${iconColor}`} />
      <p className="flex-1 text-sm font-medium text-[#24201D] leading-snug font-sans">
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        className="shrink-0 mt-0.5 text-[#7A6B5D] hover:text-[#24201D] transition-colors"
        aria-label="Dismiss notification"
      >
        <X size={15} />
      </button>
    </div>
  );
}

// ─── Container ───────────────────────────────────────────────────────────────

export function ToastContainer() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;
  const { toasts, removeToast } = ctx;

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed top-5 right-5 z-9999 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
}

export default ToastProvider;
