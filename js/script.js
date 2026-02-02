/**
 * Enhancements:
 * - Typewriter effect for the letter
 * - Smoother transitions
 * - Dynamic background generation
 */

// Configuration
const CONFIG = {
    typewriterSpeed: 40, // ms per char
    noBtnPad: 80, // padding from edge for dodge
    bgHeartsCount: 15, // number of floating background hearts
};

// State
let state = {
    noCount: 0,
    selectedDate: null,
    currentPage: 1,
    isTyping: false
};

const NO_TEXTS = [
    "Are you sure? 🤨",
    "Really sure? 🥺",
    "Think again! 💭",
    "Wait, why? 🥀",
    "Is that a typo?",
    "I'll be so sad... 😭",
    "Heartbroken... 💔",
    "Try the big button! 👉",
    "You're heartless! 😤",
    "Pookkie please? 🥺"
];

const LETTER_TEXT = "In a world full of noise, you are my favorite melody. It’s the small things—the way you look when you're thinking, the kindness you show everyone, and how you make 'home' feel like a person.\n\nEvery day with you is a new favorite memory.";

/**
 * INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
    createBackgroundHearts();
});

function createBackgroundHearts() {
    const container = document.getElementById('bg-hearts');
    for (let i = 0; i < CONFIG.bgHeartsCount; i++) {
        const heart = document.createElement('div');
        heart.classList.add('bg-heart');
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 10 + 's';
        heart.style.animationDuration = (10 + Math.random() * 10) + 's';
        heart.style.opacity = Math.random() * 0.5 + 0.1;
        heart.style.transform = `scale(${Math.random() * 0.5 + 0.5}) rotate(45deg)`;
        container.appendChild(heart);
    }
}

/**
 * NAVIGATION
 */
function nextPage(n) {
    // Prevent double clicking triggering weird states
    if (state.currentPage === n) return;

    // Hide current
    document.getElementById(`page${state.currentPage}`).classList.add('hidden');

    // Show next
    const target = document.getElementById(`page${n}`);
    target.classList.remove('hidden');
    state.currentPage = n;

    // Progress Bar
    const fill = document.getElementById('progress-fill');
    if (fill) fill.style.width = ((n - 1) / 4 * 100) + '%';
    if (n === 5) document.getElementById('progress').style.opacity = '0';

    // Special Page Actions
    if (n === 2) {
        startTypewriter();
    }
}

/**
 * TYPEWRITER EFFECT
 */
function startTypewriter() {
    if (state.isTyping) return;
    state.isTyping = true;

    const element = document.getElementById('typewriter-text');
    element.innerHTML = ""; // Clear initial
    let i = 0;

    function type() {
        if (i < LETTER_TEXT.length) {
            element.innerHTML += LETTER_TEXT.charAt(i);
            i++;
            setTimeout(type, CONFIG.typewriterSpeed);
        } else {
            element.style.borderRight = "none"; // Stop blinking cursor
        }
    }
    // Small delay before typing starts for effect
    setTimeout(type, 500);
}

/**
 * SELECTION LOGIC
 */
function selectDate(el) {
    document.querySelectorAll('.date-option').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    state.selectedDate = el.querySelector('h3').innerText;

    const btn = document.getElementById('adventureBtn');
    btn.classList.remove('opacity-30', 'pointer-events-none');
    btn.innerText = `Yes, let's do ${state.selectedDate}!`;
}

/**
 * DODGE LOGIC
 */
function dodge(e) {
    if (window.innerWidth < 768) return; // Optional: disable on mobile if too hard

    const btn = document.getElementById('noBtn');
    const comment = document.getElementById('noComment');
    const head = document.getElementById('questionHeader');

    state.noCount++;

    // Text Update
    comment.innerText = NO_TEXTS[Math.min(state.noCount - 1, NO_TEXTS.length - 1)];
    comment.style.opacity = "1";

    // Random Position
    const btnW = btn.offsetWidth;
    const btnH = btn.offsetHeight;
    const maxX = window.innerWidth - btnW - CONFIG.noBtnPad;
    const maxY = window.innerHeight - btnH - CONFIG.noBtnPad;

    const x = Math.max(CONFIG.noBtnPad, Math.random() * maxX);
    const y = Math.max(CONFIG.noBtnPad, Math.random() * maxY);

    // Move Button
    btn.style.position = 'fixed';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    // Move Comment Bubble (anchored top-center of button)
    comment.style.left = `${x + (btnW / 2) - (comment.offsetWidth / 2)}px`;
    comment.style.top = `${y - 50}px`;

    // Visual Intensification
    if (state.noCount > 5) {
        head.style.color = "#800f2f";
    }
}

/**
 * CELEBRATION
 */
function celebrate() {
    document.getElementById('noComment').style.opacity = "0";
    nextPage(5);

    // Launch massive confetti
    const end = Date.now() + 3000;
    const colors = ['#ff85a1', '#ff4d6d', '#ffb3c1', '#ffffff'];

    (function frame() {
        confettiCannon();
        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function confettiCannon() {
    const container = document.body; // or specific container
    const p = document.createElement('div');
    p.className = 'confetti';

    const isHeart = Math.random() > 0.5;
    if (isHeart) {
        p.innerHTML = `<div class="heart-particle"></div>`;
        p.querySelector('.heart-particle').style.backgroundColor = ['#ff85a1', '#ff4d6d'][Math.floor(Math.random() * 2)];
    } else {
        p.style.width = Math.random() * 8 + 4 + 'px';
        p.style.height = Math.random() * 12 + 6 + 'px';
        p.style.background = ['#ffdac1', '#e2f0cb', '#b5ead7', '#ff9aa2'][Math.floor(Math.random() * 4)];
    }

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    // Explode outwards
    const angle = Math.random() * Math.PI * 2;
    const velocity = 10 + Math.random() * 20;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity - 5;

    container.appendChild(p);

    let opacity = 1;
    function animate() {
        x += vx;
        y += vy;
        vy += 0.5; // Gravity
        vx *= 0.95; // Drag
        opacity -= 0.01;

        p.style.transform = `translate(${x}px, ${y}px)`;
        p.style.opacity = opacity;

        if (opacity > 0) requestAnimationFrame(animate);
        else p.remove();
    }
    requestAnimationFrame(animate);
}
