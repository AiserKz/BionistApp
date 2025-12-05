import dotenv, os

dotenv.load_dotenv()


GIGACHAT_CREDENTIALS = os.environ.get("GIGACHAT_CREDENTIALS")
STABILITY_API_KEY = os.environ.get("STABILITY_API_KEY")
HUGGINGFACE_API_KEY = os.environ.get("HUGGINGFACE_API_KEY")

secret_key = os.environ.get("SECRET_KEY")


FOOD_BLACK_LIST = ["гнилой", "плесень", "отравленный", "испорченный"]
