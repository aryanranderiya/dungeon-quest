<img src="https://github.com/aryanranderiya/dungeon-quest/blob/main/public/dungeon_quest.png" width=200/>

# Dungeon Quest 🎮

A retro-styled adventure game built with Next.js, React, and TypeScript. Explore a pixel art dungeon, collect items, and complete your inventory!


## 🎯 Game Overview

**Dungeon Quest** is a nostalgic pixel art adventure game where you navigate a mysterious dungeon to collect armor pieces and various items. The game features classic WASD/arrow key controls, an inventory system, and retro visual effects including a CRT screen filter.

### Features

- **Pixel Art Graphics**: Authentic retro visuals with pixelated sprites
- **Item Collection**: Find and collect 21 unique items scattered around the dungeon
- **Inventory System**: Track your collected items in a dedicated sidebar
- **CRT Effect**: Nostalgic CRT screen overlay for that authentic retro gaming experience

## Screenshots

![Screenshot from 2025-04-30 03-12-37](https://github.com/user-attachments/assets/413c974c-6a23-4d68-8d10-b7a8f5f3c261)
![Screenshot from 2025-04-30 03-12-42](https://github.com/user-attachments/assets/41010548-03bc-4c87-b463-bbc6a54e8155)
![Screenshot from 2025-04-30 03-12-47](https://github.com/user-attachments/assets/3352e33e-3b22-4f42-adc0-f6f5dc4054ee)



## 🎮 How to Play

1. Move your character using **WASD** keys or **Arrow keys**
2. Collect all 5 armor pieces (helmet, chestplate, boots, shield, sword)
3. Build your inventory by finding various items around the dungeon
4. Complete all collections to win the game!

## 🛠️ Technologies Used

- **Next.js 15**: React framework for production-ready applications
- **React 19**: UI component library
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **HTML5 Canvas**: For rendering the game graphics
- **Radix UI**: Accessible UI components
- **Pixel Art Assets**: Custom designed pixel art sprites

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dungeon-quest.git
cd dungeon-quest
```

2. Install dependencies:

```bash
pnpm install
# or
npm install
```

3. Run the development server:

```bash
pnpm dev
# or
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to play the game!

## 🏗️ Project Structure

```
dungeon-quest/
├── app/                # Next.js app directory
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout component
│   └── page.tsx        # Home page component
├── components/         # React components
│   ├── game/           # Game-specific components
│   │   ├── GameCanvas.tsx       # Main canvas renderer
│   │   ├── GameControls.tsx     # Game control buttons
│   │   ├── Inventory.tsx        # Inventory system
│   │   ├── RetroPixelQuest.tsx  # Main game component
│   │   └── ...                  # Other game screens
│   └── ui/             # Reusable UI components
├── hooks/              # Custom React hooks
│   ├── use-background-music.ts
│   ├── use-canvas-renderer.ts
│   ├── use-game-logic.ts
│   └── ...
├── lib/                # Utility functions and constants
│   ├── game-constants.ts  # Game configuration constants
│   ├── game-state.ts      # Default game state
│   ├── game-types.ts      # TypeScript type definitions
│   └── game-utils.ts      # Helper functions
└── public/             # Static assets
    ├── inventory/      # Item sprites
    ├── player/         # Player sprites
    ├── ui/             # UI elements
    └── ...             # Audio files and backgrounds
```

## 🎨 Game Features Explained

### Canvas Rendering

The game uses HTML5 Canvas for rendering the game world, player character, and collectible items. The rendering is done with a pixelated style and includes animations for items.

### Responsive Design

The game adjusts to different screen sizes, making it playable on both desktop and mobile devices. The canvas scales appropriately to maintain the pixel art aesthetic.

### Audio System

Background music and sound effects enhance the gaming experience. Players can toggle sound on/off.

### Game State Management

Custom React hooks manage the game state, keyboard controls, and game logic, providing a smooth gameplay experience.

### CRT Effect

A CRT screen filter overlay gives the game an authentic retro feel, simulating old-school gaming monitors.

## 🔮 Future Enhancements

- Multiple dungeon levels
- Enemy characters and combat system
- Save game progress to local storage
- High score leaderboard
- Additional quests and objectives

## 📝 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created by [Aryan Randeriya](https://aryanranderiya.com)

- GitHub: [@aryanranderiya](https://github.com/aryanranderiya)
- LinkedIn: [@aryanranderiya](https://linkedin.com/in/aryanranderiya)

---

Enjoy your adventure in Dungeon Quest! 🎲🗝️🏆
