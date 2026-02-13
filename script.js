// Variables
let pin = "";
const correctPin = "1223"; // New PIN

// Floating Hearts background
function initHearts() {
    const bg = document.getElementById('heart-bg');
    if (!bg) return;
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 5 + 7) + 's';
        heart.style.animationDelay = (Math.random() * i) + 's';
        heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
        bg.appendChild(heart);
    }
}

// Bokeh Background
// (Removed as requested)

// Music Player Logic
let audioPlayer;
let isPlaying = false;
let progressInterval;
let currentTrackIndex = 0;

const tracks = [
    {
        name: "You Belong With Me",
        artist: "Taylor Swift",
        src: "assets/youbelongwithme.mp3"
    },
    {
        name: "Love Story",
        artist: "Taylor Swift",
        src: "assets/lovestory.mp3"
    },
    {
        name: "Message in a Bottle",
        artist: "Taylor Swift",
        src: "assets/massageinabottle.mp3"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initHearts();
    audioPlayer = document.getElementById('audio-player');

    // Load initial track
    loadTrack(0);

    // Set total duration when metadata is loaded
    audioPlayer.addEventListener('loadedmetadata', () => {
        document.getElementById('total-duration').innerText = formatTime(audioPlayer.duration);
    });

    // Auto-advance to next track
    audioPlayer.addEventListener('ended', () => {
        isPlaying = true; // Ensure it stays true for the next track
        nextTrack();
    });

    // Update progress when playing
    audioPlayer.addEventListener('play', () => {
        isPlaying = true;
        updatePlayPauseUI();
        startProgressTracking();
    });

    audioPlayer.addEventListener('pause', () => {
        // Only set isPlaying to false if it's not the end of the track
        // to prevent auto-advance from failing
        if (audioPlayer.currentTime < audioPlayer.duration - 0.5) {
            isPlaying = false;
        }
        updatePlayPauseUI();
        stopProgressTracking();
    });

    // Start Sparkle Trail
    // (Removed as requested)
});

function loadTrack(index) {
    const track = tracks[index];
    audioPlayer.src = track.src;
    document.getElementById('display-track-name').innerText = track.name;
    document.getElementById('display-artist-name').innerText = track.artist;

    // Reset progress
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('current-time').innerText = "0:00";

    if (isPlaying) {
        audioPlayer.play().catch(e => console.log("Autoplay blocked:", e));
    }
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
    loadTrack(currentTrackIndex);
}

function prevTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrackIndex);
}

function updatePlayPauseUI() {
    const btn = document.getElementById('play-pause-btn');
    if (!audioPlayer.paused) {
        btn.innerHTML = '<span id="music-icon" style="color:white;">❙❙</span>';
    } else {
        btn.innerHTML = '<span id="music-icon" style="color:white; margin-left:3px;">▶</span>';
    }
}

function startProgressTracking() {
    clearInterval(progressInterval);
    progressInterval = setInterval(updateProgress, 500);
}

function stopProgressTracking() {
    clearInterval(progressInterval);
}

function updateProgress() {
    if (!audioPlayer) return;

    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;

    if (isNaN(duration)) return;

    // Update Progress Bar
    const progressPercent = (currentTime / duration) * 100;
    document.getElementById('progress-bar').style.width = progressPercent + '%';

    // Update Time Display
    document.getElementById('current-time').innerText = formatTime(currentTime);
    document.getElementById('total-duration').innerText = formatTime(duration);
}

function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function seek(event) {
    if (!audioPlayer) return;
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const clickedPercent = (x / rect.width);
    const seekTo = audioPlayer.duration * clickedPercent;
    audioPlayer.currentTime = seekTo;
}

function toggleMusic() {
    if (!audioPlayer) return;

    if (!audioPlayer.paused) {
        audioPlayer.pause();
    } else {
        audioPlayer.play().catch(e => console.log("Autoplay blocked or error:", e));
    }
}

function handleIntro(answer) {
    document.getElementById('page0').classList.add('hidden');

    // Attempt to start music on first click (browser autoplay policy)
    if (audioPlayer && audioPlayer.paused) {
        toggleMusic();
    }

    if (answer === 'yes') {
        document.getElementById('page2').classList.remove('hidden'); // Yeyyy
        launchConfetti();
    } else {
        document.getElementById('page1').classList.remove('hidden'); // Can't say no
    }
}

function goToPage2() {
    // From Page 1 (Can't say no) -> Page 4 (Pin Code)
    document.getElementById('page1').classList.add('hidden');
    document.getElementById('page4').classList.remove('hidden');
}

function goToPage3() {
    // From Page 2 (Yeyyy) -> Page 4 (Pin Code)
    document.getElementById('page2').classList.add('hidden');
    document.getElementById('page4').classList.remove('hidden');
}

