import { useState, useCallback, useEffect } from "react";
import { APP_TITLE, generateFood } from "../service/appSerivce";
import type { PlateData } from "../types/types";
import PlateChart from "../components/PlateChart";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, AlertCircle } from "lucide-react";
import { useTitle } from "../hooks/useTitle";
import Review from "../components/Review";
import useSaveManager from "../hooks/useSaveManager";

import HistoryContainer from "../components/HistoryContainter";

const KEY_HISTORY = "wb_history";

export function Home() {
  useTitle(APP_TITLE);
  const [userInput, setUserInput] = useState<string>("");
  const [plateData, setPlateData] = useState<PlateData | null>(null);
  const [plateHistory, setPlateHistory] = useState<PlateData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [errorInput, setErrorInput] = useState<string | null>(null);

  const { addToHistory, getHistory } = useSaveManager();

  useEffect(() => {
    const history = getHistory(KEY_HISTORY);
    setPlateHistory(history?.reverse());
  }, []);

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

      setUserInput("");
      setPlateData(data);
      addToHistory(KEY_HISTORY, data);
      setPlateHistory((prev) => [data, ...prev]);
    } catch (err: any) {
      const message =
        err?.response?.data?.error || "Произошла ошибка при генерации блюда.";
      setError(message);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [userInput]);

  const handleReset = () => {
    setPlateData(null);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-Zа-яА-Я ,]/g, "");
    setUserInput(value);
  };

  const handlePlateClick = (plate: PlateData) => {
    setPlateData(plate);
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader />;
    }
    if (error) {
      return (
        <motion.div
          key="error"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="relative z-10 w-full max-w-md mx-auto"
        >
          <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-3xl p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.1)]">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <h3 className="text-xl font-bold text-red-200 mb-2">
              Упс! Что-то пошло не так
            </h3>
            <p className="text-red-300/80 mb-6 leading-relaxed">{error}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              className="px-6 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-xl font-medium transition-colors duration-200 border border-red-500/30 w-full"
            >
              Попробовать снова
            </motion.button>
          </div>
        </motion.div>
      );
    }
    if (plateData) {
      return <PlateChart data={plateData} onReset={handleReset} />;
    }

    const isBlocked = isLoading || !userInput.trim();
    return (
      <div className="mt-20 space-y-40">
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
          <Review />
          <div
            className={`w-full max-w-lg relative p-6 md:p-8 bg-white/5 rounded-[50px] backdrop-blur-sm border border-white/10 transform-cpu 
        transition-all duration-1000  ${errorInput ? "h-63" : "h-55"}`}
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
                onChange={handleInputChange}
                placeholder="Например, огурцы, курица, бурый рис"
                className="focus:outline-none w-full p-4 border border-white/20 rounded-2xl focus:ring-1 focus:ring-lime-400 focus:border-lime-400 
              transition-shadow duration-200 resize-none bg-white/5 text-white placeholder-gray-500"
                disabled={isLoading}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleGenerate}
                disabled={isBlocked}
                className=" w-full mt-6 bg-lime-500 text-zinc-900 font-bold py-4 px-6 rounded-full hover:bg-lime-400 transition-all duration-300 transform focus:ring-2 focus:ring-offset-2 
              focus:ring-offset-zinc-900 focus:ring-lime-500 disabled:bg-zinc-600 disabled:text-zinc-400 disabled:shadow-none shadow-lg shadow-lime-500/20 group"
              >
                <div className="flex items-center justify-center relative">
                  Сгенерировать тарелку
                  {!isBlocked && (
                    <ArrowRight className="w-6 h-6 absolute right-20 group-hover:translate-x-20 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  )}
                </div>
              </motion.button>
              {errorInput && (
                <p className="text-red-400 mt-2 truncate">{errorInput}</p>
              )}
            </div>
          </div>
        </motion.div>
        <HistoryContainer
          plateHistory={plateHistory}
          handlePlateClick={handlePlateClick}
        />
      </div>
    );
  };

  return (
    <div className="">
      <div className="-z-1 animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] max-w-3xl h-[60vh] bg-linear-to-br from-green-500/30 via-yellow-500/5 to-orange-500/10 rounded-full filter blur-[120px] opacity-40"></div>

      <main className="w-full max-w-5xl mx-auto z-10 p-4 sm:p-6 md:p-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </main>
    </div>
  );
}
