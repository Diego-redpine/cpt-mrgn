# TROPIX BEATS - Miami Vice Beat Selling Website

A premium beat selling website with a Miami Vice tropical aesthetic. Features animated waves, sunset gradients, palm tree silhouettes, and a clean modern design.

![TROPIX BEATS Preview](preview.png)

## 🌴 Features

- **Full Miami Vice Aesthetic**: Sunset gradients, palm silhouettes, animated ocean waves
- **Homepage**: Hero section, latest drop showcase, popular beats grid
- **Store Page**: Full beat catalog with search and filters
- **Beat Detail Page**: Audio player, license options, similar beats
- **Page Transitions**: Wave crash animations with hit marker sounds
- **Fully Responsive**: Desktop, tablet, and mobile optimized
- **Audio Player**: Custom styled player with waveform visualization

## 🎨 Design System

### Colors
- Primary Orange: `#FF8C42`
- Teal: `#008B8B`
- Turquoise: `#40E0D0`
- Golden Yellow: `#FFD700`
- Purple: `#8B5A9C`
- Pink Accent: `#FF6B9D`
- Dark Background: `#1A1A2E`

### Typography
- **Display Font**: Bebas Neue (headings)
- **Body Font**: Outfit (body text)

## 📁 File Structure

```
beat-website/
├── index.html          # Homepage
├── store.html          # All beats page
├── beat-detail.html    # Single beat detail page
├── style.css           # Main stylesheet
├── script.js           # JavaScript functionality
├── README.md           # This file
└── assets/
    ├── sounds/
    │   └── hitmarker.mp3   # Hit marker sound effect
    ├── images/
    │   └── (cover art, etc.)
    └── beats/
        └── (audio files)
```

## 🚀 Quick Start

1. **Clone or download** the files
2. **Add your audio files**:
   - Add `hitmarker.mp3` to `assets/sounds/`
   - Add beat previews to `assets/beats/`
3. **Customize**:
   - Replace "TROPIX BEATS" with your producer name
   - Update social media links
   - Add your beat information
4. **Deploy** to Netlify, Vercel, or any static host

## 🔧 Customization

### Change Producer Name
Find and replace "TROPIX" throughout the HTML files with your name.

### Add Real Audio
Replace the simulated audio player with actual audio:

```javascript
// In script.js, replace the simulated audio with:
const audio = new Audio('assets/beats/your-beat.mp3');
```

### Stripe Integration
Add Stripe checkout to the license buttons:

```javascript
// Add this to the license button click handler
const stripe = Stripe('your-publishable-key');
stripe.redirectToCheckout({
    lineItems: [{ price: 'price_id', quantity: 1 }],
    mode: 'payment',
    successUrl: 'https://yoursite.com/success',
    cancelUrl: 'https://yoursite.com/cancel',
});
```

### Add More Beats
Duplicate the beat card HTML and update:
- `data-beat-id` attribute
- Cover art class (e.g., `cover-ocean`, `cover-neon`)
- Title, BPM, key, and price

## 📱 Responsive Breakpoints

- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 640px - 767px
- **Phone**: < 640px

## 🎵 Adding Hit Marker Sound

Download a hit marker sound effect and save as `assets/sounds/hitmarker.mp3`.

Free options:
- [FreeSound.org](https://freesound.org) - Search "hit marker"
- [Mixkit](https://mixkit.co) - Free sound effects

## 🌐 Deployment

### Netlify
1. Drag and drop the folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or connect your GitHub repo

### Vercel
1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Deploy

### GitHub Pages
1. Push to GitHub
2. Settings > Pages > Deploy from main branch

## 📝 License

This template is free to use for personal and commercial projects.

## 🤝 Credits

- Fonts: Google Fonts (Bebas Neue, Outfit)
- Icons: Custom SVG
- Design: Miami Vice / Tropical Sunset Aesthetic

---

**Powered by Red Pine** 🌲
