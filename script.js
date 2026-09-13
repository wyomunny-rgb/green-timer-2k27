const MAX_TIME = 200; // 200ms
const GREEN_WINDOW_START = 60; // Start of green zone
const GREEN_WINDOW_END = 140; // End of green zone
const PERFECT_WINDOW_START = 90; // Perfect window
const PERFECT_WINDOW_END = 110; // Perfect window

let currentTime = 0;
let isRunning = false;
let animationFrameId = null;
let startTimestamp = null;

const timerDisplay = document.getElementById('timerDisplay');
const meterFill = document.getElementById('meterFill');
const percentage = document.getElementById('percentage');
const feedback = document.getElementById('feedback');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

function updateDisplay() {
    timerDisplay.textContent = currentTime + 'ms';
    const progress = (currentTime / MAX_TIME) * 100;
    meterFill.style.width = progress + '%';
    percentage.textContent = Math.round(progress) + '%';
}

function getFeedback() {
    if (currentTime >= PERFECT_WINDOW_START && currentTime <= PERFECT_WINDOW_END) {
        return { text: '🔥 PERFECT! 🔥', class: 'perfect' };
    } else if (currentTime >= GREEN_WINDOW_START && currentTime <= GREEN_WINDOW_END) {
        return { text: '✅ GREEN! ✅', class: 'good' };
    } else {
        return { text: '❌ MISS ❌', class: 'miss' };
    }
}

function updateFeedback() {
    const result = getFeedback();
    feedback.textContent = result.text;
    feedback.className = 'feedback ' + result.class;
}

function releaseShot() {
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    updateFeedback();
}

function animate(timestamp) {
    if (!startTimestamp) startTimestamp = timestamp;
    
    currentTime = Math.min(Math.round(timestamp - startTimestamp), MAX_TIME);
    updateDisplay();
    
    if (currentTime < MAX_TIME && isRunning) {
        animationFrameId = requestAnimationFrame(animate);
    } else if (currentTime >= MAX_TIME && isRunning) {
        // Auto-release when timer reaches 200ms
        releaseShot();
    }
}

startBtn.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        startTimestamp = null;
        feedback.textContent = '';
        startBtn.disabled = true;
        stopBtn.disabled = false;
        animationFrameId = requestAnimationFrame(animate);
    }
});

stopBtn.addEventListener('click', () => {
    releaseShot();
});

resetBtn.addEventListener('click', () => {
    isRunning = false;
    currentTime = 0;
    startTimestamp = null;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    feedback.textContent = '';
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    updateDisplay();
});

// Initialize display
updateDisplay();
