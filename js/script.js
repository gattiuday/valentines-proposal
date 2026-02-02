/**
 * WEBSITE STATE MANAGEMENT
 */
let noCount = 0;
let selectedDatePlan = "";

// Custom guilt-trip messages that appear in the bubble above the No button
const noTexts = [
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

/**
 * Date Selection Logic
 */
function selectDate(el) {
    document.querySelectorAll('.date-option').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
    selectedDatePlan = el.querySelector('h3').innerText;
    const btn = document.getElementById('adventureBtn');
    btn.classList.remove('opacity-30', 'pointer-events-none');
}

/**
 * Page Navigation Logic
 */
function nextPage(n) {
    // 1. Fade out all current pages
    document.querySelectorAll('.page').forEach(p => {
        p.classList.add('hidden');
        p.classList.remove('opacity-100');
        p.classList.add('opacity-0');
    });

    // 2. Wait for fade out, then show new page
    setTimeout(() => {
        const target = document.getElementById(`page${n}`);
        if (target) {
            target.classList.remove('hidden');
            // Small delay to allow display:flex to apply before adding opacity
            setTimeout(() => {
                target.classList.remove('opacity-0');
                target.classList.add('opacity-100');
            }, 50);
        }

        // Update the website's progress bar
        const fill = document.getElementById('progress-fill');
        if (fill) fill.style.width = ((n - 1) / 4 * 100) + '%';

        // Hide progress on the finale
        if (n === 5) document.getElementById('progress').style.display = 'none';
    }, 600); // Wait for the exit transition
}

/**
 * NO BUTTON DODGE LOGIC:
 * This section handles the playful avoidance mechanism.
 * 1. The comment bubble is updated and positioned exactly above the button.
 * 2. The button is moved to a random safe coordinate on the screen.
 * 3. The transitions are synced to make the bubble look attached to the button.
 */
function dodge(e) {
    const btn = document.getElementById('noBtn');
    const comment = document.getElementById('noComment');
    const head = document.getElementById('questionHeader');

    noCount++;

    // 1. Update the comment bubble text and show it
    comment.innerText = noTexts[Math.min(noCount - 1, noTexts.length - 1)];
    comment.style.opacity = "1";

    // 2. DODGE LOGIC: Calculate random viewport coordinates
    const pad = 100; // Screen margin buffer
    const btnWidth = btn.offsetWidth;
    const btnHeight = btn.offsetHeight;

    const x = Math.random() * (window.innerWidth - btnWidth - pad * 2) + pad;
    const y = Math.random() * (window.innerHeight - btnHeight - pad * 2) + pad;

    // Move the button
    btn.style.position = 'fixed';
    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    // 3. Move the comment bubble to stay EXACTLY centered on top of the button
    // Centering: X = ButtonLeft + (ButtonWidth/2) - (CommentWidth/2)
    comment.style.left = `${x + (btnWidth / 2) - (comment.offsetWidth / 2)}px`;
    comment.style.top = `${y - 65}px`;

    // 4. Update the website header text based on user persistence
    if (noCount === 5) {
        head.innerText = "Don't break my heart... 💔";
        head.style.color = "#800f2f";
    }
    if (noCount >= 10) {
        head.innerText = "Okay, now you're just being mean! 😭";
    }
}

/**
 * Celebration Confetti System
 */
function celebrate() {
    // Hide the comment bubble immediately upon success
    const comment = document.getElementById('noComment');
    if (comment) comment.style.opacity = "0";

    // 1. Trigger Confetti FIRST for immediate feedback
    const container = document.body;
    const colors = ['#ff85a1', '#ff4d6d', '#ffb3c1', '#ffd700', '#ffffff'];

    for (let i = 0; i < 220; i++) {
        const p = document.createElement('div');
        p.className = 'confetti';

        const isHeart = Math.random() > 0.7;
        if (isHeart) {
            p.innerHTML = `<div class="heart-particle" style="background:${colors[Math.floor(Math.random() * colors.length)]}"></div>`;
        } else {
            p.style.width = Math.random() * 8 + 4 + 'px';
            p.style.height = Math.random() * 12 + 8 + 'px';
            p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        }

        let x = window.innerWidth / 2;
        let y = window.innerHeight / 2;
        const angle = Math.random() * Math.PI * 2;
        const velocity = 8 + Math.random() * 28;
        let vx = Math.cos(angle) * velocity;
        let vy = Math.sin(angle) * velocity - 18;
        let rot = Math.random() * 360;
        let op = 1;

        container.appendChild(p);

        function step() {
            x += vx;
            y += vy;
            vy += 0.55;
            vx *= 0.985;
            rot += 15;
            op -= 0.007;

            p.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
            p.style.opacity = op;

            if (op > 0) requestAnimationFrame(step);
            else p.remove();
        }
        requestAnimationFrame(step);
    }

    // 2. Transition to Final Page after a glorious delay
    setTimeout(() => {
        nextPage(5);
    }, 1500);
}

/**
 * Audio Management
 */
const audio = document.getElementById('bgMusic');
const musicIcon = document.getElementById('musicIcon');
const musicText = document.getElementById('musicText');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        audio.pause();
        musicIcon.innerText = "🔇";
        musicText.innerText = "Play Music";
        musicIcon.classList.remove('animate-spin');
    } else {
        audio.play().then(() => {
            musicIcon.innerText = "🎵";
            musicText.innerText = "Pause Music";
            musicIcon.classList.add('animate-spin');
        }).catch(e => console.log("Audio play failed:", e));
    }
    isPlaying = !isPlaying;
}

// Auto-play music on first interaction (browser policy)
let hasInteracted = false;
document.addEventListener('click', () => {
    if (!hasInteracted && !isPlaying) {
        toggleMusic();
        hasInteracted = true;
    }
}, { once: true });

// Mobile Touch Support for No Button
const noBtn = document.getElementById('noBtn');
if (noBtn) {
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent click
        dodge(e);
    }, { passive: false });
}
