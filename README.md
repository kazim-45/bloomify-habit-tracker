# 🌱 Bloomify — Habit Tracker

> *Grow better habits, one day at a time.*

Bloomify is a beautiful, lightweight habit tracker that turns your daily routines into something alive. Every habit you complete waters a virtual plant. Watch it grow from a tiny seed all the way to full bloom as you build consistency.

![Bloomify Preview](https://img.shields.io/badge/status-live-brightgreen?style=flat-square) ![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

---

## ✨ Features

- **🌿 Living Plant Visual** — Your plant grows through 5 stages (seed → sprout → small → medium → full bloom) based on how many habits you complete each day
- **💧 Water Drop Animations** — Satisfying droplet and sparkle effects play every time you check off a habit
- **🔥 Streak Tracking** — Tracks your daily consistency streak with a glowing badge at 3+ days
- **📊 Progress Ring** — A circular progress indicator shows your daily completion percentage at a glance
- **✅ Full Habit CRUD** — Add, complete, and delete habits with smooth animations
- **💾 Persistent Storage** — All habits and streaks are saved to `localStorage`, so your data survives page refreshes
- **🔄 Daily Auto-Reset** — Habits automatically reset each new day, and your streak updates accordingly
- **📱 Responsive Design** — Works cleanly on both mobile and desktop
- **🎨 Dark Nature Theme** — A carefully crafted dark green palette that's easy on the eyes

---

## 📸 Plant Growth Stages

| Progress | Stage | Visual |
|----------|-------|--------|
| No habits added | Waiting | Empty pot |
| 0% complete | Seed | 🌱 |
| 1–25% complete | Sprout | 🌱 |
| 26–50% complete | Small Plant | 🌿 |
| 51–99% complete | Medium Plant | 🪴 |
| 100% complete | Full Bloom | 🌸 |

---

## 🚀 Getting Started

Bloomify is a pure front-end app — no installations, no dependencies, no build tools.

### Run Locally

```bash
git clone https://github.com/kazim-45/bloomify-habit-tracker.git
cd bloomify-habit-tracker
```

Then simply open `index.html` in your browser. That's it.

> **Tip:** Use a local server like VS Code's **Live Server** extension for the best experience.

Or simply go to `https://kazim-45.github.io/bloomify-habit-tracker` to access immediately.
---

## 🗂 Project Structure

```
bloomify-habit-tracker/
├── index.html      # App markup and SVG plant stages
├── style.css       # Design system, animations, responsive layout
└── app.js          # All app logic — habits, streaks, plant, storage
```

---

## 🧠 How It Works

### Habit Logic
Habits are stored in `localStorage` as a JSON array. Each habit has an `id`, `name`, and `completed` boolean. The plant stage is recalculated on every change by dividing completed habits by total habits.

### Streak System
On the first load of each new day, the app checks if any habits were completed the previous day. If yes, the streak increments. If not (and habits existed), the streak resets to zero. The streak badge glows after 3+ consecutive days.

### Plant Stages
The SVG plant is built with 5 layered `<g>` groups (stages 0–4). Each stage is hidden by default (`opacity: 0`) and made visible via a CSS class based on the current completion ratio.

### Animations
- **Particles** — 20 floating ambient dots created dynamically on load
- **Water drops** — 4 drops spawned on each habit completion
- **Sparkles** — 8 radial sparkle elements burst outward on completion
- **Progress ring** — SVG stroke-dashoffset animated with CSS transitions

---

## 🛠 Built With

- **Vanilla HTML, CSS & JavaScript** — zero frameworks, zero dependencies
- **SVG** — hand-crafted plant illustration with gradients and filters
- **CSS Custom Properties** — full design token system for easy theming
- **localStorage API** — client-side persistence with JSON serialization
- **Inter font** — via Google Fonts

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<p align="center">Made with 🌱 by <a href="https://github.com/kazim-45">Kazim</a></p>
