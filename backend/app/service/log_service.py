import os
import datetime
import threading
from pathlib import Path
from typing import Literal
import sys

LogLevels = Literal["info", "warn", "error"]

class PromptLogger:
    def __init__(self, logs_dir: str = "logs"):
        self.logs_dir = Path(logs_dir)
        self.logs_dir.mkdir(exist_ok=True)
        self._lock = threading.Lock()

    def _get_log_filename(self) -> Path:
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        return self.logs_dir / f"{today}.log"

    def log(self, message: str, level: LogLevels = "info", extra_info: str = ""):
        if not isinstance(message, str):
            message = str(message)

        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        level_tag = f"[{level}]"
        log_entry = f"[{timestamp}] {level_tag} {message.strip()}"
        if extra_info:
            log_entry += f" | {extra_info}"
        log_entry += "\n"

        try:
            log_file = self._get_log_filename()
            with self._lock:
                with open(log_file, "a", encoding="utf-8") as f:
                    f.write(log_entry)
        except Exception as e:
            print(f"[CRITICAL] Не удалось записать лог: {e}", file=sys.stderr)

    def info(self, message: str, extra_info: str = ""):
        self.log(message, level="info", extra_info=extra_info)

    def warn(self, message: str, extra_info: str = ""):
        self.log(message, level="warn", extra_info=extra_info)

    def error(self, message: str, extra_info: str = ""):
        self.log(message, level="error", extra_info=extra_info)

    def get_today_logs(self) -> str:
        log_file = self._get_log_filename()
        if log_file.exists():
            try:
                return log_file.read_text(encoding="utf-8")
            except Exception as e:
                return f"Ошибка чтения лога: {e}"
        return "Логов за сегодня нет."

    def get_logs_by_date(self, date_str: str) -> str:
        try:
            datetime.datetime.strptime(date_str, "%Y-%m-%d")
        except ValueError:
            return "Неверный формат даты. Используйте YYYY-MM-DD."
        log_file = self.logs_dir / f"{date_str}.log"
        if log_file.exists():
            try:
                return log_file.read_text(encoding="utf-8")
            except Exception as e:
                return f"Ошибка чтения: {e}"
        return f"Логов за {date_str} не найдено."