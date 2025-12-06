from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
import os, re, json, base64, uuid
from app.service.promt_builder import build_harvard_image_prompt


class GigaChatService:
    # Инициализация сервиса
    def __init__(self, credentials, images_dir, model="GigaChat-2"):
        self.giga = GigaChat(
            credentials=credentials, verify_ssl_certs=False, timeout=60
        )
        self.model = model
        self.images_dir = images_dir
        os.makedirs(self.images_dir, exist_ok=True)

    # Формирование payload запроса
    def build_payload(self, prompt, temperature=0.8, max_tokens=600):
        return Chat(
            messages=[Messages(role=MessagesRole.USER, content=prompt)],
            temperature=temperature,
            max_tokens=max_tokens,
            function_call="auto",
            model=self.model,
        )

    # Отправка запроса в ИИ
    def chat(self, prompt):
        payload = self.build_payload(prompt)
        try:
            response = self.giga.chat(payload)
        except Exception as e:
            return {"error": f"Ошибка запроса к GigaChat: {str(e)}"}

        if not response or not hasattr(response, "choices") or not response.choices:
            return {"error": "Пустой ответ от модели"}

        content = response.choices[0].message.content
        if not content:
            return {"error": "Пустой контент от модели"}

        return content

    # Парсинг JSON из ответа ИИ
    @staticmethod
    def parsing_content(data) -> dict:
        if not isinstance(data, str):
            return {}

        # Убираем блоки ```
        cleaned = re.sub(r"^```(?:json)?\s*", "", data)
        cleaned = re.sub(r"```$", "", cleaned).strip()

        # Убираем HTML остатки
        if "/>" in cleaned:
            cleaned = cleaned.split("/>", 1)[-1].strip()

        # Убираем комментарии вида // или /* */
        cleaned = re.sub(r"//.*?$", "", cleaned, flags=re.MULTILINE)
        cleaned = re.sub(r"/\*.*?\*/", "", cleaned, flags=re.DOTALL)

        # Заменяем дроби 1/2, 1/4 на десятичные
        def fraction_to_float(match):
            num, denom = match.group(1), match.group(2)
            return str(float(num) / float(denom))

        cleaned = re.sub(r"\b(\d+)\s*/\s*(\d+)\b", fraction_to_float, cleaned)

        # Обрезаем все символы после последней закрывающей скобки
        last_brace = cleaned.rfind("}")
        if last_brace != -1:
            cleaned = cleaned[: last_brace + 1]

        try:
            json_data = json.loads(cleaned)
        except json.JSONDecodeError:
            json_data = {}

        return json_data

    # Получение image_id из тега <img>
    @staticmethod
    def get_image_id(data) -> str:
        if not isinstance(data, str):
            raise ValueError("Неверный формат данных для поиска image_id")

        img_match = re.search(r'<img\s+src="([^"]+)"', data)
        if img_match:
            return img_match.group(1)
        raise ValueError(f"Не найден image_id в <img> теге: {data}")

    # Получение изображения в байтах
    def get_image_bytes(self, image_id: str) -> bytes:
        try:
            img_response = self.giga.get_image(image_id)
        except Exception as e:
            raise ValueError(f"Ошибка получения изображения: {str(e)}")

        if not img_response or not getattr(img_response, "content", None):
            raise ValueError("Не удалось получить изображение")
        return base64.b64decode(img_response.content)

    # Сохранение изображения
    def save_image(self, img_bytes: bytes) -> str:
        filename = f"{uuid.uuid4().hex}.png"
        path_to_save = os.path.join(self.images_dir, filename)
        try:
            with open(path_to_save, "wb") as f:
                f.write(img_bytes)
        except Exception as e:
            raise ValueError(f"Ошибка сохранения изображения: {str(e)}")
        return filename

    # Генерация изображения (возврат имени файла)
    def generate_image(self, prompt: str):
        content = self.chat(prompt)
        if isinstance(content, dict) and "error" in content:
            raise ValueError(f"Ошибка генерации изображения: {content['error']}")

        print(f"Запрос на генерацию изображения: {content}")
        image_id = self.get_image_id(content)
        img_bytes = self.get_image_bytes(image_id)

        filename = self.save_image(img_bytes)
        return filename

    # Новая версия генераций с обработкой ошибок
    def generate_v2(self, prompt: str, flask_url_for):
        try:
            text = self.chat(prompt)
            print(text)
            if isinstance(text, dict) and "error" in text:
                return text

            data = self.parsing_content(text)
            promt_image = build_harvard_image_prompt(data)

            img_name = self.generate_image(promt_image)
            data["image_url"] = flask_url_for(
                "static", filename=f"images/{img_name}", _external=False
            )
            return data

        except Exception as e:
            return {"error": f"Ошибка генерации: {str(e)}"}
