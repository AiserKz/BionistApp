def build_harvard_prompt(user_note: str = "") -> str:
    """Формирует промпт, соответствующий принципам Harvard Healthy Eating Plate."""
    # base = (
    #     "Создай изображение, соответствующее принципам 'Гарвардской тарелки здорового питания': "
    #     "половина тарелки — овощи и фрукты, четверть — цельнозерновые продукты, четверть — полезный белок (например, рыба, бобы, тофу). "
    #     "Рядом стакан воды. Фон чистый, освещение яркое, стиль — реалистичная еда на белой тарелке. "
    # )
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
            - Обязательно включи все поля: summary, totalCalories, plate (3 части), imageId, recommendation, ingredients. Ничего кроме JSON..
            - нужно сгенерировать изображение, соответствующее принципам 'Гарвардской тарелки здорового питания':
                
            """
    if user_note.strip():
        base += f"Если есть пользовательские пожелания, учти их: {user_note}"
    return base