function openLetterOverlay() {
    // Show Envelope Overlay on Top of Page 3
    document.getElementById('letter-overlay').classList.remove('hidden');
}

function openFullLetter() {
    // Add class to wrapper to animate letter out
    document.querySelector('.envelope-wrapper').classList.add('open-full');
}

function closeLetterOverlay() {
    // Hide Overlay
    document.getElementById('letter-overlay').classList.add('hidden');

    // Reset Full View State
    document.querySelector('.envelope-wrapper').classList.remove('open-full');

    // Stay on Page 3 (Choice page) - just close the overlay
}

// --- NEW FEATURES FOR OTHER GIFS ---

// 1. GALLERY (Feature 3)
function openGallery() {
    document.getElementById('gallery-overlay').classList.remove('hidden');
}

function closeGallery() {
    document.getElementById('gallery-overlay').classList.add('hidden');
}

// 2. REASONS ORVERLAY
function openReasonsOverlay() {
    document.getElementById('reasons-overlay').classList.remove('hidden');
}

function closeReasonsOverlay() {
    document.getElementById('reasons-overlay').classList.add('hidden');
}

// 3. GIFT OVERLAY & MINI GAME
let score = 0;
let catScore = 0;
let gameInterval;
let catTimer;

function openGiftOverlay() {
    document.getElementById('gift-overlay').classList.remove('hidden');
    resetGame();
}

function closeGiftOverlay() {
    document.getElementById('gift-overlay').classList.add('hidden');
    stopGame();
}

function resetGame() {
    // Reset Variables
    score = 0;
    catScore = 0;

    // Reset UI Sections
    document.getElementById('stage1-screen').classList.remove('hidden');
    document.getElementById('game-ui-stage1').classList.add('hidden');
    document.getElementById('stage2-screen').classList.add('hidden');
    document.getElementById('game-ui-stage2').classList.add('hidden');
    document.getElementById('stage3-screen').classList.add('hidden');
    document.getElementById('gift-container').classList.add('hidden');

    // Reset Scores
    document.getElementById('score').innerText = '0';
    document.getElementById('cat-score').innerText = '0';

    // Reset Gift Box
    document.getElementById('gift-box-img').classList.remove('hidden');
    document.getElementById('gift-message').classList.add('hidden');
    document.getElementById('gift-box-img').style.transform = "none";

    document.getElementById('game-area').innerHTML = '';
}

function stopGame() {
    clearInterval(gameInterval);
    document.getElementById('game-area').innerHTML = '';
}

// STAGE 1 LOGIC
function startStage1() {
    document.getElementById('stage1-screen').classList.add('hidden');
    document.getElementById('game-ui-stage1').classList.remove('hidden');
    gameInterval = setInterval(spawnHeart, 600);
}

function spawnHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.classList.add('game-heart');
    heart.style.left = Math.random() * 90 + '%';
    heart.style.animationDuration = (Math.random() * 2 + 2) + 's';

    heart.onclick = function () {
        catchHeart(this);
    };

    document.getElementById('game-area').appendChild(heart);

    setTimeout(() => {
        if (heart.parentNode) heart.remove();
    }, 4000);
}

function catchHeart(element) {
    score++;
    document.getElementById('score').innerText = score;
    element.remove();

    if (score >= 10) {
        clearInterval(gameInterval);
        document.getElementById('game-area').innerHTML = '';
        setTimeout(() => {
            document.getElementById('game-ui-stage1').classList.add('hidden');
            document.getElementById('stage2-screen').classList.remove('hidden'); // Go to Level 2
        }, 500);
    }
}

// STAGE 2 LOGIC
function startStage2() {
    document.getElementById('stage2-screen').classList.add('hidden');
    document.getElementById('game-ui-stage2').classList.remove('hidden');

    // Slight delay to ensure element is rendered for offsetWidth
    setTimeout(() => {
        moveCat();
    }, 50);
}

