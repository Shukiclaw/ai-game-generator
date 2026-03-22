# 🎮 AI Game Generator

A web app where users describe a simple game in natural language and AI generates the game UI with full interactivity.

![AI Game Generator](https://img.shields.io/badge/AI-Game%20Generator-blue)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8)

## ✨ Features

- **Natural Language Game Creation**: Describe any game you want to play
- **AI-Powered Generation**: Uses OpenRouter API with Gemini to generate game specifications
- **Instant Play**: Games are rendered immediately with full interactivity
- **Built-in Examples**: Memory Game, Quiz Game, and Cookie Clicker included
- **Customizable Themes**: Each game gets its own color scheme
- **State Management**: Scores, timers, turns all work seamlessly
- **Responsive Design**: Works on desktop and mobile

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19 + shadcn/ui + Tailwind CSS
- **Game Engine**: Custom JSON-render based game renderer
- **AI**: OpenRouter API (Gemini 2.0 Flash)
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

### 1. Space Memory 🚀
Match pairs of space-themed cards (rockets, planets, aliens)
- 16 cards (8 pairs)
- Score tracking
- Turn counter
- Flip animations

### 2. Animal Trivia 🦁
Test your knowledge of amazing animals
- 5 questions with multiple choice
- Timed gameplay (60 seconds)
- Score based on correct answers
- Category and difficulty labels

### 3. Cookie Clicker Pro 🍪
The classic idle clicker game
- Click cookies to earn points
- Buy upgrades (Cursor, Grandma, Farm, Factory)
- Auto-clicker generation
- Progressive cost scaling

## 🛠️ How It Works

1. **User Input**: Describe your game idea in natural language
2. **AI Generation**: The app sends your prompt to OpenRouter with a structured system prompt
3. **Game Spec**: AI returns a JSON game specification with components, state, and logic
4. **Rendering**: The GameRenderer component interprets the spec and renders interactive components
5. **Play**: Users can play the game immediately with full state management

## 📝 Example Prompts

- "Memory game with space theme"
- "Quiz about animals with 10 questions"
- "Clicker game with cookie upgrades"
- "Matching game with emojis"
- "Trivia about world capitals"
- "Clicker game with farm theme and animals"

## 🧩 Game Components

Available components for AI to use:

- **Card** - Flip cards for memory games
- **Button** - Interactive buttons with variants
- **Grid** - Layout container with configurable columns
- **ScoreBoard** - Score, high score, turns, level display
- **Timer** - Countdown/count-up timer with progress bar
- **QuestionCard** - Quiz question with category/difficulty
- **AnswerOption** - Multiple choice answer buttons
- **Clicker** - Large clickable target
- **Upgrade** - Purchaseable upgrade cards
- **GameOver** - End game screen with restart

## 🎨 Customization

Each generated game includes:
- Custom color theme (primary, secondary, background, text)
- Custom font selection
- Unique game state variables
- Tailored component layout

## 🚧 Limitations

- AI-generated games work best with simple mechanics
- Complex physics or multiplayer features aren't supported
- Game state is not persisted between sessions
- Generated games may require tweaking for perfect balance

## 🤝 Contributing

Contributions welcome! Feel free to:
- Add new game components
- Improve the AI prompt
- Add more example games
- Fix bugs or improve styling

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- [OpenRouter](https://openrouter.ai) for AI API access
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Next.js](https://nextjs.org) for the framework

---

Built with ❤️ and 🦞 energy
