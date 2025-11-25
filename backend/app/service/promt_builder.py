def build_harvard_prompt(user_note: str = "") -> str:
    base = """
            Сгенерируй JSON строго по следующей структуре PlateData, и не добавляй лишнего текста!:
            {
                "summary": string,
                "totalCalories": number,
                "plate": [
                    {"name": string, "items": [string], "value": number},
                    {"name": string, "items": [string], "value": number},
                    {"name": string, "items": [string], "value": number}
                "recommendation": sting,
                "ingredients": [string]
            }

            Где:
            - Обязательно включи все поля: summary, totalCalories, plate (3 части), recommendation, ingredients. Ничего кроме JSON..
        """

    if user_note.strip():
        base += f"Вот пользователский пожелание учти их обязательно! {user_note}"

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
