# Typing Speed Test

A web application to test typing speed (WPM) and accuracy, built with a JAMstack architecture. 
The frontend is a static single-page application (SPA) using HTML, JavaScript, and Tailwind CSS with 
custom styling, while the backend is a Flask REST API. The project demonstrates skills in Flask, REST API, 
AJAX, pytest, and modern web development practices, including a customizable theme slider inspired by 
Billy Sweeney for enhanced user experience.

## Features
- **Frontend**: Static interface with real-time typing test, WPM/accuracy calculation, and AJAX integration for seamless API communication. Includes an expandable theme slider with 17 themes (from dark to light), animated transitions, and local storage persistence for user preferences.
- **Backend**: Flask API with endpoints for fetching random texts (`GET /text`) and saving test results (`POST /result`).
- **Typing Test Logic**: The timer starts only on the first keystroke after reading the sample text, making the test user-friendly, honest, and focused on actual typing skills (allowing time to prepare without inflating results).
- **Testing**: Unit tests with pytest and pytest-mock covering API endpoints, error handling, and mocking for isolation.
- **Deployment**: Configured for Vercel (frontend) and Heroku/Render (backend).

## Project Structure
```
typing-speed-test/
├── app.py                  # Flask API
├── data/
│   └── texts.json         # Sample texts for typing tests (literature quotes in English)
├── utils/
│   └── utils.py           # Text loading and WPM calculation logic
├── public/
│   ├── index.html         # Static frontend markup
│   ├── script.js          # Frontend logic (AJAX, timer, WPM, theme switching)
│   └── styles.css         # Custom CSS for themes and slider animations
├── tests/
│   └── test_app.py        # Pytest unit tests
├── requirements.txt        # Python dependencies
├── pytest.ini             # Pytest configuration
├── .gitignore             # Ignored files
└── readme.md              # Project documentation
```

## Setup and Running Locally
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd typing-speed-test
   ```

2. **Backend Setup**:
   - Install dependencies:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     pip install -r requirements.txt
     ```
   - Ensure `data/texts.json` exists with sample texts (pre-filled with literature quotes).
   - Run the Flask server:
     ```bash
     python app.py
     ```
     The API will be available at `http://localhost:5000`.

3. **Frontend Setup**:
   - Navigate to the `public/` folder and start a static server:
     ```bash
     cd public
     python3 -m http.server 8000
     ```
     Open `http://localhost:8000` in your browser. Use the theme slider (bottom-left, expandable on hover) to switch between 17 themes for a customized experience.

4. **Running Tests**:
   - Ensure dependencies are installed (`pytest` and `pytest-mock` included in `requirements.txt`).
   - Run pytest from the project root:
     ```bash
     pytest
     ```
     Tests are configured via `pytest.ini` for verbose output, automatic discovery in the `tests/` folder, and module resolution from the project root.

## How the Typing Test Works
- Click "Start Test" to fetch a random quote from the API.
- Read the sample text at your own pace — the timer starts automatically on your first keystroke, ensuring the test measures pure typing skill without rushing preparation.
- Type in the textarea; the test ends when your input matches the sample's length.
- Results (WPM based on words typed per minute, accuracy as percentage of matching characters) are displayed and saved to the API.
- Use "Try Again" to restart. Themes persist across sessions via localStorage.

## Deployment
- **Frontend (Vercel)**:
  - Push the `public/` folder to a GitHub repository.
  - Deploy via Vercel (import repo, set root to `public/`).
  - Add `vercel.json` for SPA routing:
    ```json
    {
      "rewrites": [
        { "source": "/(.*)", "destination": "/index.html" }
      ]
    }
    ```
  - Update the API URL in `script.js` to your production backend (e.g., `https://your-app.herokuapp.com`).

- **Backend (Heroku/Render)**:
  - Add `Procfile`: `web: gunicorn -w 4 app:app`.
  - Deploy via GitHub integration or CLI (e.g., `git push heroku main`).
  - Set environment variables (e.g., `PORT=5000`) in the platform dashboard.
  - Ensure CORS allows requests from your Vercel domain.

## Future Improvements
- Add user authentication to save and retrieve personal test results.
- Implement a leaderboard API endpoint to display top scores.
- Enhance the UI with real-time feedback (e.g., highlighting correct/incorrect characters) and more animations.
- Support additional text lengths, difficulty levels, or categories for varied tests.
- Optimize theme slider for mobile (e.g., touch events) and add more themes.

## Skills Demonstrated
- **Backend**: Flask, REST API development, CORS configuration, logging, and error handling.
- **Frontend**: JavaScript (AJAX/fetch, event listeners, DOM manipulation), Tailwind CSS with custom animations, theme switching with localStorage.
- **Testing**: Pytest with pytest-mock for unit testing, mocking, and error handling, configured via `pytest.ini`.
- **Architecture**: JAMstack for scalable, decoupled web applications.
- **DevOps**: Git, Vercel, Heroku/Render deployment workflows.
- **UX/UI**: Custom expandable slider with staggered animations, accessibility (focus events), and user-friendly test flow.