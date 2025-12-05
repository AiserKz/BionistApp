from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
import os, re, json, base64, uuid
from app.service.promt_builder import build_harvard_image_prompt


class GigaChatService:
    # Инициализация сервиса credentials - ключи, images_dir - папка для сохранения картинок, model - модель ИИ
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
        response = self.giga.chat(payload)
        if not response.choices or not response.choices[0].message.content:
            return {"error": "Пустой ответ от модели"}
        return response.choices[0].message.content

    # Парсить json с ответа ИИ с помощью регулярных выражений
    @staticmethod
    def parsing_content(data) -> dict:
        # Убираем блоки ```
        cleaned = re.sub(r"^```(?:json)?\s*", "", data)
        cleaned = re.sub(r"```$", "", cleaned).strip()

        # Если есть остатки HTML или тэгов
        if "/>" in cleaned:
            cleaned = cleaned.split("/>", 1)[-1].strip()

        # Заменяем дроби 1/4, 1/2 и т.п. на десятичные
        def fraction_to_float(match):
            num, denom = match.group(1), match.group(2)
            return str(float(num) / float(denom))

        cleaned = re.sub(r"\b(\d+)\s*/\s*(\d+)\b", fraction_to_float, cleaned)

        # Обрезаем все символы после последней закрывающей фигурной скобки
        last_brace = cleaned.rfind("}")
        if last_brace != -1:
            cleaned = cleaned[: last_brace + 1]

        # Попытка распарсить
        try:
            json_data = json.loads(cleaned)
        except json.JSONDecodeError as e:
            raise ValueError(f"Не удалось распарсить JSON: {cleaned}") from e

        return json_data

    # Парсит image_id из тега <img>
    @staticmethod
    def get_image_id(data) -> str:
        img_match = re.search(r'<img\s+src="([^"]+)"', data)
        if img_match:
            image_id = img_match.group(1)
        else:
            raise ValueError(f"Не найден image_id в <img> теге: {data}")
        return image_id

    # Сохранение изображения после получение в base64
    def get_image_bytes(self, image_id: str) -> bytes:
        img_response = self.giga.get_image(image_id)
        if not img_response.content:
            raise ValueError("Не удалось получить изображение")
        return base64.b64decode(img_response.content)

    # Сохранение изображения в локальном репозиторий
    def save_image(self, img_bytes: bytes) -> str:
        filename = f"{uuid.uuid4().hex}.png"
        path_to_save = os.path.join(self.images_dir, filename)
        with open(path_to_save, "wb") as f:
            f.write(img_bytes)
        return filename

    # Новая версия генераций
    def generate_v2(self, prompt: str, flask_url_for):
        text = self.chat(prompt)
        print(f"Получил в ответ от модели {text}")
        data = self.parsing_content(text)
        promt_image = build_harvard_image_prompt(data)
        img_name = self.generate_image(promt_image)
        data["image_url"] = flask_url_for(
            "static", filename=f"images/{img_name}", _external=False
        )
        return data

    # Генерация изображения который вернут сразу путь к изображению
    def generate_image(self, promt: str):
        content = self.chat(promt)
        image_id = self.get_image_id(content)
        img_bytes = self.get_image_bytes(image_id)
        filename = self.save_image(img_bytes)
        return filename
