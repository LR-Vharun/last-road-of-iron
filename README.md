# The Last Road of Iron 🗡️

A dark medieval text-based RPG built with vanilla JavaScript. Journey through 6 Acts, battle enemies, level up, and reach the capital gates.

## 🎮 Play Now

**Live Demo:** [Play on GitHub Pages](https://YOUR_USERNAME.github.io/REPO_NAME/)

## 🚀 Quick Start

### Option 1: Play Online
Simply visit the GitHub Pages link above!

### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# Start a local server (Python)
python3 -m http.server 8080

# Open in browser
# Navigate to: http://localhost:8080
```

> **Note:** The game requires a local server due to JavaScript module loading. Opening `index.html` directly won't work.

## ✨ Features

- **6 Acts** of dark medieval storytelling
- **XP & Leveling System** - Gain experience, level up, choose stat bonuses
- **Combat System** - Attack, Defend (50% damage reduction), or Use Items
- **Patrol System** - Repeatable encounters for grinding
- **Equipment & Shop** - Buy weapons, armor, and potions
- **Auto-Save** - Progress saves automatically to localStorage
- **Persistent Progress** - Continue your journey anytime

## 🎯 Gameplay

### Combat Actions
- **Attack** - Deal damage based on your Attack stat
- **Defend** - Reduce incoming damage by 50%
- **Use Item** - Consume potions or other items

### Progression
- Defeat enemies to gain **Gold** and **XP**
- Every **100 XP** = Level Up
- Choose **+1 Attack** or **+1 Defense** on level up
- **+10 Max HP** automatically on level up

### Tips
- Visit **Taverns** to rest, shop, or patrol
- Use **Defend** strategically against tough enemies
- **Patrol** to grind XP and gold before boss fights
- Buy better equipment to increase your stats

## 📁 Project Structure

```
Dnd/
├── index.html          # Main game page
├── src/
│   ├── js/
│   │   └── game.js     # All game logic (bundled)
│   └── styles/
│       ├── main.css    # Core styles
│       └── themes.css  # Color themes
└── README.md
```

## 🛠️ Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling (Dark medieval theme)
- **Vanilla JavaScript** - Game logic
- **Google Fonts** - Cinzel & Inter
- **localStorage** - Save/Load system

## 🎨 Design

- Dark medieval aesthetic with premium UI
- Responsive layout
- Smooth animations and transitions
- Glassmorphism effects
- Custom scrollbars

## 📝 Game Data

### Enemies (6 Tiers)
1. **Roadside Bandit** (Tier 1)
2. **Hired Mercenary** (Tier 2)
3. **Fallen Knight** (Tier 3)
4. **Elite Guard** (Tier 4)
5. **Royal Sentry** (Tier 5)
6. **The King's Champion** (Boss)

### Equipment (6 Tiers)
- Swords (Tier 0-6)
- Armor (Tier 0-5)
- Helmets (Tier 2-4)
- Potions

## 🐛 Known Issues

- Level Up Modal requires page refresh to see updated stats in some cases
- Inventory limit (20 items) not yet enforced

## 🤝 Contributing

This is a personal project, but feel free to fork and modify!

## 📄 License

MIT License - Feel free to use and modify

## 🎮 Credits

Developed by [Your Name]

---

**Enjoy your journey on The Last Road of Iron!** ⚔️
