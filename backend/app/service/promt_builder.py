def build_harvard_prompt(user_note: str = "") -> str:
    base = """
            Сгенерируй строго JSON по следующей структуре PlateData. Никаких пояснений вне JSON. 
            Строго соблюдай формат:

            {
                "summary": string,
                "totalCalories": number,
                "plate": [
                    {"name": "Белок", "items": [string], "value": number},
                    {"name": "Углеводы", "items": [string], "value": number},
                    {"name": "Овощи", "items": [string], "value": number}
                ],
                "ingredients": [string],
                "recipe": {
                    "steps": [string],
                    "quantities": {string: string},
                    "additional": [string]
                },
                "nutrients": {
                    "protein": number,
                    "fat": number,
                    "carbs": number,
                    "fiber": number
                },
                "recommendation": string
            }

            Жёсткие правила:
            1. В plate всегда ровно три категории: Белок, Углеводы, Овощи.
            2. НИ ОДИН items НЕ ДОЛЖЕН БЫТЬ ПУСТЫМ. Если в категории нет подходящих продуктов — перераспредели ингредиенты корректно.
            3. Пропорции: Белок 0.25, Углеводы 0.25, Овощи 0.5 (числа, а не дроби).
            4. ingredients — перечисли все продукты, использованные в тарелке.
            5. totalCalories — калории за 1 приём пищи.
            6. recipe — шаги приготовления + граммовки. additional — только соусы/специи/заправки.
            7. nutrients — белки, жиры, углеводы, клетчатка.
            8. recommendation — рекомендации по рациону согласно принципам Гарвардской тарелки.
            9. Строго JSON. Без ```json, без лишнего текста, без комментариев.

            Если ингредиентов мало, распределяй разумно:
            • если нет углеводов — используй овощи или нейтральный продукт как углеводы;
            • если только один продукт — раздели его условно на 3 категории.
        """

    if user_note.strip():
        base += f"\nИспользуй только следующие ингредиенты: {user_note}"

    return base


def build_harvard_image_prompt(plate_data: dict, user_note: str = "") -> str:
    """
    Формирует короткий промпт для генерации изображения блюда
    на основе структуры PlateData, без инструкций.
    """
    plate_items = plate_data.get("plate", [])
    plate_description = ", ".join(
        f"{item['name']} ({', '.join(item['items'])})" for item in plate_items
    )
    ingredients = ", ".join(plate_data.get("ingredients", []))

    prompt = f"Сделай изображение блюда с тарелкой: {plate_description}. Ингредиенты: {ingredients}. Реалистично, аппетитно."

    if user_note.strip():
        prompt += f" {user_note}"

    return prompt


# Функция для очистки пользовательского ввода от нежелательных символов
def clean_user_input(text: str) -> str:
    import re

    cleaned = re.sub(r"[^а-яА-Яa-zA-Z,\-\s]", "", text)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = re.sub(r",+", ",", cleaned)
    return cleaned


def contains_bad_words(text: str, blacklist=None) -> bool:
    if not blacklist:
        from app.core.config import FOOD_BLACK_LIST

        blacklist = FOOD_BLACK_LIST
    text_lower = text.lower()
    return any(word in text_lower for word in blacklist)
