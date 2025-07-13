import json
import os


def load_texts():
    try:
        with open(os.path.join(os.path.dirname(__file__), '../data/texts.json'), 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading texts: {str(e)}")
        return []


def calculate_wpm(typed_text, original_text, elapsed_seconds):
    words_typed = len(typed_text.split())
    wpm = (words_typed / elapsed_seconds) * 60 if elapsed_seconds > 0 else 0

    correct_chars = sum(1 for a, b in zip(typed_text, original_text) if a == b)
    accuracy = (correct_chars / len(original_text)) * 100 if original_text else 0

    return wpm, accuracy
