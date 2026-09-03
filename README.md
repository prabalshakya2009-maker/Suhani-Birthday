# 🎉 Birthday Wishing Website with "Happy Birthday To You" Background Music 🎂

An interactive, responsive birthday celebration web application built with HTML5, CSS3, Web Audio API, and HTML5 Canvas.

## ✨ Features

- 🎵 **"Happy Birthday To You" Background Music**:
  - Procedurally synthesized polyphonic melody with harmonics, bassline, and chords using the **Web Audio API**.
  - 100% offline-ready with zero external audio file dependencies.
  - Multi-instrument styles: **🔔 Chime Music Box**, **🎹 Warm Piano**, and **👾 8-Bit Party Synth**.
  - Floating player with animated equalizer bars, play/pause toggle, volume/mute controls.
  - Sound effects for: Balloon pop, candle blowing, celebration fanfare, and confetti popper.
- 🎁 **Surprise Entrance Overlay**:
  - Beautiful gift unboxing intro ("Open Your Birthday Surprise") that gracefully respects modern browser audio autoplay policies.
- 🎂 **Interactive Birthday Cake**:
  - Multi-tier cake with flickering candle flames.
  - Interactive candle blowing: click individual candles or tap *"Make a Wish & Blow Candles"* to blow them out with curling smoke particles, cheer sound effects, and confetti cannons!
  - *"Cut a Slice"* interaction.
- 🎈 **Interactive Floating Balloons**:
  - Physics-based balloons rising into the sky.
  - Click or tap any balloon to pop it with realistic pop SFX, sparkling burst, and live score counter!
- 🎊 **Canvas Confetti Particle System**:
  - Dual cannon bursts, sparkling cursor trails, and ambient confetti showers.
- 💌 **Personalized Greeting Card & Fortune Box**:
  - Parchment greeting letter with customized recipient name, age badge, and personal message.
  - Interactive *"Lucky Birthday Fortune"* gift box that unpacks sweet compliments on click.
- 🎨 **Multi-Theme Support**:
  - **Midnight Galaxy** (Neon, deep violet, and gold)
  - **Rose Gold & Champagne** (Luxe romantic festive vibes)
  - **Party Carnival** (Vibrant electric sky and confetti)
- 🔗 **Instant Shareable Link Generator**:
  - Customize the recipient's name, age, message, and theme live via the *"Customize Wish"* modal.
  - Generates a shareable URL (e.g. `?name=Sophia&age=21&from=Alex&theme=rosegold`) that can be copied with one click to send via WhatsApp, Messenger, or Email.

---

## 🚀 How to Run Locally

### Option 1: Direct in Browser
Simply double-click `index.html` or right-click and choose **"Open with Chrome / Edge / Firefox"**.

### Option 2: Using a Local HTTP Server
Run any local server from this directory:

```bash
# Using Python
python -m http.server 8080

# Or using npx serve
npx serve .
```

Then visit [http://localhost:8080](http://localhost:8080) in your browser.

---

## 💌 URL Customization Parameters

You can customize the celebration directly via URL parameters:

| Parameter | Description | Example |
| :--- | :--- | :--- |
| `name` | Recipient's name | `?name=Jessica` |
| `age` | Age or milestone | `?age=25` |
| `from` | Sender's name / sign-off | `?from=Mom%20%26%20Dad` |
| `msg` | Heartfelt wish message | `?msg=Wishing+you+the+happiest+birthday!` |
| `theme` | Theme (`galaxy`, `rosegold`, `carnival`) | `?theme=rosegold` |

**Example full link**:
```
index.html?name=Alex&age=21&from=David&theme=galaxy
```
