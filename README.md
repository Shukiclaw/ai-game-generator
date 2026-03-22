# 🎮 AI Game Generator

A web app where users describe a simple game in natural language and AI generates the game UI with full interactivity.

![AI Game Generator](https://img.shields.io/badge/AI-Game%20Generator-cyan?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge)

## ✨ Features

- **Natural Language Game Creation**: Describe any game you want to play
- **AI-Powered Generation**: Uses OpenRouter API with Kimi 2.5 to generate game specifications
- **Rich Component Library**: 20+ game components including physics, particles, and animations
- **Neon Dark Theme**: Cyberpunk-inspired UI with glowing effects and animations
- **Instant Play**: Games are rendered immediately with full interactivity
- **Built-in Examples**: Space Shooter, Platformer, Puzzle, Memory, Quiz, and Cookie Clicker
- **Mobile Support**: Joystick controls and touch-friendly interfaces
- **Particle Effects**: Explosions, sparkles, hearts, and more visual feedback

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 + shadcn/ui + Tailwind CSS
- **Game Engine**: Custom JSON-render based game renderer
- **AI**: OpenRouter API (Kimi 2.5)
- **Language**: TypeScript

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-game-generator.git
cd ai-game-generator

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local and add your OpenRouter API key

# Run development server
npm run dev
```

## 🔑 Getting an OpenRouter API Key

1. Visit [openrouter.ai](https://openrouter.ai)
2. Sign up for a free account
3. Go to Settings → API Keys
4. Create a new key and copy it
5. Paste it in your `.env.local` file

## 🎮 Included Games

### 🚀 Neon Space Defender (NEW!)
Blast alien invaders with projectiles!
- Player and enemy **Entities** with health
- **Projectile** shooting mechanics
- **HealthBar** displays with segmented style
- **ParticleEffect** explosions on hit
- **PowerUp** system for weapon upgrades

### 🤖 Cyber Jumper (NEW!)
Jump through platforms and collect coins!
- **PhysicsBody** with gravity simulation
- **Collectible** coins, gems, and stars
- **Obstacle** spikes and pits to avoid
- **HealthBar** with heart display
- **ProgressBar** for coin collection

### 🧩 Neon Slide Puzzle (NEW!)
Drag and drop to solve the puzzle!
- **Draggable** pieces with snap-to-grid
- **Grid** layout for organization
- **ProgressBar** tracking completion
- **AnimatedSprite** for visual feedback

### 🚀 Space Memory
Match pairs of space-themed cards (rockets, planets, aliens)
- 16 cards (8 pairs)
- Score tracking
- Turn counter
- Flip animations

### 🦁 Animal Trivia
Test your knowledge of amazing animals
- 5 questions with multiple choice
- Timed gameplay (60 seconds)
- Score based on correct answers
- Category and difficulty labels

### 🍪 Cookie Clicker Pro
The classic idle clicker game
- Click cookies to earn points
- Buy upgrades (Cursor, Grandma, Farm, Factory)
- Auto-clicker generation
- Progressive cost scaling

## 🧩 Game Components

### Basic Components
- **Card** - Flip cards for memory games
- **Button** - Interactive buttons with variants (primary, secondary, danger, success, neon)
- **Grid** - Layout container with configurable columns

### Display Components
- **ScoreBoard** - Score, high score, turns, level display
- **Timer** - Countdown/count-up timer with progress bar
- **QuestionCard** - Quiz question with category/difficulty
- **AnswerOption** - Multiple choice answer buttons

### Gameplay Components
- **Clicker** - Large clickable target for clicker games
- **Upgrade** - Purchaseable upgrade cards
- **GameOver** - End game screen with restart

### NEW Advanced Components
- **Entity** - Characters/enemies with position, health, and animations
- **Projectile** - Shots/missiles with trajectory
- **Collectible** - Items to collect (coins, stars, gems, hearts, power-ups)
- **Obstacle** - Hazards to avoid (spikes, blocks, lasers, pits, enemies)
- **HealthBar** - HP display (default, segmented, or hearts style)
- **ProgressBar** - Progress tracking with customizable colors
- **AnimatedSprite** - Animated game sprites with frame sequences
- **PhysicsBody** - Physics-enabled objects with gravity and bounce
- **Draggable** - Draggable items with optional snap-to-grid
- **ParticleEffect** - Visual effects (explosions, sparkles, smoke, hearts, stars)
- **Joystick** - Mobile-style touch controls
- **PowerUp** - Temporary boost buttons with duration
- **GameContainer** - Game area with animated grid background

## 🎨 Visual Design

- **Dark Theme**: Deep slate backgrounds with high contrast
- **Neon Accents**: Cyan, purple, and pink glow effects
- **Grid Background**: Animated grid pattern in game areas
- **Glowing Cards**: Hover effects with soft glow shadows
- **Smooth Animations**: Transitions and micro-interactions
- **Particle Effects**: Floating particles in background

## 📝 Example Prompts

- "Space shooter with alien enemies and power-ups"
- "Platformer with coins to collect and spikes to avoid"
- "Puzzle game with draggable pieces"
- "Racing game with obstacles and speed boosts"
- "Tower defense with shooting towers and waves"
- "RPG battle with health bars and special attacks"
- "Memory game with space theme"
- "Quiz about animals with 10 questions"
- "Clicker game with cookie upgrades"

## 🛠️ How It Works

1. **User Input**: Describe your game idea in natural language
2. **AI Generation**: The app sends your prompt to OpenRouter with Kimi 2.5
3. **Game Spec**: AI returns a JSON game specification with components, state, and logic
4. **Rendering**: The GameRenderer component interprets the spec and renders interactive components
5. **Play**: Users can play the game immediately with full state management

## 🎨 Customization

Each generated game includes:
- Custom color theme (primary, secondary, background, text)
- Custom font selection
- Unique game state variables
- Tailored component layout
- Neon glow effects matching the theme

## 🚧 Limitations

- AI-generated games work best with simple mechanics
- Complex physics simulations may need refinement
- Game state is not persisted between sessions
- Generated games may require tweaking for perfect balance

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add new game components
- Improve the AI prompt
- Add more example games
- Fix bugs or improve styling
- Add sound effects and music support

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for AI API access
- [Kimi 2.5](https://kimi.ai) for the amazing game generation model
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Next.js](https://nextjs.org) for the framework

---

Built with ❤️, 🦞 energy, and a lot of neon glow ✨
