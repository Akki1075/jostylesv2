# JO'STYLE — Boutique Fashion Website

A premium, fully static website for JO'STYLE tailoring boutique.
All content is controlled via `data.json` — no backend needed.

---

## 📁 Folder Structure

```
jostyle/
├── index.html          ← Main website (do not edit for content)
├── style.css           ← All styling
├── script.js           ← All JS logic
├── data.json           ← ✅ EDIT THIS to update all content
└── images/
    ├── hero.jpg        ← Full-screen hero background (landscape, min 1920×1080)
    ├── founder.jpg     ← Founder portrait (portrait orientation, min 600×800)
    ├── favicon.ico     ← Browser tab icon (32×32 or 64×64 .ico file)
    ├── gallery1.jpg    ← Gallery images (square, 800×800 recommended)
    ├── gallery2.jpg
    ├── gallery3.jpg
    ├── gallery4.jpg
    ├── gallery5.jpg
    ├── gallery6.jpg
    ├── service-embroidery.jpg   ← Service card images (16:9, min 600×340)
    ├── service-maggam.jpg
    ├── service-blouse.jpg
    └── service-saree.jpg
```

---

## 🖼️ Image Guide

| File | Dimensions | Tips |
|------|-----------|------|
| `hero.jpg` | 1920×1080 min | Rich, atmospheric fashion/boutique photo |
| `founder.jpg` | 600×800 min | Professional portrait, good lighting |
| `gallery1–6.jpg` | 800×800 square | Work samples, embroidery, blouses |
| `service-*.jpg` | 600×340 | Close-up of each service type |
| `favicon.ico` | 64×64 | Small logo, convert at favicon.io |

> **Tip:** Use [Squoosh](https://squoosh.app) to compress images before uploading.

---

## ✏️ How to Update Content

Open `data.json` and edit any field:

- **Business name / phone / address** → `business` object
- **Services** → `services` array (add/remove/edit items)
- **Gallery images** → `gallery` array (update src + caption)
- **Founder details** → `founder` object
- **Testimonials** → `testimonials` array
- **Instagram link** → `business.instagram`
- **Google Maps URL** → `business.mapsUrl`

---

## 🚀 Deploy on GitHub Pages

### Step 1 — Create GitHub Repository
1. Go to [github.com](https://github.com) → New repository
2. Name it `jostyle` (or anything you like)
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Upload Files
Option A — GitHub Web:
1. Click **Add file → Upload files**
2. Drag in all files: `index.html`, `style.css`, `script.js`, `data.json`
3. Create an `images/` folder by typing `images/hero.jpg` in filename → upload images
4. Click **Commit changes**

Option B — Git CLI:
```bash
git init
git add .
git commit -m "Initial JO'STYLE website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jostyle.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages
1. Go to repository **Settings → Pages**
2. Under **Source**, select `Deploy from a branch`
3. Branch: `main`, Folder: `/ (root)`
4. Click **Save**
5. Wait ~2 minutes → your site is live at:
   `https://YOUR_USERNAME.github.io/jostyle/`

---

## 📱 Testing Locally

Because `data.json` is fetched via `fetch()`, open with a local server:

```bash
# Python (any computer with Python installed):
python -m http.server 8000

# Then open: http://localhost:8000
```

> ⚠️ Do NOT open `index.html` directly by double-clicking — the `fetch('data.json')` call won't work without a server.

---

## 📞 WhatsApp Booking

The booking form auto-generates a WhatsApp message with:
- Customer name & phone
- Service selected
- Preferred date
- Any notes

The number is pulled from `data.json → business.whatsapp` (include country code, e.g. `917893634888`).

---

## 🎨 Changing Colors

Open `style.css` and edit the `:root` variables at the top:

```css
--maroon:    #6B1A1A;   /* Primary brand color */
--gold:      #C9973A;   /* Accent/highlight color */
--cream:     #FAF6F0;   /* Page background */
```

---

Made with ❤️ for JO'STYLE, Rajahmundry.
