import { useState, useCallback } from "react";
import { generateFood } from "../service/appSerivce";
import type { PlateData } from "../types/types";
import PlateChart from "../components/PlateChart";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTitle } from "../hooks/useTitle";

export function Home() {
  useTitle("Баланист");
  const [userInput, setUserInput] = useState<string>("");
  const [plateData, setPlateData] = useState<PlateData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorInput, setErrorInput] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!userInput.trim()) {
      setErrorInput("Пожалуйста, укажите ваши предпочтения или калории.");
      console.error("Пожалуйста, укажите ваши предпочтения или калории.");
      return;
    }
    setErrorInput(null);
    setIsLoading(true);
    setError(null);
    setPlateData(null);
    try {
      const data = await generateFood(userInput);
      console.log(data);
      setPlateData(data);
    } catch (err) {
      setError(
        "Не удалось сгенерировать тарелку. Пожалуйста, попробуйте еще раз."
      );
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const handleReset = () => {
    setPlateData(null);
    setUserInput("");
    setError(null);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="text-center text-red-400 z-10"
        >
          <p>{error}</p>
          <button
            onClick={handleReset}
            className="mt-4 text-lime-400 underline cursor-pointer"
          >
            Попробовать снова
          </button>
        </motion.div>
      );
    }
    if (plateData) {
      return <PlateChart data={plateData} onReset={handleReset} />;
    }
    return (
      <motion.div
        key="initial-form"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center flex flex-col items-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-100 mb-4 leading-tight">
          Сбалансируйте свой рацион
        </h1>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          Создайте свою персональную тарелку здорового питания на основе ваших
          предпочтений.
        </p>

        <div
          className={`w-full max-w-lg relative p-6 md:p-8 bg-white/5 rounded-[50px] backdrop-blur-sm border border-white/10 transform-cpu 
        hover:border-lime-200/30 transition-all duration-1000 shadow-2xl hover:shadow-lime-400/10  ${
          errorInput ? "h-63" : "h-55"
        }`}
        >
          <div className="relative z-10">
            <label
              htmlFor="preferences"
              className="block text-sm font-medium text-gray-400 mb-2 text-left truncate"
            >
              Укажите ваши предпочтения или калории
            </label>
            <input
              id="preferences"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Например: 1800 ккал, больше белка"
              className="w-full p-4 border border-white/20 rounded-2xl focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-shadow duration-200 resize-none shadow-inner bg-white/5 text-white placeholder-gray-500"
              disabled={isLoading}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleGenerate}
              disabled={isLoading || !userInput.trim()}
              className="w-full mt-6 bg-lime-500 text-zinc-900 font-bold py-4 px-6 rounded-full hover:bg-lime-400 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-offset-zinc-900 focus:ring-lime-500 disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none shadow-lg shadow-lime-500/20 group"
            >
              <div className="flex items-center justify-center relative">
                Сгенерировать тарелку
                <ArrowRight className="w-6 h-6 absolute right-20 group-hover:translate-x-20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
              </div>
            </motion.button>
            {errorInput && (
              <p className="text-red-400 mt-2 truncate">{errorInput}</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="">
      <div className="z-0 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-3xl h-[60vh] bg-linear-to-br from-green-500/30 via-yellow-500/5 to-orange-500/10 rounded-full filter blur-[120px] opacity-40"></div>

      <main className="w-full max-w-5xl mx-auto z-10 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>
    </div>
  );
}
