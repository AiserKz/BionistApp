import { BASE_URL } from "../service/appSerivce";
import type { PlateData } from "../types/types";
import { Button } from "./ui/Button";
import { motion } from "framer-motion";

export default function HistoryContainer({
  plateHistory,
  handlePlateClick,
  className,
}: {
  plateHistory: PlateData[];
  handlePlateClick: (plate: PlateData) => void;
  className?: string;
}) {
  if (plateHistory.length === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ amount: 0.15 }}
      className={`mt-8 flex flex-col items-center ${className}`}
    >
      <h2 className="mb-10 text-2xl font-bold">История тарелок</h2>
      <div className="overflow-y-auto max-h-200 w-full hide-scrollbar space-y-3">
        {plateHistory.map((plate, index) => (
          <div
            key={index}
            className="w-full bg-black/30 p-6 rounded-2xl border border-white/20 flex justify-between items-center"
          >
            <div className="flex items-center gap-4 justify-start">
              <img
                src={BASE_URL + plate.image_url}
                alt={`Тарелка ${index + 1}`}
                className="w-16 h-16 rounded-box"
              />
              <div className="mr-4 overflow-hidden">
                <h3 className="text-lg font-semibold text-gray-200 truncate">
                  {plate.summary}
                </h3>
                <p className="text-gray-400">Тарелка #{index + 1}</p>
              </div>
            </div>
            <Button
              onClick={() => handlePlateClick(plate)}
              className="btn btn-lg bg-lime-500 text-zinc-900 font-bold rounded-full hover:bg-lime-400 transition-all duration-300 
                  shadow-[0_0_20px] hover:shadow-lime-500/30
                "
            >
              Посмотреть
            </Button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
