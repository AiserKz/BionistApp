from gigachat import GigaChat
from gigachat.models import Chat, Messages, MessagesRole
import os, re, json, base64, uuid


class GigaChatService:
    def __init__(self, credentials, images_dir, model="GigaChat-2"):
        self.giga = GigaChat(credentials=credentials, verify_ssl_certs=False)
        self.model = model
        self.images_dir = images_dir
        os.makedirs(self.images_dir, exist_ok=True)

    def build_payload(self, prompt, temperature=0.8, max_tokens=400):
        return Chat(
            messages=[Messages(role=MessagesRole.USER, content=prompt)],
            temperature=temperature,
            max_tokens=max_tokens,
            function_call="auto",
            model=self.model,
        )

    def chat(self, prompt):
        payload = self.build_payload(prompt)
        response = self.giga.chat(payload)
        if not response.choices or not response.choices[0].message.content:
            return {"error": "Пустой ответ от модели"}
        return response.choices[0].message.content

    @staticmethod
    def parsing_content(data) -> dict:
        img_match = re.search(r'<img\s+src="([^"]+)"', data)
        if img_match:
            image_id = img_match.group(1)
        else:
            raise ValueError("Не найден image_id в <img>")

        json_part = data.split("/>", 1)[-1].strip()

        try:
            json_data = json.loads(json_part)
        except json.JSONDecodeError as e:
            raise ValueError("Не удалось распарсить JSON") from e

        json_data["image_id"] = image_id
        return json_data

    def get_image_bytes(self, image_id: str) -> bytes:
        img_response = self.giga.get_image(image_id)
        if not img_response.content:
            raise ValueError("Не удалось получить изображение")
        return base64.b64decode(img_response.content)

    def save_image(self, img_bytes: bytes) -> str:
        filename = f"{uuid.uuid4().hex}.png"
        path_to_save = os.path.join(self.images_dir, filename)
        with open(path_to_save, "wb") as f:
            f.write(img_bytes)
        return filename

    def generate(self, prompt: str, flask_url_for):
        """Полный пайплайн: чат → парсинг → сохранение → формирование URL"""
        content = self.chat(prompt)
        data = self.parsing_content(content)
        img_bytes = self.get_image_bytes(data["image_id"])
        filename = self.save_image(img_bytes)
        data["image_url"] = flask_url_for(
            "static", filename=f"images/{filename}", _external=False
        )
        return data
