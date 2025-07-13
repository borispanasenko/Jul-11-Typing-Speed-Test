const startBtn = document.getElementById('start-btn');
const retryBtn = document.getElementById('retry-btn');
const testArea = document.getElementById('test-area');
const resultArea = document.getElementById('result-area');
const sampleText = document.getElementById('sample-text');
const inputText = document.getElementById('input-text');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const spinner = document.getElementById('spinner');
const themeSlider = document.querySelector('.slider');
const themeOption = document.querySelector('.option.theme');

themeOption.addEventListener('mouseenter', () => {
    document.body.classList.add('theme-slider--is--visible');
});

themeOption.addEventListener('mouseleave', () => {
    document.body.classList.add('theme-slider--collapsing');
    setTimeout(() => {
        document.body.classList.remove('theme-slider--is--visible');
        document.body.classList.remove('theme-slider--collapsing');
    }, 600);
});

// For accessibility: focus too
themeOption.addEventListener('focusin', () => {
    document.body.classList.add('theme-slider--is--visible');
});

themeOption.addEventListener('focusout', () => {
    document.body.classList.add('theme-slider--collapsing');
    setTimeout(() => {
        document.body.classList.remove('theme-slider--is--visible');
        document.body.classList.remove('theme-slider--collapsing');
    }, 600);
});

let startTime, timerInterval, testText;

const htmlElement = document.documentElement;
const body = document.body;

function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

const savedTheme = localStorage.getItem('theme') || 'theme--16'; // Default to light theme
setTheme(savedTheme);
themeSlider.value = parseInt(savedTheme.split('--')[1], 10);

// Add initial theme class to body for icon position
body.classList.add(savedTheme);

themeSlider.addEventListener('input', (e) => {
    const val = e.target.value;
    const theme = `theme--${val}`;
    // Remove old theme classes from body
    Array.from(body.classList).filter(c => c.startsWith('theme--')).forEach(c => body.classList.remove(c));
    // Add new theme class to body
    body.classList.add(theme);
    setTheme(theme);
});

function startTimer() {
    startTime = Date.now();
    timerDisplay.textContent = 'Time: 0s';
    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        timerDisplay.textContent = `Time: ${elapsed}s`;
    }, 1000);
}

function calculateResults() {
    const elapsedSeconds = Math.max((Date.now() - startTime) / 1000, 1); // Avoid division by zero
    const typedText = inputText.value.trim().substring(0, testText.length); // Handle overtyping
    const wordsTyped = typedText.split(/\s+/).filter(w => w.length > 0).length;
    const wpm = Math.round((wordsTyped / elapsedSeconds) * 60);

    let correctChars = 0;
    for (let i = 0; i < typedText.length; i++) {
        if (typedText[i] === testText[i]) correctChars++;
    }

    const accuracy = Math.round((correctChars / testText.length) * 100);

    return { wpm, accuracy };
}

function showResults(wpm, accuracy) {
    testArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
    wpmDisplay.textContent = `WPM: ${wpm}`;
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
}

async function fetchText() {
    spinner.classList.remove('hidden');
    try {
        const response = await fetch('http://localhost:5000/text');
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        return data.text;
    } catch (error) {
        console.error('Error fetching text:', error);
        alert('Failed to load text. Please try again.');
        return null;
    } finally {
        spinner.classList.add('hidden');
    }
}

async function saveResult(wpm, accuracy) {
    try {
        const response = await fetch('http://localhost:5000/result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ wpm, accuracy })
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        console.log('Result saved:', data.message);
    } catch (error) {
        console.error('Error saving result:', error);
    }
}

startBtn.addEventListener('click', async () => {
    testText = await fetchText();
    if (!testText) return;

    sampleText.textContent = testText;
    inputText.value = '';
    testArea.classList.remove('hidden');
    startBtn.classList.add('hidden');

    inputText.focus();
    inputText.addEventListener('input', () => {
        startTimer();
    }, { once: true });

    inputText.addEventListener('input', () => {
        if (inputText.value.length >= testText.length) {
            clearInterval(timerInterval);
            const { wpm, accuracy } = calculateResults();
            showResults(wpm, accuracy);
            saveResult(wpm, accuracy);
        }
    });
});

retryBtn.addEventListener('click', () => {
    resultArea.classList.add('hidden');
    testArea.classList.add('hidden');
    startBtn.classList.remove('hidden');
    timerDisplay.textContent = 'Time: 0s';
    inputText.value = '';
    sampleText.textContent = '';
});