function moveCat() {
    const cat = document.getElementById('chase-cat');
    const container = document.getElementById('game-ui-stage2');

    // Default to reasonable bounds if container issue (fallback)
    const containerWidth = container.offsetWidth || 300;
    const containerHeight = container.offsetHeight || 300;

    const maxX = containerWidth - 100; // 80px cat + padding
    const maxY = containerHeight - 100;

    // Ensure positive values
    const safeMaxX = Math.max(0, maxX);
    const safeMaxY = Math.max(0, maxY);

    const randomX = Math.random() * safeMaxX;
    const randomY = Math.random() * safeMaxY;

    cat.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

function clickCat() {
    catScore++;
    document.getElementById('cat-score').innerText = catScore;

    console.log('Cat clicked. Score:', catScore);

    if (catScore >= 3) {
        console.log('Level 2 Complete. Transitioning to Level 3...');

        const stage2UI = document.getElementById('game-ui-stage2');
        const stage3Screen = document.getElementById('stage3-screen');

        if (stage2UI && stage3Screen) {
            stage2UI.classList.add('hidden');
            stage3Screen.classList.remove('hidden');
            stage3Screen.style.display = 'block';
            stage3Screen.style.backgroundColor = 'rgba(255,255,255,0.95)';
            stage3Screen.style.zIndex = '1000';
            console.log('Level 3 Screen revealed.');
        } else {
            console.error('Critical Error: Stage 2 UI or Stage 3 Screen element not found!');
        }
    } else {
        moveCat();
    }
}

// STAGE 3 LOGIC
function wrongAnswer(btn) {
    btn.style.backgroundColor = '#555';
    btn.innerHTML = "NOPE 😝";
    setTimeout(() => {
        btn.innerHTML = btn.innerText === "NOPE 😝" ? "Try Again" : btn.innerText;
    }, 1000);
}

function correctAnswer() {
    console.log('Correct Answer! Revealing Gift...');

    // Hide Stage 3
    const stage3 = document.getElementById('stage3-screen');
    stage3.classList.add('hidden');
    stage3.style.display = 'none'; // Force hide

    // Show Gift
    const giftContainer = document.getElementById('gift-container');
    giftContainer.classList.remove('hidden');

    // Force styles for visibility
    giftContainer.style.display = 'flex';
    giftContainer.style.zIndex = '2000';
    giftContainer.style.opacity = '1';

    launchConfetti();
}

function openGift() {
    const giftBox = document.getElementById('gift-box-img');
    const giftMsg = document.getElementById('gift-message');

    if (!giftMsg.classList.contains('hidden')) return; // Already opened

    // Animate CSS box opening
    giftBox.classList.add('opened');

    setTimeout(() => {
        giftBox.classList.add('hidden');
        giftMsg.classList.remove('hidden');
        launchConfetti(); // Celebration!
    }, 600);
}

function goToPage4() {
    // Unused in current pattern flow but kept for safety
    document.getElementById('page3').classList.add('hidden');
    document.getElementById('page5').classList.remove('hidden');
}

// PIN Code Logic
function addPin(num) {
    if (pin.length < 4) {
        pin += num;
        updatePinDisplay();

        if (pin.length === 4) {
            checkPin();
        }
    }
}

function clearPin() {
    pin = "";
    updatePinDisplay();
    document.getElementById('error-msg').style.display = 'none';
}

function updatePinDisplay() {
    for (let i = 1; i <= 4; i++) {
        const dot = document.getElementById(`dot${i}`);
        if (i <= pin.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    }
}

function checkPin() {
    // You can also add a way for user to set this but for now it's hardcoded or check valid length
    if (pin === correctPin) {
        setTimeout(() => {
            goToPattern(); // Corrected flow: Pin -> Pattern
        }, 300);
    } else {
        document.getElementById('error-msg').style.display = 'block';
        setTimeout(clearPin, 1000);
    }
}

function goToPattern() {
    // From Page 4 (Pin) -> Page 3 (Pattern)
    document.getElementById('page4').classList.add('hidden');
    document.getElementById('page3').classList.remove('hidden');
}

function goToPage5() {
    // Legacy/Unused: was P4->P5. Now handled by goToPattern (P4->P3) and goToPage4 (P3->P5)
    // We can keep it or leave it, but let's ensure flow is correct.
    // Actually, goToPage4 is the one used by Pattern images to go to Envelope (Page 5).
    // So we don't need this function for the flow, but removing it won't hurt.
    // Let's just redefine it or leave it be to avoid reference errors if legacy HTML calls it.
    document.getElementById('page4').classList.add('hidden');
    document.getElementById('page5').classList.remove('hidden');
}

// Envelope Logic
function openEnvelope() {
    document.getElementById('envelope').classList.add('open');
    setTimeout(() => {
        document.getElementById('gallery-btn').classList.remove('hidden');
    }, 1500);
}

function backToPattern() {
    // Hide Page 5 (Envelope) -> Show Page 3 (Pattern)
    document.getElementById('page5').classList.add('hidden');
    document.getElementById('page3').classList.remove('hidden');

    // Reset Envelope State
    document.getElementById('envelope').classList.remove('open');
    document.getElementById('gallery-btn').classList.add('hidden');
}

function goToPage6() {
    document.getElementById('page5').classList.add('hidden');
    document.getElementById('page6').classList.remove('hidden');
}

function launchConfetti() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// Heart Rain Effect
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 3 + 2 + 's';
    heart.style.fontSize = Math.random() * 20 + 10 + 'px';
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 5000);
}


// 1. ARTICLE LAYOUT (Feature 2)
function openArticleOverlay() {
    document.getElementById('article-overlay').classList.remove('hidden');
}

function closeArticleOverlay() {
    document.getElementById('article-overlay').classList.add('hidden');
}
