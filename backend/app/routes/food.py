from flask import Blueprint
from flask import request, jsonify, url_for
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
    data = request.get_json()
    if not data:
        return jsonify({"error": "Пустое запрос"}), 400

    user_note = data.get("user_text", "").strip()

    if not user_note:
        return jsonify({"error": "Пустая инструкция"}), 400

    user_note = clean_user_input(user_note)

    if not user_note:
        return jsonify({"error": "Пустая инструкция"}), 400

    if contains_bad_words(user_note):
        return jsonify({"error": "Инструкция содержит запрещенные слова"}), 400

    prompt = build_harvard_prompt(user_note)

    logger.log(
        user_note,
        extra_info=f"IP: {request.remote_addr}, User-Agent: {request.user_agent.string[:50]}"
    )

    try:
        result = giga_service.generate_v2(prompt, flask_url_for=url_for)
        return jsonify(result), 200
    except Exception as e:
        print("Ошибка при генераций: ", e)
        return jsonify({"error": "Ошибка генерации", "details": str(e)}), 500
