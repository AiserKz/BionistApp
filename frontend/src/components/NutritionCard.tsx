import { motion } from "framer-motion";

interface Props {
  totalCalories?: number | null;
  nutrients?: { [key: string]: number } | null;
  ingredients?: string[];
}

const translateKey = (s: string) => {
  const key = s.toLowerCase();
  switch (key) {
    case "carbs":
    case "carbohydrates":
    case "углеводы":
      return "Углеводы";
    case "fat":
    case "жиры":
      return "Жиры";
    case "fiber":
    case "клетчатка":
      return "Клетчатка";
    case "protein":
    case "белки":
      return "Белки";
    default:
      return s.charAt(0).toUpperCase() + s.slice(1);
  }
};

export default function NutritionCard({
  totalCalories,
  nutrients,
  ingredients,
}: Props) {
  return (
    <motion.div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left h-full">
      <h3 className="font-bold text-lg text-gray-200 mb-3">Пищевая ценность</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="text-sm text-gray-300">
          <div className="mb-3">
            <span className="text-gray-400">Калории</span>
            <div className="text-lg font-semibold text-gray-100">
              {totalCalories ?? "—"} kcal
            </div>
          </div>

          {nutrients && (
            <ul className="space-y-2">
              {Object.entries(nutrients).map(([k, v]) => (
                <li
                  key={k}
                  className="flex justify-between text-sm text-gray-300"
                >
                  <span className="">{translateKey(k)}</span>
                  <span className="font-medium text-gray-100">{v}г</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="text-sm text-gray-300">
          <h4 className="text-gray-200 font-semibold mb-2">Ингредиенты</h4>
          <ul className="list-disc list-inside text-gray-300 max-h-48 overflow-auto">
            {ingredients?.map((ing, i) => (
              <li key={i} className="text-sm">
                {ing}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
