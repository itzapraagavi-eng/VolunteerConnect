<div align="center">

# 🤝 VolunteerConnect

### *Where good people find their cause.*

**India's volunteer platform — from signing up to holding a certificate, in one flow.**

[![Live Demo](https://img.shields.io/badge/▶_Live_Demo-Open_App-6D28D9?style=for-the-badge)](https://volunteer-connect-iota.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Dependencies](https://img.shields.io/badge/npm_deps-2-brightgreen?style=for-the-badge)](https://github.com/itzapraagavi-eng/VolunteerConnect)

**[→ Try it now](https://volunteer-connect-iota.vercel.app/)** — no signup, no install. Pick a role and explore.

</div>

---

## 🔥 The problem

Volunteering in India runs on WhatsApp forwards and Google Forms.

> *A college student wants to spend Saturday doing something useful. She hears about a beach cleanup through a friend of a friend, shows up, works four hours, goes home. No record. No proof. The NGO has no idea how many people actually came. Next month she has to find the next event the same way — by luck.*

Three things break here, and VolunteerConnect fixes all three:

| ❌ Broken | ✅ Fixed |
|---|---|
| Events are invisible unless you know someone | Browse every event by cause, see them on a live map |
| NGOs can't verify who showed up | Scannable QR entry passes, checked in at the venue |
| Volunteers walk away with nothing | Impact stats, badges, and a verified certificate |

---

## ✨ What it does

### 🙋 If you're a volunteer

**Find something worth your Saturday.** Eight causes — 🌳 Environment, 🍱 Food & Hunger, 📚 Education, ❤️ Health, 🐾 Animal Welfare, ⛑️ Disaster Relief, 🤝 Elder Care, ⚽ Sports & Youth. Filter by what you care about, see it plotted on a real map of the city, pick one.

**Walk in with a QR pass.** Join an event and you get an entry pass with a scannable code tied to you and that event. The organiser scans it at the gate. No list to find your name on.

**Ask before you go.** Built-in chat with the organiser that actually understands what you asked — timing, venue, what to bring, whether you can bring a friend.

**Watch your impact add up.** Not "4 events attended" — *12 trees planted, 340 meals served, 28 students taught.* Real units for real work.

**Earn your way up.** 🌱 Seed → 🌿 Sprout → 🤝 Helper → 🏅 Champion → ⭐ Community Hero.

**Leave with proof.** A formal certificate of participation with a verification ID — print-ready, signed, sealed.

### 🏢 If you run an NGO

Post events with capacity and location · See your volunteer roster · Scan passes to verify attendance · Log impact numbers · Issue certificates to everyone who showed up.

### 🌓 Everywhere

Full dark mode. Works on your phone.

---

## 🛠 Under the hood

| | |
|---|---|
| **Framework** | React 18 — functional components, hooks throughout |
| **Build** | Vite |
| **Styling** | CSS-in-JS with a runtime-swappable palette (dark mode flips one object) |
| **Maps** | OpenStreetMap embed — no API key, no quota, no billing |
| **QR codes** | **Written from scratch** ⬇ |
| **Certificates** | Generated as print-ready A4 landscape HTML |

### 💡 The interesting part: the QR encoder

Most projects `npm install qrcode`. This one doesn't.

`QRCode` in `VolunteerConnect.jsx` is a **complete QR generator in ~60 lines** — GF(256) Galois field arithmetic, Reed–Solomon error correction codewords, finder patterns, timing strips, format bits, zigzag data placement, and mask application. It emits an SVG. It scans with any phone camera.

```
GF(256) log/antilog tables  →  Reed–Solomon generator polynomial
→  byte-mode encoding  →  error correction codewords
→  matrix placement (zigzag, column-pairs)  →  mask 0  →  SVG
```

Same story with the theme system — no styling library, just one palette object swapped at runtime.

**Result: 2 npm dependencies.** React and ReactDOM. That's the whole tree.

---

## 📸 Screenshots

<!-- Add screenshots to a /screenshots folder, then delete these comment markers
| Landing | Discover events | Live map |
|:---:|:---:|:---:|
| <img src="screenshots/landing.png" width="260"/> | <img src="screenshots/events.png" width="260"/> | <img src="screenshots/map.png" width="260"/> |

| QR entry pass | Certificate | Dark mode |
|:---:|:---:|:---:|
| <img src="screenshots/entrypass.png" width="260"/> | <img src="screenshots/certificate.png" width="260"/> | <img src="screenshots/dark.png" width="260"/> |
-->

---

## 🚀 Run it locally

```bash
git clone https://github.com/itzapraagavi-eng/VolunteerConnect.git
cd VolunteerConnect
npm install
npm run dev
```

→ **http://localhost:5173**

---

## 🗺 Roadmap

- [ ] Backend — persistent accounts, real event storage
- [ ] Live QR scanning through the device camera
- [ ] Certificates delivered by email
- [ ] Expand past Chennai to other Indian cities
- [ ] NGO verification and trust badges

---

<div align="center">

**Built by Raagavi A.P.**

[![GitHub](https://img.shields.io/badge/GitHub-itzapraagavi--eng-181717?style=flat-square&logo=github)](https://github.com/itzapraagavi-eng)

*⭐ Star the repo if this was useful*

</div>
