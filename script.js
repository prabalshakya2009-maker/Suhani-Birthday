/**
 * Birthday Celebration Interactive Engine
 * Controls:
 * - Particle Confetti System (Canvas)
 * - Rising Interactive Balloons (Physics & Tap-to-Pop)
 * - Cake Candle Blowing & Slice Cutting
 * - URL Parameter Personalization & Shareable Link Generator
 * - Sound Engine Integration
 * - Interactive Gift Fortune Box
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const entranceOverlay = document.getElementById('entranceOverlay');
    const btnOpenSurprise = document.getElementById('btnOpenSurprise');
    const celebrationCanvas = document.getElementById('celebrationCanvas');
    const balloonCanvas = document.getElementById('balloonCanvas');
    const btnMusicToggle = document.getElementById('btnMusicToggle');
    const equalizerBars = document.getElementById('equalizerBars');
    const musicIcon = document.getElementById('musicIcon');
    const musicStyleSelect = document.getElementById('musicStyleSelect');
    const btnMute = document.getElementById('btnMute');
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    const btnCustomize = document.getElementById('btnCustomize');
    const customizeModal = document.getElementById('customizeModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnBlowCandles = document.getElementById('btnBlowCandles');
    const btnCutCake = document.getElementById('btnCutCake');
    const cakeFeedback = document.getElementById('cakeFeedback');
    const candles = document.querySelectorAll('.candle');
    const surpriseGift = document.getElementById('surpriseGift');
    const giftFortuneText = document.getElementById('giftFortuneText');
    const poppedCountEl = document.getElementById('poppedCount');
    const toastMsg = document.getElementById('toastMsg');

    // Personalization Elements
    const recipientNameEl = document.getElementById('recipientName');
    const ageBadgeEl = document.getElementById('ageBadge');
    const letterToEl = document.getElementById('letterTo');
    const letterBodyEl = document.getElementById('letterBody');
    const letterSignatureEl = document.getElementById('letterSignature');
    const inputName = document.getElementById('inputName');
    const inputAge = document.getElementById('inputAge');
    const inputSender = document.getElementById('inputSender');
    const inputMessage = document.getElementById('inputMessage');
    const selectTheme = document.getElementById('selectTheme');
    const shareLinkInput = document.getElementById('shareLinkInput');
    const btnCopyLink = document.getElementById('btnCopyLink');

    // State Variables
    let poppedBalloons = 0;
    let areCandlesBlown = false;
    let cakeCut = false;
    const themes = ['galaxy', 'rosegold', 'carnival'];
    let currentThemeIdx = 0;

    // --- 1. PERSONALIZATION & URL PARSING ---
    function initPersonalization() {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name') || 'Beautiful Soul';
        const age = params.get('age') || '';
        const from = params.get('from') || 'With Love, Everyone';
        const theme = params.get('theme') || 'galaxy';
        const defaultMsg = `May your special day be overflowing with pure happiness, endless laughter, and all the sweetest memories! You bring so much joy and light to everyone around you. Here's to making this year your most unforgettable chapter yet! 🌟💖`;
        const msg = params.get('msg') || defaultMsg;

        // Populate View
        recipientNameEl.textContent = name;
        letterToEl.textContent = `Dearest ${name},`;
        letterBodyEl.textContent = msg;
        letterSignatureEl.textContent = from;

        if (age) {
            ageBadgeEl.textContent = `✨ ${age} Years Fabulous ✨`;
            ageBadgeEl.style.display = 'inline-block';
        } else {
            ageBadgeEl.style.display = 'none';
        }

        // Apply theme
        if (themes.includes(theme)) {
            currentThemeIdx = themes.indexOf(theme);
            applyTheme(theme);
        }

        // Pre-fill form
        inputName.value = name;
        inputAge.value = age;
        inputSender.value = from;
        inputMessage.value = msg;
        selectTheme.value = theme;

        updateShareLink();
    }

    function applyTheme(themeName) {
        if (themeName === 'galaxy') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', themeName);
        }
    }

    function updateShareLink() {
        const url = new URL(window.location.origin + window.location.pathname);
        if (inputName.value) url.searchParams.set('name', inputName.value);
        if (inputAge.value) url.searchParams.set('age', inputAge.value);
        if (inputSender.value) url.searchParams.set('from', inputSender.value);
        if (inputMessage.value) url.searchParams.set('msg', inputMessage.value);
        if (selectTheme.value && selectTheme.value !== 'galaxy') {
            url.searchParams.set('theme', selectTheme.value);
        }
        shareLinkInput.value = url.toString();
    }

    // Modal Events
    btnCustomize.addEventListener('click', () => {
        customizeModal.classList.add('active');
        updateShareLink();
    });

    btnCloseModal.addEventListener('click', () => {
        customizeModal.classList.remove('active');
    });

    customizeModal.addEventListener('click', (e) => {
        if (e.target === customizeModal) {
            customizeModal.classList.remove('active');
        }
    });

    [inputName, inputAge, inputSender, inputMessage, selectTheme].forEach(input => {
        input.addEventListener('input', () => {
            updateShareLink();
            // Live apply preview
            recipientNameEl.textContent = inputName.value || 'Friend';
            letterToEl.textContent = `Dearest ${inputName.value || 'Friend'},`;
            letterBodyEl.textContent = inputMessage.value;
            letterSignatureEl.textContent = inputSender.value || 'With Love';
            if (inputAge.value) {
                ageBadgeEl.textContent = `✨ ${inputAge.value} Years Fabulous ✨`;
                ageBadgeEl.style.display = 'inline-block';
            } else {
                ageBadgeEl.style.display = 'none';
            }
            applyTheme(selectTheme.value);
        });
    });

    // Copy Link Action
    btnCopyLink.addEventListener('click', () => {
        shareLinkInput.select();
        shareLinkInput.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(shareLinkInput.value).then(() => {
            showToast('💌 Shareable Birthday link copied to clipboard!');
        }).catch(() => {
            document.execCommand('copy');
            showToast('💌 Shareable link copied!');
        });
    });

    function showToast(msg) {
        toastMsg.textContent = msg;
        toastMsg.classList.add('show');
        setTimeout(() => {
            toastMsg.classList.remove('show');
        }, 3200);
    }

    // Theme Toggle Button in Nav
    btnThemeToggle.addEventListener('click', () => {
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        const nextTheme = themes[currentThemeIdx];
        applyTheme(nextTheme);
        selectTheme.value = nextTheme;
        updateShareLink();
        showToast(`Switched theme to ${nextTheme.toUpperCase()}`);
    });

    // --- 2. ENTRANCE & AUDIO START ---
    btnOpenSurprise.addEventListener('click', () => {
        entranceOverlay.classList.add('hidden');

        // Start Happy Birthday Music
        if (window.birthdayAudio) {
            window.birthdayAudio.initContext();
            window.birthdayAudio.playBirthdaySong();
        }

        // Celebratory sound effect & confetti blasts
        if (window.birthdayAudio) {
            window.birthdayAudio.playPartyPopperSound();
        }
        triggerMassiveConfetti();
        cakeFeedback.textContent = "🎉 Make a wish and blow out the candles! 🎂";
    });

    // Audio Controls UI Binding
    if (window.birthdayAudio) {
        window.birthdayAudio.onPlayStateChange = (isPlaying) => {
            if (isPlaying) {
                equalizerBars.classList.add('playing');
                musicIcon.textContent = '⏸️';
            } else {
                equalizerBars.classList.remove('playing');
                musicIcon.textContent = '▶️';
            }
        };

        btnMusicToggle.addEventListener('click', () => {
            window.birthdayAudio.togglePlay();
        });

        musicStyleSelect.addEventListener('change', (e) => {
            window.birthdayAudio.setStyle(e.target.value);
            showToast(`Music style: ${e.target.selectedOptions[0].text}`);
        });

        btnMute.addEventListener('click', () => {
            const muted = window.birthdayAudio.toggleMute();
            btnMute.textContent = muted ? '🔇' : '🔊';
            showToast(muted ? 'Audio muted' : 'Audio unmuted');
        });
    }

    // Quick cheer pills
    document.querySelectorAll('.cheer-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const cheerType = pill.getAttribute('data-cheer');
            if (window.birthdayAudio) window.birthdayAudio.playCelebrationFanfare();
            triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 80);
            showToast(`Sent cheer: ${pill.textContent}! 🥳`);
        });
    });

    // --- 3. CAKE & CANDLE INTERACTIONS ---
    function extinguishAllCandles() {
        if (!areCandlesBlown) {
            areCandlesBlown = true;
            candles.forEach(candle => candle.classList.add('blown'));

            if (window.birthdayAudio) {
                window.birthdayAudio.playCandleBlowSound();
                setTimeout(() => {
                    window.birthdayAudio.playCelebrationFanfare();
                }, 400);
            }

            triggerMassiveConfetti();
            cakeFeedback.textContent = "✨ WHOOSH! Your wish has been granted! Happy Birthday! ✨";
            btnBlowCandles.innerHTML = "<span>✨</span> Relight Candles";
            btnBlowCandles.classList.remove('blow-btn');
        } else {
            // Relight
            areCandlesBlown = false;
            candles.forEach(candle => candle.classList.remove('blown'));
            if (window.birthdayAudio) window.birthdayAudio.playCelebrationFanfare();
            cakeFeedback.textContent = "🔥 The candles are glowing brightly! Make another wish! ✨";
            btnBlowCandles.innerHTML = "<span>🕯️</span> Blow Out Candles";
            btnBlowCandles.classList.add('blow-btn');
        }
    }

    btnBlowCandles.addEventListener('click', extinguishAllCandles);

    // Click individual candle
    candles.forEach(candle => {
        candle.addEventListener('click', () => {
            if (!candle.classList.contains('blown')) {
                candle.classList.add('blown');
                if (window.birthdayAudio) window.birthdayAudio.playCandleBlowSound();

                // Check if all blown
                const remaining = document.querySelectorAll('.candle:not(.blown)').length;
                if (remaining === 0) {
                    areCandlesBlown = true;
                    btnBlowCandles.innerHTML = "<span>✨</span> Relight Candles";
                    btnBlowCandles.classList.remove('blow-btn');
                    setTimeout(() => {
                        if (window.birthdayAudio) window.birthdayAudio.playCelebrationFanfare();
                        triggerMassiveConfetti();
                        cakeFeedback.textContent = "🌟 All candles are out! May your year ahead be pure magic! 🌟";
                    }, 300);
                } else {
                    cakeFeedback.textContent = `🌬️ ${remaining} candle${remaining > 1 ? 's' : ''} left! Keep blowing!`;
                }
            } else {
                candle.classList.remove('blown');
                areCandlesBlown = false;
                btnBlowCandles.innerHTML = "<span>🕯️</span> Blow Out Candles";
                btnBlowCandles.classList.add('blow-btn');
            }
        });
    });

    // Cut cake slice
    btnCutCake.addEventListener('click', () => {
        if (!cakeCut) {
            cakeCut = true;
            if (window.birthdayAudio) window.birthdayAudio.playPartyPopperSound();
            triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 60);
            cakeFeedback.textContent = "🍰 A delicious strawberry cream slice is served with love!";
            btnCutCake.innerHTML = "<span>🍰</span> Slice Again!";
            showToast("🍰 Fresh cake slice for everyone!");
        } else {
            triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 40);
            cakeFeedback.textContent = "🍰 Seconds for everyone! There's plenty of cake!";
        }
    });

    // --- 4. SURPRISE GIFT FORTUNES ---
    const fortunes = [
        "🌟 May the upcoming year shower you with success, good health, and immense joy!",
        "🚀 You are officially leveling up! Get ready for extraordinary adventures.",
        "✨ Today is 100% all about celebrating YOU! Eat the cake, dance, and smile!",
        "💎 You're not getting older, you're getting bolder, wiser, and more magnificent.",
        "🎁 Surprise bonus: 365 days of good luck and golden memories unlocked!",
        "🌈 May your year be as colorful, fun, and radiant as this celebration!"
    ];
    let fortuneIdx = 0;

    surpriseGift.addEventListener('click', () => {
        fortuneIdx = (fortuneIdx + 1) % fortunes.length;
        if (window.birthdayAudio) window.birthdayAudio.playCelebrationFanfare();
        surpriseGift.style.transform = 'scale(1.3) rotate(15deg)';
        setTimeout(() => {
            surpriseGift.style.transform = 'scale(1) rotate(0deg)';
        }, 250);
        giftFortuneText.textContent = fortunes[fortuneIdx];
        triggerConfettiBurst(window.innerWidth * 0.7, window.innerHeight * 0.65, 40);
    });

    // --- 5. CONFETTI PARTICLE SYSTEM (Canvas) ---
    const confettiCtx = celebrationCanvas.getContext('2d');
    let confettiParticles = [];
    const confettiColors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#fbbf24', '#f97316', '#ffffff'];

    function resizeCanvases() {
        celebrationCanvas.width = window.innerWidth;
        celebrationCanvas.height = window.innerHeight;
        balloonCanvas.width = window.innerWidth;
        balloonCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvases);
    resizeCanvases();

    class ConfettiParticle {
        constructor(x, y, vx, vy) {
            this.x = x;
            this.y = y;
            this.vx = vx || (Math.random() * 12 - 6);
            this.vy = vy || (Math.random() * -12 - 4);
            this.size = Math.random() * 8 + 6;
            this.color = confettiColors[Math.floor(Math.random() * confettiColors.length)];
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 8 - 4;
            this.gravity = 0.22;
            this.friction = 0.985;
            this.opacity = 1;
            this.shape = Math.random() > 0.4 ? 'rect' : 'circle';
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rotation += this.rotationSpeed;
            if (this.vy > 2) {
                this.opacity -= 0.007;
            }
        }

        draw(ctx) {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;

            if (this.shape === 'rect') {
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function triggerConfettiBurst(x, y, count = 60) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 14 + 3;
            confettiParticles.push(
                new ConfettiParticle(
                    x,
                    y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed - 5
                )
            );
        }
    }

    function triggerMassiveConfetti() {
        // Double cannon from left and right bottom
        for (let i = 0; i < 90; i++) {
            confettiParticles.push(new ConfettiParticle(
                window.innerWidth * 0.1,
                window.innerHeight * 0.95,
                Math.random() * 10 + 4,
                Math.random() * -18 - 8
            ));
            confettiParticles.push(new ConfettiParticle(
                window.innerWidth * 0.9,
                window.innerHeight * 0.95,
                Math.random() * -10 - 4,
                Math.random() * -18 - 8
            ));
        }
    }

    // Sparkle trail on click / move
    window.addEventListener('click', (e) => {
        // Add subtle 8-particle burst anywhere the user clicks
        if (!e.target.closest('.entrance-overlay') && !e.target.closest('.modal-content')) {
            for (let i = 0; i < 8; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1;
                confettiParticles.push(
                    new ConfettiParticle(e.clientX, e.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed)
                );
            }
        }
    });

    // --- 6. RISING BALLOON PHYSICS & TAP-TO-POP ---
    const balloonCtx = balloonCanvas.getContext('2d');
    let balloons = [];
    const balloonPalette = [
        { main: '#f43f5e', dark: '#be123c', shine: '#fda4af' },
        { main: '#ec4899', dark: '#9d174d', shine: '#fbcfe8' },
        { main: '#8b5cf6', dark: '#5b21b6', shine: '#ddd6fe' },
        { main: '#38bdf8', dark: '#0284c7', shine: '#bae6fd' },
        { main: '#fbbf24', dark: '#b45309', shine: '#fef08a' },
        { main: '#10b981', dark: '#047857', shine: '#a7f3d0' }
    ];

    class Balloon {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.radiusX = Math.random() * 12 + 26; // Width radius
            this.radiusY = this.radiusX * 1.25;    // Height radius
            this.x = Math.random() * (balloonCanvas.width - 100) + 50;
            this.y = initial
                ? Math.random() * balloonCanvas.height
                : balloonCanvas.height + this.radiusY + 40;
            this.speedY = Math.random() * 0.9 + 0.8;
            this.colorObj = balloonPalette[Math.floor(Math.random() * balloonPalette.length)];
            this.swingOffset = Math.random() * Math.PI * 2;
            this.swingSpeed = Math.random() * 0.02 + 0.015;
            this.stringLength = this.radiusY * 1.8;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.swingOffset) * 0.6;
            this.swingOffset += this.swingSpeed;

            // Recycle balloon if goes off top
            if (this.y < -this.radiusY - this.stringLength - 10) {
                this.reset(false);
            }
        }

        draw(ctx) {
            ctx.save();

            // Balloon Body
            ctx.beginPath();
            ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);

            // 3D Gradient shading
            const grad = ctx.createRadialGradient(
                this.x - this.radiusX * 0.35,
                this.y - this.radiusY * 0.35,
                this.radiusX * 0.1,
                this.x,
                this.y,
                this.radiusY
            );
            grad.addColorStop(0, this.colorObj.shine);
            grad.addColorStop(0.4, this.colorObj.main);
            grad.addColorStop(1, this.colorObj.dark);

            ctx.fillStyle = grad;
            ctx.shadowColor = 'rgba(0,0,0,0.25)';
            ctx.shadowBlur = 10;
            ctx.fill();

            // Balloon Knot
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.moveTo(this.x - 4, this.y + this.radiusY);
            ctx.lineTo(this.x + 4, this.y + this.radiusY);
            ctx.lineTo(this.x, this.y + this.radiusY + 6);
            ctx.closePath();
            ctx.fillStyle = this.colorObj.dark;
            ctx.fill();

            // Balloon String
            ctx.beginPath();
            ctx.moveTo(this.x, this.y + this.radiusY + 6);
            const wave = Math.sin(this.swingOffset) * 12;
            ctx.bezierCurveTo(
                this.x + wave,
                this.y + this.radiusY + 25,
                this.x - wave,
                this.y + this.radiusY + 45,
                this.x,
                this.y + this.radiusY + this.stringLength
            );
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.lineWidth = 1.2;
            ctx.stroke();

            ctx.restore();
        }

        isHit(px, py) {
            // Distance check with ellipse tolerance
            const dx = (px - this.x) / this.radiusX;
            const dy = (py - this.y) / this.radiusY;
            return (dx * dx + dy * dy) <= 1.1;
        }
    }

    // Initialize 10 floating balloons
    for (let i = 0; i < 10; i++) {
        balloons.push(new Balloon());
    }

    // Tap to pop balloon
    balloonCanvas.addEventListener('pointerdown', (e) => {
        const rect = balloonCanvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            if (b.isHit(px, py)) {
                // Popped!
                if (window.birthdayAudio) window.birthdayAudio.playPopSound();
                triggerConfettiBurst(b.x, b.y, 35);

                poppedBalloons++;
                poppedCountEl.textContent = poppedBalloons;

                const popCheers = ["POP! 🎈", "Awesome! ✨", "Sparkle! 💫", "Yass! 🎉", "Boom! 🥳"];
                const cheer = popCheers[Math.floor(Math.random() * popCheers.length)];
                showToast(`${cheer} (+1 balloon)`);

                b.reset(false);
                break;
            }
        }
    });

    // --- 7. MAIN ANIMATION LOOP ---
    function animationLoop() {
        // Clear canvases
        confettiCtx.clearRect(0, 0, celebrationCanvas.width, celebrationCanvas.height);
        balloonCtx.clearRect(0, 0, balloonCanvas.width, balloonCanvas.height);

        // Render & update balloons
        balloons.forEach(b => {
            b.update();
            b.draw(balloonCtx);
        });

        // Render & update confetti
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const p = confettiParticles[i];
            p.update();
            p.draw(confettiCtx);
            if (p.opacity <= 0 || p.y > celebrationCanvas.height + 50) {
                confettiParticles.splice(i, 1);
            }
        }

        // Random subtle ambient confetti drop
        if (Math.random() < 0.06 && entranceOverlay.classList.contains('hidden')) {
            confettiParticles.push(new ConfettiParticle(
                Math.random() * celebrationCanvas.width,
                -20,
                (Math.random() - 0.5) * 2,
                Math.random() * 2 + 1
            ));
        }

        requestAnimationFrame(animationLoop);
    }

    // Run animation
    animationLoop();
    initPersonalization();
});
