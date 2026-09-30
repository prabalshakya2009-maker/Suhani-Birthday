# 🎉 Birthday Wishing Website with "Happy Birthday To You" Background Music 🎂

An interactive, responsive birthday celebration web application built with HTML5, CSS3, Web Audio API, and HTML5 Canvas.

## ✨ Features

- 🎵 **"Happy Birthday To You" Background Music**:
  - Procedurally synthesized polyphonic melody with harmonics, bassline, and chords using the **Web Audio API**.
  - 100% offline-ready with zero external audio file dependencies.
  - Multi-instrument styles: **🔔 Chime Music Box**, **🎹 Warm Piano**, **🎷 Sunset Lofi**, and **👾 8-Bit Party Synth**.
  - Floating player with animated equalizer bars, play/pause toggle, volume slider, and mute button.
  - Procedural sound effects for: Balloon pops, candle blowing breath swoosh, celebration fanfare, confetti poppers, knife cake slicing, gift fortune opening, sparkler sizzling, and combo chimes.
- 🎁 **Surprise Entrance Overlay**:
  - Beautiful gift unboxing intro ("Open Your Birthday Surprise") that gracefully respects modern browser audio autoplay policies.
- 🎂 **Interactive Birthday Cake & Room Atmosphere**:
  - Multi-tier cake with flickering candle flames and golden halo glow reflections.
  - **Theatrical Candle Blowout**: Clicking candles or blowing into your microphone dims the room lights into authentic candlelight suspense before exploding with fireworks and celebration fanfare!
  - **Real-Life Microphone Breath Detection**: Extinguish candles with your actual breath using the Web Audio Analyser!
  - **Cake Slice & Knife**: Animated golden cake knife glides into the cake, serving a delicious strawberry cream slice.
- ✨ **Interactive Golden Sparkler Wand**:
  - Toggle the Magic Sparkler in the navbar, then click and drag anywhere across the screen to paint brilliant, sizzling golden sparkler light trails with realistic flying sparks!
- 🎈 **Interactive Floating Balloons & Mini-Game**:
  - Physics-based balloons (Oval, Heart 💖, and Star ⭐ shapes) rising into the sky.
  - **Combo Streak Multiplier**: Pop balloons in quick succession for escalating combo multipliers (`x2`, `x3`, `x5`, `x10!`) with streak counter and milestone rewards!
  - **Golden Jackpot Balloons**: Shimmering gold balloons with radiant auras granting `+50 pts` and grand fireworks!
- 📸 **Keepsake Polaroid Photo Frame & Card Creator**:
  - Upload a personal photo or cycle celebratory avatars (👑, 🎂, 🥳, 💖, 🦄, 🐱, ⭐, 🎈, 🍰).
  - Add festive stickers (🥳 Party Hat, 👑 Crown, 🕶️ Sunglasses, 🎀 Bow, ⭐ Star).
  - 4 Designer Frame Styles: Classic Polaroid, Golden Luxe Foil, Cyberpunk Neon, and Romantic Blossom.
  - **💾 Download Keepsake Card**: Instant high-res PNG export generated via HTML5 Canvas that the recipient can save to their camera roll or Instagram stories!
- 🎊 **Confetti Cannon & Aerial Fireworks**:
  - Dual cannon bursts, letter flakes carrying the recipient's name, sparkling cursor trails, and multi-stage aerial fireworks.
- 💌 **Personalized Greeting Card & Fortune Box**:
  - Parchment greeting letter with customized recipient name, age badge, and personal message.
  - Interactive *"Lucky Birthday Fortune"* gift box that unpacks sweet compliments and fortune cards on click.
  - **Quick Wish Templates**: 1-click preset wish chips (Best Friend, Sweet & Radiant, Funny & Teasing, Big Milestone, Family Love) in the Customize modal.
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

---

## 🌐 Deploying to GitHub Pages (Step-by-Step)

This website has zero build steps and zero server dependencies, making it 100% plug-and-play on GitHub Pages:

### Step 1: Create a New GitHub Repository
1. Go to [GitHub.com](https://github.com) and click **New Repository**.
2. Name it (e.g., `birthday-wish` or `suhani-birthday`).
3. Set visibility to **Public** and do NOT initialize with a README (this repository already has one).
4. Click **Create repository**.

### Step 2: Push Your Code
Open your terminal (PowerShell or Git Bash) inside this project folder:

```bash
git init
git add .
git commit -m "feat: launch flawless interactive birthday celebration"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPOSITORY_NAME.git
git push -u origin main
```
*(Replace `YOUR_GITHUB_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub username and repository name).*

### Step 3: Turn on GitHub Pages
1. In your GitHub repository, click the **Settings** tab.
2. In the left sidebar, click **Pages**.
3. Under **Branch**, select **`main`** and **`/ (root)`**.
4. Click **Save**.
5. Within 30 to 60 seconds, GitHub will give you your live URL:
   `https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY_NAME/`

Enjoy your celebration! 🎉🎂✨
