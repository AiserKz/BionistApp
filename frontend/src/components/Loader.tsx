import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

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
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center space-y-6 h-full min-h-[300px] w-full">
      <div className="relative">
        <motion.div
          className="absolute inset-0 bg-lime-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Animated Leaf */}
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Leaf className="w-16 h-16 text-lime-400 drop-shadow-[0_0_15px_rgba(163,230,53,0.5)]" />
        </motion.div>
      </div>

      <div className="h-8 w-full  overflow-hidd relative max-w-md flex justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -20, opacity: 0, filter: "blur(5px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-gray-300 text-lg font-medium text-center absolute w-full truncate"
          >
            {loadingTexts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Loader;
