from flask import Flask, jsonify
from flask_cors import CORS  # type: ignore
from app.routes.food import app_food

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


app.register_blueprint(app_food)


@app.route("/", methods=["GET", "POST"])
def index():
    return jsonify({"status": "Бэк работает!"})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True)
