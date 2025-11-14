import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const loadingTexts = [
  "Подбираем идеальные пропорции...",
  "Консультируемся с шеф-поваром...",
  "Считаем калории и нутриенты...",
  "Создаем кулинарный шедевр...",
  "Ищем самые свежие ингредиенты...",
];

const Loader: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
    }, 2000); // задержка

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-4 h-full min-h-[300px]">
      <div className="w-16 h-16 border-4 border-lime-400 border-t-transparent rounded-full animate-spin"></div>
      <div className="h-6 overflow-hidden mt-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="text-gray-400 text-center"
          >
            {loadingTexts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Loader;
