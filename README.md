# 🍔 The Legend Fast Food

> An ultra-modern, high-performance fast-food web experience featuring a 240-frame scroll-animated hero section, transparent deconstructed burger anatomy, interactive Flavor Lab customizer, and an integrated shopping cart drawer.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Ftcodezdigital%2FThe-Legend-Fast-Food)

---

## ✨ Features

- **240-Frame Scroll Scrubbing**: Smooth canvas-rendered frame scrub tied to scroll velocity and position with progressive frame preloading.
- **Transparent Borderless Visuals**: Custom-processed 32-bit transparent ARGB PNGs allowing the signature burger to float borderless over the deep brand background.
- **Deconstructed Burger Anatomy**: Synchronized side callouts highlighting artisanal ingredients (honey-butter brioche, molten sharp cheddar, 450° smashed angus beef) during scroll without obscuring the hero asset.
- **Interactive Flavor Lab (Customizer)**:
  - Real-time custom burger builder with dedicated transparent preview models for every patty tier (Single, Double, Triple).
  - Dedicated transparent thumbnail assets for every selection (Aged Cheddar, Ghost Pepper Jack, Smoked Gouda, Applewood Bacon, Grilled Onions, Truffle Aioli, Farm Egg).
  - Dynamic price, title, and ingredient tag generation.
- **Slide-out Cart & Checkout Modal**: Live bag badge, itemized breakdown with transparent product miniatures, subtotal + tax calculator, and simulated checkout flow.
- **Optimized for Vercel Edge**: Built with `vercel.json` edge caching headers (`Cache-Control: public, max-age=31536000, immutable`) for high-speed delivery of image frames worldwide.

---

## 🚀 Live Deployment on Vercel

This repository is pre-configured for instant zero-configuration deployment on **Vercel**:

1. Click the **Deploy with Vercel** button above, or go to [vercel.com/new](https://vercel.com/new).
2. Import this GitHub repository: `https://github.com/tcodezdigital/The-Legend-Fast-Food`.
3. In Project Settings, keep **Framework Preset** as **Other** (Root directory `./`).
4. Click **Deploy**. Vercel will deploy the site globally across edge nodes in seconds!

---

## 💻 Local Development

### Option 1: One-Click (Windows)
Double-click `run-server.bat` in the project root. The site will start and open at:
```
http://localhost:3000/
```

### Option 2: Node.js CLI
```bash
# Start the local server
npm start

# Or directly with Node
node server.js
```
Then visit `http://localhost:3000/` in your browser.

---

## 📁 Project Structure

```
├── frames/                 # 240 transparent PNG frames for scroll animation
├── images/                 # Dedicated transparent customizer & menu assets
├── index.html              # Core application markup
├── styles.css              # Custom styling, responsive layouts & brand system
├── app.js                  # Canvas scrubbing, customizer logic & cart system
├── server.js               # Lightweight Node.js static server with MIME types
├── run-server.bat          # 1-click Windows launcher
├── vercel.json             # Vercel Edge routing and static cache headers
├── package.json            # Node.js project manifest & scripts
└── .gitignore              # Ignores large archives and temp files
```

---

## 🎨 Brand Palette

- **Brand Red**: `#E51821`
- **Brand Yellow**: `#FFC709`
- **Obsidian Deep**: `#080B0C`
- **Card Surface**: `#0E1214`
- **Border Subtle**: `rgba(255, 255, 255, 0.08)`

---

## 📄 License

MIT License. Designed and developed for **The Legend Fast Food**.
