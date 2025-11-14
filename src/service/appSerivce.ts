import type { PlateData } from "../types/types";

//  НАЧАЛО: Логика с моковыми данными

export const generateHealthyPlate = async (
  userInput: string
): Promise<PlateData> => {
  console.log(
    "Демонстрационный режим: используются шаблонные данные для запроса:",
    userInput
  );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Шаблонные данные
  const mockData: PlateData = {
    summary:
      "Вот пример идеально сбалансированной и аппетитной тарелки для вашего вдохновения.",
    totalCalories: 580,
    plate: [
      {
        name: "Овощи",
        items: ["Брокколи на пару", "Листья салата", "Томаты черри"],
        value: 30,
      },
      {
        name: "Фрукты",
        items: ["Нарезанное яблоко", "Горсть ягод"],
        value: 20,
      },
      { name: "Цельнозерновые", items: ["Отварная киноа"], value: 25 },
      { name: "Белок", items: ["Запеченная куриная грудка"], value: 25 },
    ],

    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=1780&auto=format&fit=crop",
    recommendation:
      "Этот прием пищи богат клетчаткой и белком, что способствует долгому чувству сытости. Соотношение нутриентов идеально для поддержания энергии в течение дня.",
    ingredients: [
      "Брокколи на пару",
      "Листья салата",
      "Томаты черри",
      "Нарезанное яблоко",
      "Горсть ягод",
      "Отварная киноа",
      "Запеченная куриная грудка",
    ],
  };

  // throw new Error("ошибка сети.");

  return mockData;
};

// КОНЕЦ моковых логик ---
