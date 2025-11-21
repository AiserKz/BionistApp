import { motion } from "framer-motion";

interface OrganicInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function OrganicInput({
  label,
  placeholder,
  value,
  onChange,
}: OrganicInputProps) {
  return (
    <motion.div
      className="p-8 border w-full border-orange-400 transition-all duration-300 shadow-xl"
      style={{
        borderRadius: value
          ? "70% 30% 30% 70% / 70% 40% 60% 30%"
          : "30% 70% 70% 30% / 30% 60% 40% 70%",
      }}
      whileHover={{
        borderRadius: "70% 30% 30% 70% / 70% 40% 60% 30%",
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text **:font-medium">{label}</span>
        </div>
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input w-full rounded-full border-2 border-black/45 focus:outline-none focus:ring-2 transition-all duration-200 shadow-sm hover:shadow-md focus:shadow-lg"
        />
      </label>
    </motion.div>
  );
}
