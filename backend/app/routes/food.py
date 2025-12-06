from flask import Blueprint, request, jsonify, url_for
from app.service.gigachat_service import GigaChatService
from app.core.config import GIGACHAT_CREDENTIALS
from app.service.promt_builder import (
    build_harvard_prompt,
    clean_user_input,
    contains_bad_words,
)
import os
from app.service.log_service import PromptLogger

app_food = Blueprint("food", __name__, url_prefix="/food")
IMAGES_DIR = os.path.join("static", "images")
giga_service = GigaChatService(GIGACHAT_CREDENTIALS, IMAGES_DIR)

logger = PromptLogger()


@app_food.route("/generate", methods=["POST"])
def food_generate():
    try:
        data = request.get_json(
            force=True
        )  # force=True на случай Content-Type != application/json
    except Exception:
        return jsonify({"error": "Невалидный JSON"}), 400

    if not data:
        return jsonify({"error": "Пустой запрос"}), 400

    user_note = data.get("user_text", "")
    if not isinstance(user_note, str) or not user_note.strip():
        return jsonify({"error": "Пустая инструкция"}), 400

    user_note = clean_user_input(user_note)
    if not user_note:
        return jsonify({"error": "Пустая инструкция после очистки"}), 400

    if contains_bad_words(user_note):
        return jsonify({"error": "Инструкция содержит запрещенные слова"}), 400

    prompt = build_harvard_prompt(user_note)

    # Логируем запрос
    logger.log(
        user_note,
        extra_info=f"IP: {request.remote_addr}, User-Agent: {str(request.user_agent)[:50]}",
    )

    try:
        result = giga_service.generate_v2(prompt, flask_url_for=url_for)
        if not result:
            return jsonify({"error": "Пустой результат от сервиса"}), 500
        return jsonify(result), 200
    except Exception as e:
        # Логируем ошибку для сервера
        print("Ошибка при генерации:", e)
        return jsonify({"error": "Ошибка генерации", "details": str(e)}), 500
