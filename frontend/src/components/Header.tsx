import { User2Icon } from "lucide-react";
import { motion } from "motion/react";
import { APP_TITLE } from "../service/appSerivce";

export function Header() {
  return (
    <header className="flex justify-between items-center my-12">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-3 cursor-default"
      >
        <div className="w-11 h-10 ">
          <img src="/favicon3.png" className="select-none" draggable="false" />
        </div>
        <span className="font-bold text-xl text-gray-200">{APP_TITLE}</span>
      </motion.div>
      <motion.button
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-10 h-10 rounded-full hover:ring-2 hover:ring-amber-400 bg-amber-400/20 flex items-center justify-center 
            hover:bg-amber-400/30 transition-all border border-amber-400/30 duration-300"
      >
        <User2Icon />
      </motion.button>
    </header>
  );
}
