import pytest
from app import app
import json


@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client


def test_get_text(client, mocker):
    mock_load_texts = mocker.patch('app.load_texts', return_value=["Test text"])
    response = client.get('/text')
    mock_load_texts.assert_called_once()
    assert response.status_code == 200
    assert json.loads(response.data) == {"text": "Test text"}


def test_get_text_empty(client, mocker):
    mock_load_texts = mocker.patch('app.load_texts', return_value=[])
    response = client.get('/text')
    assert response.status_code == 500
    assert json.loads(response.data) == {"error": "No texts available"}
    mock_load_texts.assert_called_once()


def test_save_result_valid(client):
    response = client.post('/result', json={"wpm": 60, "accuracy": 95})
    assert response.status_code == 201
    assert json.loads(response.data) == {"message": "Result saved successfully"}


def test_save_result_invalid(client):
    response = client.post('/result', json={"wpm": -10, "accuracy": 150})
    assert response.status_code == 400
    assert json.loads(response.data) == {"error": "Invalid values"}
