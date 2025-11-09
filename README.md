# Space Invaders - Classic Arcade Game

A retro-style Space Invaders game built with React, TypeScript, and HTML5 Canvas. Features authentic pixel art graphics, arcade sound effects, and classic gameplay.

## 🎮 Play Now

Visit the live demo: [Space Invaders on Lovable](https://lovable.dev/projects/7c953700-a863-443c-806a-60c492b2ead5)

## 🕹️ How to Play

- **Move**: Use Arrow Keys (← →) or A/D keys
- **Fire**: Press Spacebar
- **Start/Restart**: Press Enter
- **Mute/Unmute**: Click the sound button in the control panel

## 🎯 Game Features

- Classic Space Invaders gameplay with three invader types
- Progressive difficulty - each wave moves faster
- Destructible shields for protection
- Bonus UFO for extra points
- Retro arcade sound effects using Web Audio API
- Pixel art graphics rendered on HTML5 Canvas
- Lives system and high score tracking

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd space-invaders

# Install dependencies
npm install

# Start the development server
npm run dev
```

The game will be available at `http://localhost:8080`

### Build for Production

```sh
npm run build
```

## 🛠️ Development

### Project Structure

```
src/
├── lib/
│   ├── game.ts       # Main game loop and logic
│   ├── entities.ts   # Player, Invaders, Bullets, Shields, UFO
│   └── audio.ts      # Sound effects manager
├── pages/
│   └── Index.tsx     # Main game component
└── index.css         # Design system and styles
```

### Editing the Code

**Using Lovable:**
- Visit the [Lovable Project](https://lovable.dev/projects/7c953700-a863-443c-806a-60c492b2ead5)
- Changes sync automatically to GitHub

**Using Your IDE:**
- Clone the repo and make changes locally
- Push to GitHub - changes sync to Lovable
- Full two-way sync between Lovable and GitHub

## 🎨 Technologies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **HTML5 Canvas** - Game rendering
- **Web Audio API** - Sound effects
- **Lucide React** - Icons

## 📦 Deployment

### Deploy with Lovable

1. Open [Lovable](https://lovable.dev/projects/7c953700-a863-443c-806a-60c492b2ead5)
2. Click Share → Publish
3. Your game will be live instantly

### Deploy Anywhere

The built files can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

```sh
npm run build
# Deploy the 'dist' folder to your hosting service
```

## 🔗 Connect to GitHub

Click the GitHub button in Lovable to automatically create a repository with your code. Lovable features two-way sync - changes in Lovable push to GitHub, and changes in GitHub sync to Lovable.

## 📝 License

Built with [Lovable](https://lovable.dev) - the AI-powered full-stack development platform.

## 🎮 Credits

Original Space Invaders © Taito Corporation 1978. This is a fan tribute built for educational purposes.
