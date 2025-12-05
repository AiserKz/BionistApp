import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function Review() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const shown = localStorage.getItem("wb_review_shown");
      if (!shown) {
        setIsOpen(true);
      }
    } catch (e) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = (persist = true) => {
    if (persist) {
      try {
        localStorage.setItem("wb_review_shown", "1");
      } catch (e) {}
    }
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => handleClose(true)}
          />

          <motion.div
            className="relative z-10 w-full max-w-2xl rounded-2xl bg-base-100 p-6 shadow-2xl border border-white/10"
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 10, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              aria-label="Закрыть"
              onClick={() => handleClose(true)}
              className="absolute top-4 right-4 btn btn-ghost btn-sm"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col gap-4">
              <h3 className="text-xl font-bold">Дорогой пользователь</h3>
              <p className="text-md text-base-content/70 leading-relaxed">
                Данный прототип - минимальная версия для демонстрации.
                Попробуйте сгенерировать вариант обеда с помощью Гарвардской
                тарелки и GigaChat. Введите предпочтения (например:{" "}
                <em>огурцы, курица, бурый рис</em>) и получите предложенную
                тарелку, список ингредиентов и совет по подаче.
              </p>

              <div className="rounded-lg bg-base-200 p-3 text-sm text-base-content/70">
                Пример ввода: <code>огурцы, курица, бурый рис</code>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleClose(true)}
                  className="btn rounded-box bg-lime-500 text-zinc-900 font-bold hover:scale-105 transition-all duration-300"
                >
                  Понятно
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
