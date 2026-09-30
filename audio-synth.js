/**
 * Happy Birthday Audio Synthesizer & Sound Effects Engine
 * Uses the Web Audio API to procedurally generate:
 * 1. "Happy Birthday To You" full polyphonic melody + harmony chords
 * 2. Celebration SFX: Balloon Pop, Candle Blow swoosh, Fanfare Chime, Confetti Pop
 * Works 100% offline, zero external audio asset dependency.
 */

class BirthdayAudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.volume = 0.65;
        this.currentStyle = 'musicbox'; // 'musicbox', 'piano', 'synth'
        this.masterGain = null;
        this.currentTimeout = null;
        this.noteTimeouts = [];
        this.tempo = 110; // BPM
        this.onPlayStateChange = null;
        this.songTimer = null;
        this.fadeTimer = null;
        this.songDuration = 45; // 45 seconds celebration playback timer

        // Frequencies for musical notes (Key of C Major)
        this.NOTE_FREQS = {
            'G3': 196.00, 'A3': 220.00, 'B3': 246.94,
            'C4': 261.63, 'D4': 293.66, 'E4': 329.63, 'F4': 349.23, 'G4': 392.00, 'A4': 440.00, 'B4': 493.88,
            'C5': 523.25, 'D5': 587.33, 'E5': 659.25, 'F5': 698.46, 'G5': 783.99, 'A5': 880.00, 'B5': 987.77,
            'C6': 1046.50
        };

        // Complete arrangement of "Happy Birthday To You"
        // [noteName, durationInBeats, chordName/bassNote]
        this.MELODY = [
            // Phrase 1: "Happy Birthday to you"
            { note: 'G4', dur: 0.75, bass: 'C4' },
            { note: 'G4', dur: 0.25 },
            { note: 'A4', dur: 1.0, bass: 'C4' },
            { note: 'G4', dur: 1.0 },
            { note: 'C5', dur: 1.0, bass: 'G3' },
            { note: 'B4', dur: 2.0, bass: 'G3' },

            // Phrase 2: "Happy Birthday to you"
            { note: 'G4', dur: 0.75, bass: 'G3' },
            { note: 'G4', dur: 0.25 },
            { note: 'A4', dur: 1.0, bass: 'G3' },
            { note: 'G4', dur: 1.0 },
            { note: 'D5', dur: 1.0, bass: 'C4' },
            { note: 'C5', dur: 2.0, bass: 'C4' },

            // Phrase 3: "Happy Birthday dear [Name]"
            { note: 'G4', dur: 0.75, bass: 'C4' },
            { note: 'G4', dur: 0.25 },
            { note: 'G5', dur: 1.0, bass: 'C4' },
            { note: 'E5', dur: 1.0, bass: 'E4' },
            { note: 'C5', dur: 1.0, bass: 'F4' },
            { note: 'B4', dur: 1.0, bass: 'F4' },
            { note: 'A4', dur: 1.75, bass: 'F4' },

            // Phrase 4: "Happy Birthday to you!"
            { note: 'F5', dur: 0.75, bass: 'F4' },
            { note: 'F5', dur: 0.25 },
            { note: 'E5', dur: 1.0, bass: 'C4' },
            { note: 'C5', dur: 1.0, bass: 'C4' },
            { note: 'D5', dur: 1.0, bass: 'G3' },
            { note: 'C5', dur: 2.5, bass: 'C4', chord: ['C4', 'E4', 'G4', 'C5'] }
        ];
    }

    // Initialize Web Audio Context (must be triggered by user interaction)
    async initContext() {
        if (!this.ctx) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return;
            this.ctx = new AudioContextClass();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);

            // Setup passive mobile unlock listener so audio resumes on user touch gestures
            if (typeof window !== 'undefined' && !this._mobileUnlockBound) {
                this._mobileUnlockBound = true;
                const unlockHandler = () => {
                    if (this.ctx && this.ctx.state === 'suspended') {
                        this.ctx.resume().catch(() => {});
                    }
                };
                ['touchstart', 'touchend', 'click', 'pointerdown'].forEach(evt => {
                    window.addEventListener(evt, unlockHandler, { passive: true });
                });
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            try {
                await this.ctx.resume();
            } catch (err) {
                console.warn('AudioContext resume deferred:', err);
            }
        }
    }

    setVolume(val) {
        this.volume = Math.max(0, Math.min(1, val));
        if (this.masterGain && this.ctx && !this.isMuted) {
            this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime, 0.05);
        }
        return this.isMuted;
    }

    setStyle(style) {
        this.currentStyle = style;
    }

    // Play a single harmonic note depending on instrument style
    playNote(freq, durationSec, timeOffset = 0, isBass = false, volumeScale = 1.0) {
        if (!this.ctx || !freq) return;

        const startTime = this.ctx.currentTime + timeOffset;
        const endTime = startTime + durationSec;

        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        // Extra harmonic oscillator for sparkle / richness
        let oscHarmonic = null;
        let harmGain = null;

        if (this.currentStyle === 'musicbox') {
            // Music Box / Celesta: Sine wave + bright chime harmonic + bell decay
            osc.type = isBass ? 'triangle' : 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            // Shimmering octave harmonic
            if (!isBass) {
                oscHarmonic = this.ctx.createOscillator();
                harmGain = this.ctx.createGain();
                oscHarmonic.type = 'sine';
                oscHarmonic.frequency.setValueAtTime(freq * 2, startTime);
                
                harmGain.gain.setValueAtTime(0.22 * volumeScale, startTime);
                // Ramp duration relative to startTime (fixed bug where endTime * 0.85 was in the past)
                harmGain.gain.exponentialRampToValueAtTime(0.0001, startTime + durationSec * 0.85);
                oscHarmonic.connect(harmGain);
                harmGain.connect(this.masterGain);
                oscHarmonic.start(startTime);
                oscHarmonic.stop(endTime + 0.2);
            }

            // Quick pluck attack & gentle ring decay
            const baseVol = (isBass ? 0.28 : 0.45) * volumeScale;
            noteGain.gain.setValueAtTime(0.001, startTime);
            noteGain.gain.linearRampToValueAtTime(baseVol, startTime + 0.015);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, endTime + 0.35);

        } else if (this.currentStyle === 'piano') {
            // Warm Acoustic Piano vibe
            osc.type = isBass ? 'triangle' : 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            oscHarmonic = this.ctx.createOscillator();
            harmGain = this.ctx.createGain();
            oscHarmonic.type = 'sine';
            oscHarmonic.frequency.setValueAtTime(freq * 3, startTime);

            harmGain.gain.setValueAtTime(0.1 * volumeScale, startTime);
            harmGain.gain.exponentialRampToValueAtTime(0.001, startTime + durationSec * 0.5);
            oscHarmonic.connect(harmGain);
            harmGain.connect(this.masterGain);
            oscHarmonic.start(startTime);
            oscHarmonic.stop(endTime + 0.1);

            const baseVol = (isBass ? 0.35 : 0.5) * volumeScale;
            noteGain.gain.setValueAtTime(0.001, startTime);
            noteGain.gain.linearRampToValueAtTime(baseVol, startTime + 0.02);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        } else if (this.currentStyle === 'lofi') {
            // Warm Lofi / Sunset Chill: Soft filtered triangle wave with gentle warmth
            osc.type = isBass ? 'sine' : 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(isBass ? 450 : 1200, startTime);

            const baseVol = (isBass ? 0.38 : 0.42) * volumeScale;
            noteGain.gain.setValueAtTime(0.001, startTime);
            noteGain.gain.linearRampToValueAtTime(baseVol, startTime + 0.035);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, endTime + 0.25);

            osc.connect(filter);
            filter.connect(noteGain);
            noteGain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(endTime + 0.3);
            return;

        } else {
            // Retro 8-Bit Party Synth: Square wave with micro-ramp attack to prevent speaker click
            osc.type = isBass ? 'triangle' : 'square';
            osc.frequency.setValueAtTime(freq, startTime);

            const baseVol = (isBass ? 0.2 : 0.25) * volumeScale;
            noteGain.gain.setValueAtTime(0.001, startTime);
            noteGain.gain.linearRampToValueAtTime(baseVol, startTime + 0.008);
            noteGain.gain.setValueAtTime(baseVol * 0.7, startTime + durationSec * 0.8);
            noteGain.gain.linearRampToValueAtTime(0.0001, endTime);
        }

        osc.connect(noteGain);
        noteGain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(endTime + 0.4);
    }

    // Start playing the Happy Birthday melody in loop
    playBirthdaySong() {
        this.initContext();
        if (this.masterGain && this.ctx && !this.isMuted) {
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        }
        if (this.isPlaying) return;

        this.isPlaying = true;
        if (this.onPlayStateChange) this.onPlayStateChange(true);

        // Auto-stop playback timer: plays for 45 seconds automatically and then stops
        this.clearSongTimer();

        // Musical fade out during final 2.5 seconds (at 42.5s -> 45s) for a gentle, elegant stop
        this.fadeTimer = setTimeout(() => {
            if (this.isPlaying && this.masterGain && this.ctx && !this.isMuted) {
                this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.9);
            }
        }, (this.songDuration - 2.5) * 1000);

        this.songTimer = setTimeout(() => {
            if (this.isPlaying) {
                this.pauseBirthdaySong();
            }
        }, this.songDuration * 1000);

        this.scheduleMelodyLoop();
    }

    scheduleMelodyLoop() {
        if (!this.isPlaying) return;

        this.clearTimeouts();
        const secondsPerBeat = 60 / this.tempo;
        let cumulativeTime = 0.2; // slight start breathing room

        this.MELODY.forEach((step, idx) => {
            const noteDuration = step.dur * secondsPerBeat;
            const playTime = cumulativeTime;

            const tId = setTimeout(() => {
                if (!this.isPlaying) return;
                const freq = this.NOTE_FREQS[step.note];
                if (freq) {
                    this.playNote(freq, noteDuration, 0, false, 1.0);
                }

                // Play bass note if specified
                if (step.bass && this.NOTE_FREQS[step.bass]) {
                    this.playNote(this.NOTE_FREQS[step.bass], noteDuration * 1.5, 0, true, 0.75);
                }

                // Final celebration flourish chord
                if (step.chord) {
                    step.chord.forEach((cNote, cIdx) => {
                        if (this.NOTE_FREQS[cNote]) {
                            this.playNote(this.NOTE_FREQS[cNote], noteDuration * 1.8, cIdx * 0.05, false, 0.6);
                        }
                    });
                }
            }, playTime * 1000);

            this.noteTimeouts.push(tId);
            cumulativeTime += noteDuration;
        });

        // Loop pause after full phrase
        const totalSongTime = cumulativeTime + 2.0; // 2 seconds celebratory pause before replay
        this.currentTimeout = setTimeout(() => {
            if (this.isPlaying) {
                this.scheduleMelodyLoop();
            }
        }, totalSongTime * 1000);
    }

    pauseBirthdaySong() {
        this.isPlaying = false;
        this.clearSongTimer();
        this.clearTimeouts();
        if (this.masterGain && this.ctx) {
            // Smooth quick fadeout on pause so ringing notes stop cleanly
            this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
        }
        if (this.onPlayStateChange) this.onPlayStateChange(false);
    }

    clearSongTimer() {
        if (this.songTimer) {
            clearTimeout(this.songTimer);
            this.songTimer = null;
        }
        if (this.fadeTimer) {
            clearTimeout(this.fadeTimer);
            this.fadeTimer = null;
        }
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pauseBirthdaySong();
        } else {
            this.playBirthdaySong();
        }
        return this.isPlaying;
    }

    clearTimeouts() {
        if (this.currentTimeout) {
            clearTimeout(this.currentTimeout);
            this.currentTimeout = null;
        }
        this.noteTimeouts.forEach(t => clearTimeout(t));
        this.noteTimeouts = [];
    }

    // --- CELEBRATION SOUND EFFECTS ---

    // 1. Balloon Pop Sound FX
    playPopSound() {
        this.initContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.07);

        gain.gain.setValueAtTime(0.7, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 0.08);

        // White noise burst for the snap
        const bufferSize = this.ctx.sampleRate * 0.05;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.6, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.05);

        noise.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(t);
    }

    // 2. Candle Blow Sound FX (realistic breath swoosh)
    playCandleBlowSound() {
        this.initContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        const duration = 0.85;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1);
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        // Bandpass filter to model human blowing breath
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, t);
        filter.frequency.exponentialRampToValueAtTime(300, t + duration);
        filter.Q.setValueAtTime(1.5, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.5, t + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(t);
    }

    // 3. Cheering / Chime Celebration Fanfare
    playCelebrationFanfare() {
        this.initContext();
        if (!this.ctx) return;

        const chordNotes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
        chordNotes.forEach((freq, idx) => {
            const t = this.ctx.currentTime + idx * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, t);

            gain.gain.setValueAtTime(0.001, t);
            gain.gain.linearRampToValueAtTime(0.35, t + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(t);
            osc.stop(t + 1.3);
        });
    }

    // 4. Confetti Party Cannon Whoosh & Pop
    playPartyPopperSound() {
        this.initContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        // Low thump
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.12);
        gain.gain.setValueAtTime(0.8, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.15);

        // Glitter chime
        setTimeout(() => {
            this.playCelebrationFanfare();
        }, 120);
    }

    // 5. Firework Rocket Launch & Explosion Sound FX
    playFireworkSound() {
        this.initContext();
        if (!this.ctx) return;

        const t = this.ctx.currentTime;
        // Launch whistle
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, t);
        osc.frequency.exponentialRampToValueAtTime(750, t + 0.3);

        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.18, t + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.32);

        // Burst & sparkle
        setTimeout(() => {
            if (!this.ctx) return;
            const tb = this.ctx.currentTime;
            const boomOsc = this.ctx.createOscillator();
            const boomGain = this.ctx.createGain();
            boomOsc.type = 'triangle';
            boomOsc.frequency.setValueAtTime(130, tb);
            boomOsc.frequency.exponentialRampToValueAtTime(35, tb + 0.28);

            boomGain.gain.setValueAtTime(0.65, tb);
            boomGain.gain.exponentialRampToValueAtTime(0.001, tb + 0.3);

            boomOsc.connect(boomGain);
            boomGain.connect(this.masterGain);
            boomOsc.start(tb);
            boomOsc.stop(tb + 0.32);
        }, 300);
    }

    // 6. Cake Slice Sound FX (Crisp whoosh + dessert plate ding)
    playSliceSound() {
        this.initContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(460, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.12);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.13);

        setTimeout(() => {
            if (!this.ctx) return;
            const tp = this.ctx.currentTime;
            const chime = this.ctx.createOscillator();
            const cGain = this.ctx.createGain();
            chime.type = 'sine';
            chime.frequency.setValueAtTime(1760, tp);
            cGain.gain.setValueAtTime(0.2, tp);
            cGain.gain.exponentialRampToValueAtTime(0.0001, tp + 0.6);
            chime.connect(cGain);
            cGain.connect(this.masterGain);
            chime.start(tp);
            chime.stop(tp + 0.65);
        }, 80);
    }

    // 7. Mystical Gift Box Chime (Arpeggiated magic)
    playGiftSound() {
        this.initContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, i) => {
            const tn = t + i * 0.055;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, tn);
            gain.gain.setValueAtTime(0.001, tn);
            gain.gain.linearRampToValueAtTime(0.25, tn + 0.015);
            gain.gain.exponentialRampToValueAtTime(0.0001, tn + 0.5);
            osc.connect(gain);
            gain.connect(this.masterGain);
            osc.start(tn);
            osc.stop(tn + 0.55);
        });
    }

    // 8. Balloon Combo Pitch FX
    playComboSound(level = 1) {
        this.initContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const baseFreq = Math.min(1300, 440 + level * 80);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.linearRampToValueAtTime(baseFreq * 1.5, t + 0.12);
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.18);
    }

    // 9. Sparkler Sizzle / Crackle Sound FX
    playSparklerSound() {
        this.initContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.05);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.25;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3200, t);
        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        noise.start(t);
    }

    // 10. Crisp Bubble / Waterdrop Pop for Buttons & Stickers
    playBubbleSound() {
        this.initContext();
        if (!this.ctx) return;
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, t);
        osc.frequency.exponentialRampToValueAtTime(1400, t + 0.05);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(t);
        osc.stop(t + 0.07);
    }
}

// Export as global
window.birthdayAudio = new BirthdayAudioEngine();
