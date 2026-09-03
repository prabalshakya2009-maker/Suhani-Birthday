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
        this.loop = true;
        this.tempo = 110; // BPM
        this.onPlayStateChange = null;

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
    initContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
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
                harmGain.gain.exponentialRampToValueAtTime(0.0001, endTime * 0.85);
                oscHarmonic.connect(harmGain);
                harmGain.connect(this.masterGain);
                oscHarmonic.start(startTime);
                oscHarmonic.stop(endTime);
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
            oscHarmonic.stop(endTime);

            const baseVol = (isBass ? 0.35 : 0.5) * volumeScale;
            noteGain.gain.setValueAtTime(0.001, startTime);
            noteGain.gain.linearRampToValueAtTime(baseVol, startTime + 0.02);
            noteGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

        } else {
            // Retro 8-Bit Party Synth: Square wave with vibrato
            osc.type = isBass ? 'triangle' : 'square';
            osc.frequency.setValueAtTime(freq, startTime);

            const baseVol = (isBass ? 0.2 : 0.25) * volumeScale;
            noteGain.gain.setValueAtTime(baseVol, startTime);
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
        if (this.isPlaying) return;

        this.isPlaying = true;
        if (this.onPlayStateChange) this.onPlayStateChange(true);

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
            if (this.isPlaying && this.loop) {
                this.scheduleMelodyLoop();
            }
        }, totalSongTime * 1000);
    }

    pauseBirthdaySong() {
        this.isPlaying = false;
        this.clearTimeouts();
        if (this.onPlayStateChange) this.onPlayStateChange(false);
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
}

// Export as global
window.birthdayAudio = new BirthdayAudioEngine();
