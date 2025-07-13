from flask import Flask, jsonify, request
from flask_cors import CORS
import logging
import json
import random
from utils.utils import calculate_wpm, load_texts

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route('/text', methods=['GET'])
def get_text():
    try:
        texts = load_texts()
        if not texts:
            logger.error("No texts available")
            return jsonify({"error": "No texts available"}), 500
        text = random.choice(texts)
        logger.info(f"Provided text: {text[:30]}...")
        return jsonify({"text": text})
    except Exception as e:
        logger.error(f"Error fetching text: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route('/result', methods=['POST'])
def save_result():
    try:
        data = request.get_json()
        wpm = data.get('wpm')
        accuracy = data.get('accuracy')

        if not isinstance(wpm, (int, float)) or not isinstance(accuracy, (int, float)):
            logger.error("Invalid wpm or accuracy")
            return jsonify({"error": "Invalid wpm or accuracy"}), 400

        if wpm < 0 or accuracy < 0 or accuracy > 100:
            logger.error("Invalid values for wpm or accuracy")
            return jsonify({"error": "Invalid values"}), 400

        logger.info(f"Saved result: WPM={wpm}, Accuracy={accuracy}%")
        return jsonify({"message": "Result saved successfully"}), 201
    except Exception as e:
        logger.error(f"Error saving result: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
