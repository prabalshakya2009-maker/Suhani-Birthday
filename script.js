const musicToggle = document.querySelector("#musicToggle");
const musicLabel = document.querySelector("#musicLabel");

let audioContext;
let gainNode;
let melodyTimer;
let noteIndex = 0;

// A short, synthesized melody keeps the page self-contained and starts only after a click.
const melody = [
  [261.63, 0.28], [261.63, 0.16], [293.66, 0.55], [261.63, 0.55],
  [349.23, 0.55], [329.63, 1.05], [261.63, 0.28], [261.63, 0.16],
  [293.66, 0.55], [261.63, 0.55], [392.0, 0.55], [349.23, 1.05],
  [261.63, 0.28], [261.63, 0.16], [523.25, 0.55], [440.0, 0.55],
  [349.23, 0.55], [329.63, 0.55], [293.66, 1.05],
];

function playNote() {
  if (!audioContext || audioContext.state !== "running") return;
  const [frequency, duration] = melody[noteIndex];
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  envelope.gain.setValueAtTime(0.0001, audioContext.currentTime);
  envelope.gain.exponentialRampToValueAtTime(0.12, audioContext.currentTime + 0.02);
  envelope.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration - 0.03);
  oscillator.connect(envelope).connect(gainNode);
  oscillator.start();
  oscillator.stop(audioContext.currentTime + duration);
  noteIndex = (noteIndex + 1) % melody.length;
  melodyTimer = window.setTimeout(playNote, duration * 1000 + 55);
}

async function toggleMusic() {
  if (!audioContext) {
    audioContext = new AudioContext();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0.7;
    gainNode.connect(audioContext.destination);
  }

  if (audioContext.state === "running") {
    await audioContext.suspend();
    window.clearTimeout(melodyTimer);
    musicToggle.classList.remove("is-playing");
    musicToggle.setAttribute("aria-pressed", "false");
    musicLabel.textContent = "Play birthday song";
    return;
  }

  await audioContext.resume();
  musicToggle.classList.add("is-playing");
  musicToggle.setAttribute("aria-pressed", "true");
  musicLabel.textContent = "Pause birthday song";
  playNote();
}

musicToggle.addEventListener("click", toggleMusic);
