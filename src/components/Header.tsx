import { User2Icon } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  return (
    <header
      id="header"
      className="flex items-center justify-between px-4 sm:px-10 py-4 z-10 bg-base-100/80 backdrop-blur-2xl rounded-4xl md:w-full mx-2 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4 cursor-pointer"
      >
        <div className="w-12 h-10 ">
          <img src="/favicon3.png" className="select-none" draggable="false" />
        </div>
        <h2 className="text-2xl opacity-80 text-emerald-800">Баланист</h2>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-4"
      >
        <div className="avatar">
          <div className="hover:scale-110 cursor-pointer w-10 rounded-full bg-linear-50 from-orange-400 to-emerald-600 items-center justify-center flex hover:ring-2 hover:ring-emerald-600 transition-all duration-300">
            <User2Icon className="w-8 h-8 text-white" />
          </div>
        </div>
      </motion.div>
    </header>
  );
}
