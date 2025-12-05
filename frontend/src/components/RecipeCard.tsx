import { motion, type Variants } from "framer-motion";

interface Recipe {
  steps?: string[];
  quantities?: { [key: string]: string };
  additional?: string[];
}

interface Props {
  recipe?: Recipe;
  containerVariants?: Variants;
}

const stepVariants: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.26, ease: "easeOut" },
  }),
};

export default function RecipeCard({ recipe, containerVariants }: Props) {
  if (!recipe) {
    return (
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left h-full">
        <h3 className="font-bold text-lg text-gray-200 mb-3">Рецепт и шаги</h3>
        <p className="text-gray-400 text-sm">
          Инструкции по приготовлению отсутствуют.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-white/5 p-6 rounded-2xl border border-white/10 text-left"
    >
      <h3 className="font-bold text-lg text-gray-200 mb-3">Рецепт и шаги</h3>

      {recipe.steps && recipe.steps.length > 0 ? (
        <div className="space-y-3">
          {recipe.steps.map((step, idx) => (
            <motion.div
              key={idx}
              custom={idx}
              variants={stepVariants}
              className="flex items-start gap-4 p-3 rounded-xl bg-white/3 border border-white/6"
            >
              <div className="shrink-0">
                <div className="w-9 h-9 rounded-full bg-lime-500 flex items-center justify-center font-bold text-zinc-900">
                  {idx + 1}
                </div>
              </div>
              <div className="text-sm text-gray-200 leading-relaxed">
                {step}
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-sm">
          Инструкции по приготовлению отсутствуют.
        </p>
      )}

      {recipe.quantities && (
        <div className="mt-4">
          <h4 className="text-sm text-gray-200 font-semibold mb-2">
            Количество
          </h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-300">
            {Object.entries(recipe.quantities).map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-gray-300">{k}</span>
                <span className="text-gray-400">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {recipe.additional && recipe.additional.length > 0 && (
        <div className="mt-4 text-sm text-gray-300">
          <h4 className="font-semibold text-gray-200 mb-1">Дополнительно</h4>
          <p className="text-gray-400">{recipe.additional.join(", ")}</p>
        </div>
      )}
    </motion.div>
  );
}
