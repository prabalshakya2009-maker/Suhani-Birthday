/**
 * ===================================================================
 * HAPPY BIRTHDAY CELEBRATION MASTER ENGINE
 * Next-Generation Interactive Celebration Web Application
 * Features:
 * 1. Procedural Web Audio Synth & SFX integration
 * 2. Real-Life Microphone Candle Blowing (Breath Detection)
 * 3. Dual Particle Engine: Confetti, Themed Emojis, Name Letter Flakes & Aerial Fireworks
 * 4. Realistic Floating Balloon Physics with Heart/Star/Classic Shapes & Tap-to-Pop
 * 5. Animated Golden Cake Knife & Detachable Cream Slice Cutting
 * 6. Keepsake Vintage Polaroid Memory Frame with Photo Upload & Avatar Cycler
 * 7. 3D Tilt Card Micro-Interactions & Fairy Dust Cursor Sparkle Trails
 * 8. Dynamic URL Sharing & High-Contrast Multi-Theme Engine
 * ===================================================================
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
    const volumeSlider = document.getElementById('volumeSlider');
    const btnMute = document.getElementById('btnMute');
    const btnThemeToggle = document.getElementById('btnThemeToggle');
    const btnCustomize = document.getElementById('btnCustomize');
    const customizeModal = document.getElementById('customizeModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const cakeSection = document.getElementById('cakeSection');
    const cakeStage = document.querySelector('.cake-stage');
    const btnBlowCandles = document.getElementById('btnBlowCandles');
    const btnMicBlow = document.getElementById('btnMicBlow');
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

    // New Controls & Elements
    const btnSparklerToggle = document.getElementById('btnSparklerToggle');
    const btnBlastConfetti = document.getElementById('btnBlastConfetti');
    const polaroidStickerOverlay = document.getElementById('polaroidStickerOverlay');
    const btnChangeFrame = document.getElementById('btnChangeFrame');
    const btnDownloadCard = document.getElementById('btnDownloadCard');
    const cardExportCanvas = document.getElementById('cardExportCanvas');
    const balloonComboBadge = document.getElementById('balloonComboBadge');
    const bestStreakEl = document.getElementById('bestStreak');
    const stickerBtns = document.querySelectorAll('.sticker-btn');
    const presetPills = document.querySelectorAll('.preset-pill');

    // Polaroid Elements
    const polaroidCard = document.getElementById('polaroidCard');
    const polaroidEmoji = document.getElementById('polaroidEmoji');
    const polaroidImg = document.getElementById('polaroidImg');
    const btnChangeAvatar = document.getElementById('btnChangeAvatar');
    const photoUpload = document.getElementById('photoUpload');

    // State Variables
    let poppedBalloons = 0;
    let areCandlesBlown = false;
    let cakeCut = false;
    const themes = ['galaxy', 'rosegold', 'carnival'];
    let currentThemeIdx = 0;
    let toastTimer = null;
    let isMicListening = false;
    let micStream = null;
    let micAnalyser = null;
    let micAnimId = null;

    // Advanced Celebratory Features State
    let isSparklerActive = false;
    let isMouseDown = false;
    let lastSparklerSoundTime = 0;
    let comboCount = 0;
    let lastPopTime = 0;
    let comboBadgeTimer = null;
    let bestStreak = parseInt(localStorage.getItem('birthday_best_streak') || '0', 10);
    const frameStyles = ['', 'frame-gold', 'frame-neon', 'frame-blossom'];
    let currentFrameIdx = 0;
    let currentSticker = '';

    const avatars = ['👑', '🎂', '🥳', '💖', '🦄', '🐱', '⭐', '🎈', '🍰'];
    let currentAvatarIdx = 0;

    // --- 1. PERSONALIZATION & URL PARSING ---
    function initPersonalization() {
        const params = new URLSearchParams(window.location.search);
        const name = params.get('name') || 'Bestie';
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

        // Dynamic Document Title
        document.title = `🎉 Happy Birthday, ${name}! 🎂✨`;

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
        inputName.value = name !== 'Bestie' ? name : '';
        inputAge.value = age;
        inputSender.value = from !== 'With Love, Everyone' ? from : '';
        inputMessage.value = msg;
        selectTheme.value = theme;

        // Best streak restoration
        if (bestStreakEl) bestStreakEl.textContent = bestStreak;

        // Check local saved Polaroid photo & sticker
        try {
            const savedPhoto = localStorage.getItem('birthday_star_photo');
            if (savedPhoto && polaroidImg) {
                polaroidImg.src = savedPhoto;
                polaroidImg.style.display = 'block';
                if (polaroidEmoji) polaroidEmoji.style.display = 'none';
            }
            const savedSticker = localStorage.getItem('birthday_sticker');
            if (savedSticker && polaroidStickerOverlay) {
                currentSticker = savedSticker;
                polaroidStickerOverlay.textContent = savedSticker;
                polaroidStickerOverlay.classList.add('active');
            }
        } catch (e) {
            // LocalStorage fallback
        }

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
        try {
            const href = window.location.href ? window.location.href.split('?')[0].split('#')[0] : '';
            const isHttp = href.startsWith('http://') || href.startsWith('https://');
            const url = new URL(isHttp ? href : 'https://celebrate.local/index.html');

            const nameVal = inputName.value.trim();
            const ageVal = inputAge.value.trim();
            const senderVal = inputSender.value.trim();
            const msgVal = inputMessage.value.trim();
            const themeVal = selectTheme.value;

            if (nameVal) url.searchParams.set('name', nameVal);
            if (ageVal) url.searchParams.set('age', ageVal);
            if (senderVal) url.searchParams.set('from', senderVal);
            if (msgVal) url.searchParams.set('msg', msgVal);
            if (themeVal && themeVal !== 'galaxy') {
                url.searchParams.set('theme', themeVal);
            }

            shareLinkInput.value = isHttp ? url.toString() : `?${url.searchParams.toString()}`;
        } catch (err) {
            console.warn('URL generation fallback:', err);
        }
    }

    // Modal Events & Accessibility
    function openModal() {
        customizeModal.classList.add('active');
        document.body.classList.add('modal-open');
        updateShareLink();
        inputName.focus();
    }

    function closeModal() {
        customizeModal.classList.remove('active');
        document.body.classList.remove('modal-open');
    }

    btnCustomize.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);

    customizeModal.addEventListener('click', (e) => {
        if (e.target === customizeModal) {
            closeModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && customizeModal.classList.contains('active')) {
            closeModal();
        }
    });

    [inputName, inputAge, inputSender, inputMessage, selectTheme].forEach(input => {
        input.addEventListener('input', () => {
            updateShareLink();
            const activeName = inputName.value.trim() || 'Bestie';
            recipientNameEl.textContent = activeName;
            letterToEl.textContent = `Dearest ${activeName},`;
            letterBodyEl.textContent = inputMessage.value.trim() || 'Wishing you the happiest birthday!';
            letterSignatureEl.textContent = inputSender.value.trim() || 'With Love';
            document.title = `🎉 Happy Birthday, ${activeName}! 🎂✨`;

            if (inputAge.value.trim()) {
                ageBadgeEl.textContent = `✨ ${inputAge.value.trim()} Years Fabulous ✨`;
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
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareLinkInput.value).then(() => {
                showToast('💌 Shareable link copied to clipboard!');
            }).catch(() => {
                document.execCommand('copy');
                showToast('💌 Shareable link copied!');
            });
        } else {
            document.execCommand('copy');
            showToast('💌 Shareable link copied!');
        }
    });

    function showToast(msg) {
        if (toastTimer) {
            clearTimeout(toastTimer);
            toastTimer = null;
        }
        toastMsg.textContent = msg;
        toastMsg.classList.add('show');
        toastTimer = setTimeout(() => {
            toastMsg.classList.remove('show');
            toastTimer = null;
        }, 2800);
    }

    // Theme Toggle Button in Nav
    btnThemeToggle.addEventListener('click', () => {
        currentThemeIdx = (currentThemeIdx + 1) % themes.length;
        const nextTheme = themes[currentThemeIdx];
        applyTheme(nextTheme);
        selectTheme.value = nextTheme;
        updateShareLink();
        showToast(`Theme: ${nextTheme.toUpperCase()} ✨`);
    });

    // --- 2. ENTRANCE & AUDIO START ---
    btnOpenSurprise.addEventListener('click', async () => {
        entranceOverlay.classList.add('hidden');

        // Start Happy Birthday Music
        if (window.birthdayAudio) {
            await window.birthdayAudio.initContext();
            window.birthdayAudio.playBirthdaySong();
            window.birthdayAudio.playPartyPopperSound();
        }

        triggerMassiveConfetti();
        triggerFireworksDisplay(3);
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

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                window.birthdayAudio.setVolume(vol);
            });
        }

        btnMute.addEventListener('click', () => {
            const muted = window.birthdayAudio.toggleMute();
            btnMute.textContent = muted ? '🔇' : '🔊';
            showToast(muted ? 'Audio muted' : 'Audio unmuted');
        });
    }

    // Quick cheer pills with themed particle bursts
    document.querySelectorAll('.cheer-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            const cheerType = pill.getAttribute('data-cheer');
            if (window.birthdayAudio) {
                window.birthdayAudio.playBubbleSound();
                window.birthdayAudio.playCelebrationFanfare();
            }

            const rect = pill.getBoundingClientRect();
            const burstX = rect.left + rect.width / 2;
            const burstY = rect.top;

            if (cheerType === 'love') {
                triggerEmojiBurst(burstX, burstY, ['💖', '💕', '💗', '✨', '🥰']);
            } else if (cheerType === 'cake') {
                triggerEmojiBurst(burstX, burstY, ['🍰', '🧁', '🍓', '🎂', '🍭']);
            } else if (cheerType === 'cheers') {
                triggerEmojiBurst(burstX, burstY, ['🥂', '✨', '⭐', '🍾', '🎉']);
            } else if (cheerType === 'dance') {
                triggerEmojiBurst(burstX, burstY, ['🎵', '🎶', '💃', '🕺', '✨']);
            } else {
                triggerConfettiBurst(burstX, burstY, 70);
                triggerFirework(burstX, burstY - 80);
            }

            showToast(`Sent cheer: ${pill.textContent}! 🥳`);
        });
    });

    // --- 3. CAKE & CANDLE INTERACTIONS ---
    function extinguishAllCandles() {
        if (!areCandlesBlown) {
            areCandlesBlown = true;
            // Theatrical room dimming for authentic candlelight atmosphere
            document.body.classList.add('room-dimmed');
            candles.forEach(candle => candle.classList.add('blown'));

            if (window.birthdayAudio) window.birthdayAudio.playCandleBlowSound();
            cakeFeedback.textContent = "🌬️ Making a wish in the candlelight...";

            // Suspense pause in dimmed candlelight...
            setTimeout(() => {
                document.body.classList.remove('room-dimmed');
                if (window.birthdayAudio) window.birthdayAudio.playCelebrationFanfare();
                triggerMassiveConfetti();
                triggerFireworksDisplay(5);
                cakeFeedback.textContent = "✨ WHOOSH! Your wish has been granted! Happy Birthday! 🌟💖";
                btnBlowCandles.innerHTML = "<span>🔥</span> Relight Candles";
                btnBlowCandles.classList.remove('blow-btn');
                showToast("🌟 All candles out! Happy Birthday! ✨");
            }, 850);

            if (isMicListening) stopMicListening();
        } else {
            // Relight
            areCandlesBlown = false;
            document.body.classList.remove('room-dimmed');
            candles.forEach(candle => candle.classList.remove('blown'));
            if (window.birthdayAudio) window.birthdayAudio.playCelebrationFanfare();
            cakeFeedback.textContent = "🔥 The candles are glowing brightly! Make another wish! ✨";
            btnBlowCandles.innerHTML = "<span>🕯️</span> Make a Wish & Blow Candles";
            btnBlowCandles.classList.add('blow-btn');
            showToast("🔥 Candles relit with warm wishes!");
        }
    }

    btnBlowCandles.addEventListener('click', extinguishAllCandles);

    // Click & Keyboard on individual candle
    candles.forEach(candle => {
        function handleCandleToggle() {
            if (!candle.classList.contains('blown')) {
                candle.classList.add('blown');
                if (window.birthdayAudio) window.birthdayAudio.playCandleBlowSound();

                const remaining = document.querySelectorAll('.candle:not(.blown)').length;
                if (remaining === 0) {
                    areCandlesBlown = true;
                    btnBlowCandles.innerHTML = "<span>✨</span> Relight Candles";
                    btnBlowCandles.classList.remove('blow-btn');
                    setTimeout(() => {
                        if (window.birthdayAudio) window.birthdayAudio.playCelebrationFanfare();
                        triggerMassiveConfetti();
                        triggerFireworksDisplay(3);
                        cakeFeedback.textContent = "🌟 All candles are out! May your year ahead be pure magic! 🌟";
                    }, 300);
                } else {
                    cakeFeedback.textContent = `🌬️ ${remaining} candle${remaining > 1 ? 's' : ''} left! Keep blowing!`;
                }
            } else {
                candle.classList.remove('blown');
                areCandlesBlown = false;
                btnBlowCandles.innerHTML = "<span>🕯️</span> Make a Wish & Blow Candles";
                btnBlowCandles.classList.add('blow-btn');
            }
        }

        candle.addEventListener('click', handleCandleToggle);
        candle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCandleToggle();
            }
        });
    });

    // --- REAL-LIFE MICROPHONE BLOW DETECTION ---
    if (btnMicBlow) {
        btnMicBlow.addEventListener('click', () => {
            if (isMicListening) {
                stopMicListening();
            } else {
                startMicListening();
            }
        });
    }

    async function startMicListening() {
        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                showToast("🎤 Microphone access not supported in this browser.");
                return;
            }
            micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            const micAudioCtx = new AudioCtx();
            const source = micAudioCtx.createMediaStreamSource(micStream);
            micAnalyser = micAudioCtx.createAnalyser();
            micAnalyser.fftSize = 256;
            source.connect(micAnalyser);

            isMicListening = true;
            btnMicBlow.classList.add('listening');
            btnMicBlow.innerHTML = "<span>🛑</span> Stop Listening";
            cakeFeedback.textContent = "🎤 Listening... Blow into your microphone to extinguish candles!";
            showToast("🎤 Microphone active: Blow gently on your mic!");

            const dataArray = new Uint8Array(micAnalyser.frequencyBinCount);

            function checkBreath() {
                if (!isMicListening) return;
                micAnalyser.getByteFrequencyData(dataArray);

                // Calculate average volume energy
                let sum = 0;
                for (let i = 0; i < dataArray.length; i++) {
                    sum += dataArray[i];
                }
                const average = sum / dataArray.length;

                // Wind / Breath blowing produces wide-spectrum low-mid frequency rushing noise
                if (average > 65 && !areCandlesBlown) {
                    extinguishAllCandles();
                    stopMicListening();
                    return;
                }

                micAnimId = requestAnimationFrame(checkBreath);
            }

            checkBreath();
        } catch (err) {
            console.warn("Microphone access declined or failed:", err);
            showToast("🎤 Microphone permission was denied or unavailable.");
            stopMicListening();
        }
    }

    function stopMicListening() {
        isMicListening = false;
        if (btnMicBlow) {
            btnMicBlow.classList.remove('listening');
            btnMicBlow.innerHTML = "<span>🎤</span> Blow With Mic";
        }
        if (micAnimId) cancelAnimationFrame(micAnimId);
        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
            micStream = null;
        }
    }

    // Cut cake slice with animated knife slice & detachable cream piece
    btnCutCake.addEventListener('click', () => {
        if (cakeStage) cakeStage.classList.add('is-cutting');
        if (window.birthdayAudio) window.birthdayAudio.playSliceSound();

        setTimeout(() => {
            if (cakeStage) cakeStage.classList.remove('is-cutting');
            if (cakeSection) cakeSection.classList.add('is-cut');

            if (window.birthdayAudio) window.birthdayAudio.playPartyPopperSound();
            triggerConfettiBurst(window.innerWidth / 2, window.innerHeight * 0.45, 70);
            triggerFireworksDisplay(2);

            cakeFeedback.textContent = "🍰 A delicious strawberry cream slice is served with love!";
            btnCutCake.innerHTML = "<span>🍰</span> Slice Again!";
            showToast("🍰 Fresh cake slice served! Enjoy!");
        }, 500);
    });

    // --- 4. POLAROID CELEBRATION PHOTO & AVATAR CYCLER ---
    if (btnChangeAvatar) {
        btnChangeAvatar.addEventListener('click', () => {
            currentAvatarIdx = (currentAvatarIdx + 1) % avatars.length;
            if (polaroidEmoji) {
                polaroidEmoji.textContent = avatars[currentAvatarIdx];
                polaroidEmoji.style.display = 'block';
            }
            if (polaroidImg) polaroidImg.style.display = 'none';
            if (window.birthdayAudio) window.birthdayAudio.playBubbleSound();
            showToast(`Avatar updated: ${avatars[currentAvatarIdx]}`);
        });
    }

    if (photoUpload) {
        photoUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const imgData = event.target.result;
                if (polaroidImg) {
                    polaroidImg.src = imgData;
                    polaroidImg.style.display = 'block';
                }
                if (polaroidEmoji) polaroidEmoji.style.display = 'none';

                try {
                    localStorage.setItem('birthday_star_photo', imgData);
                } catch (err) {
                    // Quota
                }

                if (window.birthdayAudio) window.birthdayAudio.playPartyPopperSound();
                triggerConfettiBurst(window.innerWidth / 2, window.innerHeight / 2, 40);
                showToast("📸 Photo updated in celebration frame!");
            };
            reader.readAsDataURL(file);
        });
    }

    // Sticker Picker & Remover
    stickerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const sticker = btn.getAttribute('data-sticker');
            currentSticker = sticker;
            if (polaroidStickerOverlay) {
                polaroidStickerOverlay.textContent = sticker;
                polaroidStickerOverlay.classList.add('active');
            }
            try { localStorage.setItem('birthday_sticker', sticker); } catch (e) {}
            if (window.birthdayAudio) window.birthdayAudio.playBubbleSound();
            showToast(`Added sticker: ${sticker}! Click sticker to remove.`);
        });
    });

    if (polaroidStickerOverlay) {
        polaroidStickerOverlay.addEventListener('click', () => {
            currentSticker = '';
            polaroidStickerOverlay.classList.remove('active');
            polaroidStickerOverlay.textContent = '';
            try { localStorage.removeItem('birthday_sticker'); } catch (e) {}
            if (window.birthdayAudio) window.birthdayAudio.playBubbleSound();
            showToast("Sticker removed");
        });
    }

    // Frame Style Switcher
    if (btnChangeFrame) {
        btnChangeFrame.addEventListener('click', () => {
            polaroidCard.classList.remove('frame-gold', 'frame-neon', 'frame-blossom');
            currentFrameIdx = (currentFrameIdx + 1) % frameStyles.length;
            const nextFrame = frameStyles[currentFrameIdx];
            if (nextFrame) polaroidCard.classList.add(nextFrame);
            if (window.birthdayAudio) window.birthdayAudio.playBubbleSound();
            const frameNames = ["Classic Polaroid", "Golden Luxe", "Cyberpunk Neon", "Romantic Blossom"];
            showToast(`Frame: ${frameNames[currentFrameIdx]} ✨`);
        });
    }

    // Keepsake Card High-Res PNG Generator & Download
    if (btnDownloadCard) {
        btnDownloadCard.addEventListener('click', exportKeepsakeCard);
    }

    function exportKeepsakeCard() {
        if (!cardExportCanvas) return;
        const ctx = cardExportCanvas.getContext('2d');
        const w = cardExportCanvas.width; // 800
        const h = cardExportCanvas.height; // 960

        // 1. Festive Background Gradient based on theme
        const theme = selectTheme.value;
        const bgGrad = ctx.createLinearGradient(0, 0, w, h);
        if (theme === 'rosegold') {
            bgGrad.addColorStop(0, '#fff1f2');
            bgGrad.addColorStop(0.5, '#fecdd3');
            bgGrad.addColorStop(1, '#fda4af');
        } else if (theme === 'carnival') {
            bgGrad.addColorStop(0, '#0284c7');
            bgGrad.addColorStop(0.5, '#0369a1');
            bgGrad.addColorStop(1, '#0f172a');
        } else {
            bgGrad.addColorStop(0, '#1e1b4b');
            bgGrad.addColorStop(0.5, '#0f172a');
            bgGrad.addColorStop(1, '#030712');
        }
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Decorative background stars
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        for (let i = 0; i < 40; i++) {
            const sx = (i * 137.5) % w;
            const sy = (i * 223.7) % h;
            const sr = (i % 3) + 1;
            ctx.beginPath();
            ctx.arc(sx, sy, sr, 0, Math.PI * 2);
            ctx.fill();
        }

        // 2. Decorative Gold / Accent Frame Borders
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 4;
        ctx.strokeRect(25, 25, w - 50, h - 50);
        ctx.lineWidth = 1.5;
        ctx.strokeRect(33, 33, w - 66, h - 66);

        // Corner accents
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('✨', 48, 55);
        ctx.fillText('✨', w - 48, 55);
        ctx.fillText('✨', 48, h - 42);
        ctx.fillText('✨', w - 48, h - 42);

        // 3. Header Texts
        const name = recipientNameEl.textContent || 'Bestie';
        const ageText = ageBadgeEl.textContent ? ageBadgeEl.textContent.trim() : '';

        ctx.font = 'bold 20px "Outfit", sans-serif';
        ctx.fillStyle = '#fbbf24';
        ctx.textAlign = 'center';
        ctx.fillText('🎂 A SPECIAL BIRTHDAY CELEBRATION 🎂', w / 2, 75);

        ctx.font = 'bold 44px "Outfit", sans-serif';
        ctx.fillStyle = theme === 'rosegold' ? '#881337' : '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 8;
        ctx.fillText(`Happy Birthday, ${name}!`, w / 2, 130);
        ctx.shadowBlur = 0;

        if (ageText) {
            ctx.font = 'bold 18px "Outfit", sans-serif';
            ctx.fillStyle = '#f43f5e';
            ctx.fillText(ageText, w / 2, 160);
        }

        // 4. Center Polaroid Frame
        const pfX = (w - 280) / 2;
        const pfY = 185;
        const pfW = 280;
        const pfH = 340;

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = 'rgba(0,0,0,0.35)';
        ctx.shadowBlur = 18;
        ctx.fillRect(pfX, pfY, pfW, pfH);
        ctx.shadowBlur = 0;

        const photoBoxX = pfX + 16;
        const photoBoxY = pfY + 16;
        const photoBoxW = pfW - 32;
        const photoBoxH = 220;

        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH);

        // Draw photo or avatar
        if (polaroidImg && polaroidImg.style.display !== 'none' && polaroidImg.src) {
            try {
                ctx.drawImage(polaroidImg, photoBoxX, photoBoxY, photoBoxW, photoBoxH);
            } catch (e) {
                ctx.font = '80px sans-serif';
                ctx.fillText(polaroidEmoji.textContent || '👑', photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2 + 25);
            }
        } else {
            ctx.font = '84px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(polaroidEmoji.textContent || '👑', photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2);
        }

        // Draw sticker if present
        if (currentSticker) {
            ctx.font = '48px sans-serif';
            ctx.textAlign = 'right';
            ctx.textBaseline = 'alphabetic';
            ctx.fillText(currentSticker, photoBoxX + photoBoxW - 8, photoBoxY + 50);
        }

        // Polaroid Caption
        ctx.font = 'bold 28px "Caveat", cursive';
        ctx.fillStyle = '#1e1b4b';
        ctx.textAlign = 'center';
        ctx.fillText('✨ Star of the Day ✨', pfX + pfW / 2, pfY + pfH - 28);

        // 5. Heartfelt Wish Message Text
        const wishMsg = letterBodyEl.textContent || '';
        const sender = letterSignatureEl.textContent || 'With Love';

        ctx.font = 'italic 19px "Outfit", sans-serif';
        ctx.fillStyle = theme === 'rosegold' ? '#4c0519' : '#f8fafc';
        ctx.textAlign = 'center';

        function wrapText(context, text, x, y, maxWidth, lineHeight) {
            const words = text.split(' ');
            let line = '';
            let curY = y;
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n] + ' ';
                const metrics = context.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    context.fillText(line.trim(), x, curY);
                    line = words[n] + ' ';
                    curY += lineHeight;
                } else {
                    line = testLine;
                }
            }
            context.fillText(line.trim(), x, curY);
            return curY;
        }

        const lastY = wrapText(ctx, `"${wishMsg}"`, w / 2, 575, w - 160, 28);

        // Signature
        ctx.font = 'bold 32px "Caveat", cursive';
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(sender, w / 2, Math.max(lastY + 45, 830));

        ctx.font = '14px "Outfit", sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fillText('Created with Birthday Magic ✨ • Keep Shining', w / 2, h - 45);

        try {
            const dataUrl = cardExportCanvas.toDataURL('image/png');
            const a = document.createElement('a');
            const safeName = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
            a.download = `happy-birthday-${safeName}-keepsake.png`;
            a.href = dataUrl;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            if (window.birthdayAudio) window.birthdayAudio.playPartyPopperSound();
            showToast("📸 Keepsake Card saved to your device! ✨");
        } catch (err) {
            console.warn("Card export fallback:", err);
            showToast("Saved! Right-click image to save.");
        }
    }

    // Sparkler Wand & Confetti Cannon Buttons in Navbar
    if (btnSparklerToggle) {
        btnSparklerToggle.addEventListener('click', () => {
            isSparklerActive = !isSparklerActive;
            btnSparklerToggle.classList.toggle('active', isSparklerActive);
            document.body.classList.toggle('sparkler-active', isSparklerActive);
            if (window.birthdayAudio) window.birthdayAudio.playBubbleSound();
            showToast(isSparklerActive ? "✨ Sparkler Wand ON: Drag cursor or finger anywhere to paint sparks!" : "Sparkler Wand OFF");
        });
    }

    if (btnBlastConfetti) {
        btnBlastConfetti.addEventListener('click', () => {
            if (window.birthdayAudio) window.birthdayAudio.playPartyPopperSound();
            triggerMassiveConfetti();
            triggerFireworksDisplay(3);
            showToast("🎉 KABOOM! Confetti Cannon Fired! 🥳");
        });
    }

    // Quick Wish Template Chips in Customize Modal
    const wishPresets = {
        bestie: "To the one who knows all my secrets and still loves me unconditionally! Wishing you the happiest birthday filled with wild adventures, belly laughs, and endless happiness! 💖✨",
        sweet: "May your special day be overflowing with pure happiness, endless laughter, and all the sweetest memories! You bring so much joy and light to everyone around you. Here's to making this year your most unforgettable chapter yet! 🌸💖",
        funny: "Happy Birthday! Don't worry about getting older, you're still younger than you will be tomorrow! Remember: calories in birthday cake don't count today! Eat it all! 🎂😜",
        milestone: "Here's to celebrating another incredible year of you! May this milestone year unlock big dreams, new horizons, and boundless joy in everything you do. The future is yours! 🌟🚀",
        family: "Sending you the biggest hug, warmest wishes, and endless love on your birthday! Thank you for being such an extraordinary blessing in our lives. Happy Birthday! 👨‍👩‍👧💕"
    };

    presetPills.forEach(pill => {
        pill.addEventListener('click', () => {
            const type = pill.getAttribute('data-preset');
            if (wishPresets[type]) {
                inputMessage.value = wishPresets[type];
                inputMessage.dispatchEvent(new Event('input'));
                if (window.birthdayAudio) window.birthdayAudio.playBubbleSound();
                showToast(`Applied template: ${pill.textContent}! ✨`);
            }
        });
    });

    // --- 5. SURPRISE GIFT FORTUNES ---
    const fortunes = [
        "🌟 May the upcoming year shower you with success, good health, and immense joy!",
        "🚀 You are officially leveling up! Get ready for extraordinary adventures.",
        "✨ Today is 100% all about celebrating YOU! Eat the cake, dance, and smile!",
        "💎 You're not getting older, you're getting bolder, wiser, and more magnificent.",
        "🎁 Surprise bonus: 365 days of good luck and golden memories unlocked!",
        "🌈 May your year be as colorful, fun, and radiant as this celebration!",
        "🌸 Every path you walk this year will be lined with happiness and love!",
        "🎂 Unlimited cake calories pass unlocked for today only!"
    ];
    let fortuneIdx = 0;

    function unpackFortune() {
        fortuneIdx = (fortuneIdx + 1) % fortunes.length;
        if (window.birthdayAudio) window.birthdayAudio.playGiftSound();
        surpriseGift.textContent = '✨💎✨';
        surpriseGift.style.transform = 'scale(1.3) rotate(10deg)';
        setTimeout(() => {
            surpriseGift.style.transform = 'scale(1) rotate(0deg)';
            surpriseGift.textContent = '🎁';
        }, 400);
        giftFortuneText.textContent = fortunes[fortuneIdx];
        triggerConfettiBurst(window.innerWidth * 0.7, window.innerHeight * 0.65, 45);
        triggerFirework(window.innerWidth * 0.7, window.innerHeight * 0.5);
    }

    surpriseGift.addEventListener('click', unpackFortune);
    surpriseGift.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            unpackFortune();
        }
    });

    // --- 6. ADVANCED PARTICLE SYSTEM (Canvas: Confetti, Emojis, Letters & Fireworks) ---
    const confettiCtx = celebrationCanvas.getContext('2d');
    let confettiParticles = [];
    let fireworks = [];
    let floatingTexts = [];
    const confettiColors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#fbbf24', '#f97316', '#ffffff'];
    let dpr = window.devicePixelRatio || 1;

    function resizeCanvases() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = window.innerWidth;
        const h = window.innerHeight;

        celebrationCanvas.width = Math.floor(w * dpr);
        celebrationCanvas.height = Math.floor(h * dpr);
        celebrationCanvas.style.width = w + 'px';
        celebrationCanvas.style.height = h + 'px';

        balloonCanvas.width = Math.floor(w * dpr);
        balloonCanvas.height = Math.floor(h * dpr);
        balloonCanvas.style.width = w + 'px';
        balloonCanvas.style.height = h + 'px';

        confettiCtx.setTransform(1, 0, 0, 1, 0, 0);
        confettiCtx.scale(dpr, dpr);

        balloonCtx.setTransform(1, 0, 0, 1, 0, 0);
        balloonCtx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resizeCanvases);
    window.addEventListener('orientationchange', () => {
        setTimeout(resizeCanvases, 150);
    });

    // Particle 1: Confetti with occasional Name Letter Flakes
    class ConfettiParticle {
        constructor(x, y, vx, vy, letter = '') {
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
            this.letter = letter;
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

            if (this.letter) {
                ctx.font = `bold ${this.size * 1.5}px sans-serif`;
                ctx.fillStyle = this.color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.letter, 0, 0);
            } else if (this.shape === 'rect') {
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
            } else {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 2.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    // Particle 2: Themed Floating Emojis
    class EmojiParticle {
        constructor(x, y, emoji) {
            this.x = x;
            this.y = y;
            this.emoji = emoji;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 8 + 3;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed - 4;
            this.fontSize = Math.random() * 14 + 18;
            this.gravity = 0.16;
            this.friction = 0.98;
            this.opacity = 1;
            this.rotation = Math.random() * 40 - 20;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= 0.012;
        }

        draw(ctx) {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.font = `${this.fontSize}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.emoji, 0, 0);
            ctx.restore();
        }
    }

    // Particle 3: Fireworks Starburst
    class FireworkSpark {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 1.5;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.color = color;
            this.radius = Math.random() * 2.5 + 1.5;
            this.gravity = 0.08;
            this.friction = 0.96;
            this.opacity = 1;
            this.decay = Math.random() * 0.018 + 0.012;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= this.decay;
        }

        draw(ctx) {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.shadowColor = this.color;
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    // Particle 4: Floating Score Text
    class FloatingScoreText {
        constructor(x, y, text) {
            this.x = x;
            this.y = y;
            this.text = text;
            this.vy = -1.8;
            this.opacity = 1;
        }

        update() {
            this.y += this.vy;
            this.opacity -= 0.02;
        }

        draw(ctx) {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.font = 'bold 1.15rem "Outfit", sans-serif';
            ctx.fillStyle = '#fbbf24';
            ctx.shadowColor = 'rgba(0,0,0,0.6)';
            ctx.shadowBlur = 8;
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.x, this.y);
            ctx.restore();
        }
    }

    // Particle 5: Golden Sparkler Sizzling Sparks
    class SparklerSpark {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 7 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            const colors = ['#ffffff', '#fef08a', '#fbbf24', '#f59e0b', '#fb7185'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.size = Math.random() * 2.5 + 1.2;
            this.gravity = 0.12;
            this.friction = 0.94;
            this.opacity = 1;
            this.decay = Math.random() * 0.035 + 0.025;
        }

        update() {
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.opacity -= this.decay;
        }

        draw(ctx) {
            if (this.opacity <= 0) return;
            ctx.save();
            ctx.globalAlpha = Math.max(0, this.opacity);
            ctx.fillStyle = this.color;
            ctx.shadowColor = '#fbbf24';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    let sparklerSparks = [];

    function addSparklerPoint(x, y) {
        for (let i = 0; i < 6; i++) {
            sparklerSparks.push(new SparklerSpark(x, y));
        }
        const now = Date.now();
        if (now - lastSparklerSoundTime > 160) {
            lastSparklerSoundTime = now;
            if (window.birthdayAudio) window.birthdayAudio.playSparklerSound();
        }
    }

    function triggerConfettiBurst(x, y, count = 60) {
        const name = (inputName.value.trim() || 'BESTIE').toUpperCase();
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 14 + 3;
            // 1 out of 8 particles carries a letter of the birthday person's name!
            const letter = (Math.random() < 0.12 && name.length > 0)
                ? name[Math.floor(Math.random() * name.length)]
                : '';
            confettiParticles.push(
                new ConfettiParticle(
                    x,
                    y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed - 5,
                    letter
                )
            );
        }
    }

    function triggerEmojiBurst(x, y, emojiList, count = 22) {
        for (let i = 0; i < count; i++) {
            const em = emojiList[Math.floor(Math.random() * emojiList.length)];
            confettiParticles.push(new EmojiParticle(x, y, em));
        }
    }

    function triggerFirework(x, y) {
        if (window.birthdayAudio) window.birthdayAudio.playFireworkSound();
        const colors = ['#f43f5e', '#fbbf24', '#38bdf8', '#a855f7', '#34d399', '#ffffff'];
        const burstColor = colors[Math.floor(Math.random() * colors.length)];
        for (let i = 0; i < 48; i++) {
            fireworks.push(new FireworkSpark(x, y, burstColor));
        }
    }

    function triggerFireworksDisplay(count = 3) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const fx = Math.random() * (window.innerWidth * 0.7) + (window.innerWidth * 0.15);
                const fy = Math.random() * (window.innerHeight * 0.4) + (window.innerHeight * 0.15);
                triggerFirework(fx, fy);
            }, i * 350);
        }
    }

    function triggerMassiveConfetti() {
        for (let i = 0; i < 80; i++) {
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

    // Fairy dust cursor sparkles on move & Sparkler drawing
    window.addEventListener('pointerdown', (e) => {
        if (isSparklerActive && !e.target.closest('button, select, input, textarea, a, .candle, .surprise-gift-slot, .entrance-card, .modal-content, .polaroid-tools, .cake-stage')) {
            isMouseDown = true;
            addSparklerPoint(e.clientX, e.clientY);
        }
    });

    window.addEventListener('pointermove', (e) => {
        if (isSparklerActive && isMouseDown) {
            addSparklerPoint(e.clientX, e.clientY);
        } else if (Math.random() < 0.15 && !e.target.closest('.entrance-overlay')) {
            confettiParticles.push(
                new ConfettiParticle(e.clientX, e.clientY, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2)
            );
        }
    });

    window.addEventListener('touchmove', (e) => {
        if (isSparklerActive && e.touches && e.touches.length > 0) {
            const touch = e.touches[0];
            addSparklerPoint(touch.clientX, touch.clientY);
        }
    }, { passive: true });

    window.addEventListener('pointerup', () => {
        isMouseDown = false;
    });

    window.addEventListener('click', (e) => {
        if (!e.target.closest('.entrance-overlay') && !e.target.closest('.modal-content')) {
            for (let i = 0; i < 6; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1;
                confettiParticles.push(
                    new ConfettiParticle(e.clientX, e.clientY, Math.cos(angle) * speed, Math.sin(angle) * speed)
                );
            }
        }
    });

    // --- 7. RISING BALLOON PHYSICS WITH SHAPES & TAP-TO-POP ---
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
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            this.x = Math.random() * Math.max(100, screenW - 80) + 40;
            this.y = initial
                ? Math.random() * screenH
                : screenH + this.radiusY + 40;
            this.speedY = Math.random() * 0.9 + 0.8;
            this.colorObj = balloonPalette[Math.floor(Math.random() * balloonPalette.length)];
            this.swingOffset = Math.random() * Math.PI * 2;
            this.swingSpeed = Math.random() * 0.02 + 0.015;
            this.stringLength = this.radiusY * 1.8;
            // 20% of balloons are special Heart or Star balloons!
            this.type = Math.random() < 0.2 ? (Math.random() < 0.5 ? 'heart' : 'star') : 'oval';
            // 12% of balloons are Golden Jackpot Balloons!
            this.isGolden = Math.random() < 0.12;
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.swingOffset) * 0.6;
            this.swingOffset += this.swingSpeed;

            // Recycle balloon if it floats off top
            if (this.y < -this.radiusY - this.stringLength - 10) {
                this.reset(false);
            }
        }

        draw(ctx) {
            ctx.save();

            // Balloon Body
            if (this.type === 'heart') {
                // Heart Shaped Balloon
                ctx.save();
                ctx.translate(this.x, this.y);
                const s = this.radiusX / 28;
                ctx.scale(s, s);
                ctx.beginPath();
                ctx.moveTo(0, -10);
                ctx.bezierCurveTo(-25, -35, -50, 0, 0, 35);
                ctx.bezierCurveTo(50, 0, 25, -35, 0, -10);
                ctx.fillStyle = this.colorObj.main;
                ctx.shadowColor = 'rgba(0,0,0,0.25)';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.restore();
            } else if (this.type === 'star') {
                // Star Shaped Balloon
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.beginPath();
                const spikes = 5;
                const outer = this.radiusX * 1.1;
                const inner = this.radiusX * 0.55;
                for (let i = 0; i < spikes * 2; i++) {
                    const r = (i % 2 === 0) ? outer : inner;
                    const a = (i * Math.PI) / spikes - Math.PI / 2;
                    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
                }
                ctx.closePath();
                ctx.fillStyle = this.colorObj.main;
                ctx.shadowColor = 'rgba(0,0,0,0.25)';
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.restore();
            } else if (this.isGolden) {
                // Golden Jackpot Balloon
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);
                const grad = ctx.createRadialGradient(
                    this.x - this.radiusX * 0.35,
                    this.y - this.radiusY * 0.35,
                    this.radiusX * 0.1,
                    this.x,
                    this.y,
                    this.radiusY
                );
                grad.addColorStop(0, '#ffffff');
                grad.addColorStop(0.4, '#fbbf24');
                grad.addColorStop(0.8, '#f59e0b');
                grad.addColorStop(1, '#78350f');
                ctx.fillStyle = grad;
                ctx.shadowColor = '#fbbf24';
                ctx.shadowBlur = 18;
                ctx.fill();

                // Sparkle indicator on balloon
                ctx.fillStyle = '#ffffff';
                ctx.font = `${this.radiusX * 0.75}px sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('✨', this.x, this.y);
            } else {
                // 3D Shaded Oval Balloon
                ctx.beginPath();
                ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, Math.PI * 2);

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
            }

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
            const dx = (px - this.x) / this.radiusX;
            const dy = (py - this.y) / this.radiusY;
            return (dx * dx + dy * dy) <= 1.25;
        }
    }

    // Initialize 12 floating balloons
    for (let i = 0; i < 12; i++) {
        balloons.push(new Balloon());
    }

    // Global tap/click to pop balloon (non-blocking for interactive controls)
    window.addEventListener('pointerdown', (e) => {
        if (e.target.closest('button, select, input, textarea, a, .candle, .surprise-gift-slot, .entrance-card, .modal-content, .polaroid-tools, .polaroid-stickers-row, .cake-stage, .cheer-pill, .polaroid-photo')) {
            return;
        }

        const px = e.clientX;
        const py = e.clientY;

        for (let i = balloons.length - 1; i >= 0; i--) {
            const b = balloons[i];
            if (b.isHit(px, py)) {
                const now = Date.now();
                if (now - lastPopTime < 2400) {
                    comboCount++;
                } else {
                    comboCount = 1;
                }
                lastPopTime = now;

                if (comboCount > bestStreak) {
                    bestStreak = comboCount;
                    try { localStorage.setItem('birthday_best_streak', bestStreak); } catch(e){}
                    if (bestStreakEl) bestStreakEl.textContent = bestStreak;
                }

                if (balloonComboBadge) {
                    balloonComboBadge.textContent = `🔥 COMBO x${comboCount}!`;
                    balloonComboBadge.classList.add('show');
                    clearTimeout(comboBadgeTimer);
                    comboBadgeTimer = setTimeout(() => {
                        balloonComboBadge.classList.remove('show');
                    }, 2200);
                }

                if (window.birthdayAudio) {
                    window.birthdayAudio.playComboSound(comboCount);
                }

                if (b.isGolden) {
                    // Golden Jackpot Balloon!
                    poppedBalloons += 5;
                    poppedCountEl.textContent = poppedBalloons;
                    floatingTexts.push(new FloatingScoreText(b.x, b.y, '+50 ⭐ GOLDEN JACKPOT!'));
                    triggerConfettiBurst(b.x, b.y, 75);
                    triggerFirework(b.x, b.y);
                    if (window.birthdayAudio) window.birthdayAudio.playCelebrationFanfare();
                    showToast("🌟 GOLDEN JACKPOT BALLOON POPPED! (+50 pts) 👑");
                } else {
                    if (window.birthdayAudio) window.birthdayAudio.playPopSound();
                    triggerConfettiBurst(b.x, b.y, 40);

                    poppedBalloons++;
                    poppedCountEl.textContent = poppedBalloons;

                    // Floating score animation
                    const scoreText = b.type === 'heart' ? '+15 💖 POP!' : (b.type === 'star' ? '+20 ⭐ POP!' : '+10 🎈 POP!');
                    floatingTexts.push(new FloatingScoreText(b.x, b.y, scoreText));

                    const popCheers = ["POP! 🎈", "Awesome! ✨", "Sparkle! 💫", "Yass! 🎉", "Boom! 🥳"];
                    const cheer = popCheers[Math.floor(Math.random() * popCheers.length)];
                    showToast(`${cheer} (+1 balloon)`);
                }

                if (navigator.vibrate) {
                    try { navigator.vibrate(25); } catch (e) {}
                }

                if (comboCount === 5) {
                    showToast("🎈 5 IN A ROW! Combo Master! 🔥");
                    triggerFireworksDisplay(1);
                } else if (comboCount === 10) {
                    showToast("🏆 10 IN A ROW! CELEBRATION LEGEND! 👑");
                    triggerFireworksDisplay(3);
                }

                b.reset(false);
                break;
            }
        }
    });

    // --- 8. MAIN ANIMATION LOOP ---
    function animationLoop() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Clear canvases in CSS pixel space
        confettiCtx.clearRect(0, 0, w, h);
        balloonCtx.clearRect(0, 0, w, h);

        // Render & update balloons
        balloons.forEach(b => {
            b.update();
            b.draw(balloonCtx);
        });

        // Render & update confetti / emojis
        for (let i = confettiParticles.length - 1; i >= 0; i--) {
            const p = confettiParticles[i];
            p.update();
            p.draw(confettiCtx);
            if (p.opacity <= 0 || p.y > h + 50) {
                confettiParticles.splice(i, 1);
            }
        }

        // Render & update fireworks sparks
        for (let i = fireworks.length - 1; i >= 0; i--) {
            const f = fireworks[i];
            f.update();
            f.draw(confettiCtx);
            if (f.opacity <= 0) {
                fireworks.splice(i, 1);
            }
        }

        // Render & update sparkler wand sparks
        for (let i = sparklerSparks.length - 1; i >= 0; i--) {
            const s = sparklerSparks[i];
            s.update();
            s.draw(confettiCtx);
            if (s.opacity <= 0) {
                sparklerSparks.splice(i, 1);
            }
        }

        // Render & update floating score texts
        for (let i = floatingTexts.length - 1; i >= 0; i--) {
            const st = floatingTexts[i];
            st.update();
            st.draw(confettiCtx);
            if (st.opacity <= 0) {
                floatingTexts.splice(i, 1);
            }
        }

        // Ambient gentle confetti flutter
        if (Math.random() < 0.05 && entranceOverlay.classList.contains('hidden')) {
            confettiParticles.push(new ConfettiParticle(
                Math.random() * w,
                -20,
                (Math.random() - 0.5) * 2,
                Math.random() * 2 + 1
            ));
        }

        requestAnimationFrame(animationLoop);
    }

    // Initialize and run
    resizeCanvases();
    animationLoop();
    initPersonalization();
});
