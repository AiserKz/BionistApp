import { motion } from "framer-motion";

interface OrganicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export function OrganicButton({
  children,
  onClick,
  className = "",
  disabled = false,
}: OrganicButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`btn btn-lg w-full p-7 bg-(--color-sage-green) border-b-4 shadow-lg text-base-content/75 hover:shadow-xl font-bold ${className} transition-all ${
        disabled ? "opacity-60 pointer-events-none" : ""
      }`}
      style={{
        borderRadius: "40% 60% 60% 40% / 60% 40% 60% 40%",
      }}
    >
      {children}
    </motion.button>
  );
}
