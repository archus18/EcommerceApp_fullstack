import { createContext, useContext, useCallback, useMemo, useState } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback(
    (type, message, duration = 2500) => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), duration);
    },
    [remove]
  );

  const toast = useMemo(
    () => ({
      success: (msg) => show("success", msg),
      error: (msg) => show("error", msg),
      info: (msg) => show("info", msg),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      <div className="fixed top-5 right-5 z-[9999] space-y-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`min-w-[260px] max-w-[320px] rounded-2xl px-4 py-3 shadow-xl border text-sm font-medium
            ${
              t.type === "success"
                ? "bg-white border-green-200 text-green-700"
                : t.type === "error"
                ? "bg-white border-red-200 text-red-700"
                : "bg-white border-gray-200 text-gray-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
