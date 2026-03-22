import { GameSpec } from "../types/game";

export async function generateGame(description: string): Promise<GameSpec> {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ description }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to generate game");
  }

  return data.game;
}

// Predefined example games for quick access
export const EXAMPLE_GAMES: Record<string, GameSpec> = {
  memory: {
    name: "Space Memory",
    description: "Match pairs of space-themed cards",
    theme: {
      colors: {
        primary: "#06b6d4",
        secondary: "#8b5cf6",
        background: "#0f172a",
        text: "#f8fafc",
      },
      font: "Inter",
    },
    initialState: {
      score: 0,
      turns: 0,
      timer: 0,
      isPlaying: true,
      gameOver: false,
      matchedPairs: 0,
      totalPairs: 8,
      flippedCards: [],
    },
    components: [
      { type: "ScoreBoard", props: { score: 0, turns: 0 } },
      { type: "Timer", props: { seconds: 0, isRunning: true } },
      {
        type: "Grid",
        props: { columns: 4, gap: 4 },
        children: [
          { type: "Card", props: { value: "🚀", isFlipped: false } },
          { type: "Card", props: { value: "🚀", isFlipped: false } },
          { type: "Card", props: { value: "🌟", isFlipped: false } },
          { type: "Card", props: { value: "🌟", isFlipped: false } },
          { type: "Card", props: { value: "🪐", isFlipped: false } },
          { type: "Card", props: { value: "🪐", isFlipped: false } },
          { type: "Card", props: { value: "👽", isFlipped: false } },
          { type: "Card", props: { value: "👽", isFlipped: false } },
          { type: "Card", props: { value: "🌙", isFlipped: false } },
          { type: "Card", props: { value: "🌙", isFlipped: false } },
          { type: "Card", props: { value: "☄️", isFlipped: false } },
          { type: "Card", props: { value: "☄️", isFlipped: false } },
          { type: "Card", props: { value: "🛸", isFlipped: false } },
          { type: "Card", props: { value: "🛸", isFlipped: false } },
          { type: "Card", props: { value: "🌍", isFlipped: false } },
          { type: "Card", props: { value: "🌍", isFlipped: false } },
        ],
      },
    ],
    logic: {
      onInit: "shuffleCards",
      onAction: {
        cardClick: "handleCardFlip",
      },
    },
  },
  
  quiz: {
    name: "Animal Trivia",
    description: "Test your knowledge of amazing animals",
    theme: {
      colors: {
        primary: "#22c55e",
        secondary: "#10b981",
        background: "#064e3b",
        text: "#f0fdf4",
      },
      font: "Inter",
    },
    initialState: {
      score: 0,
      turns: 0,
      timer: 0,
      isPlaying: true,
      gameOver: false,
      currentQuestion: 0,
      questions: [
        {
          question: "Which animal is known as the 'King of the Jungle'?",
          answers: ["Lion", "Tiger", "Elephant", "Gorilla"],
          correct: 0,
          category: "Mammals",
        },
        {
          question: "What is the fastest land animal?",
          answers: ["Leopard", "Cheetah", "Lion", "Gazelle"],
          correct: 1,
          category: "Speed",
        },
        {
          question: "Which bird can fly backwards?",
          answers: ["Eagle", "Hummingbird", "Owl", "Parrot"],
          correct: 1,
          category: "Birds",
        },
        {
          question: "What is the largest mammal in the world?",
          answers: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
          correct: 1,
          category: "Size",
        },
        {
          question: "How many hearts does an octopus have?",
          answers: ["1", "2", "3", "4"],
          correct: 2,
          category: "Ocean",
        },
      ],
      selectedAnswer: null,
      isRevealed: false,
    },
    components: [
      { type: "ScoreBoard", props: { score: 0 } },
      { type: "Timer", props: { seconds: 60, maxSeconds: 60, isRunning: true } },
      { type: "QuestionCard", props: { question: "", category: "" } },
      { type: "AnswerOption", props: { answer: "", letter: "A" } },
      { type: "AnswerOption", props: { answer: "", letter: "B" } },
      { type: "AnswerOption", props: { answer: "", letter: "C" } },
      { type: "AnswerOption", props: { answer: "", letter: "D" } },
    ],
    logic: {
      onInit: "loadQuestion",
      onAction: {
        selectAnswer: "handleAnswerSelect",
        nextQuestion: "loadNextQuestion",
      },
      onTimer: "handleTimeUp",
    },
  },
  
  clicker: {
    name: "Cookie Clicker Pro",
    description: "Click cookies and buy upgrades to get more cookies!",
    theme: {
      colors: {
        primary: "#f59e0b",
        secondary: "#d97706",
        background: "#451a03",
        text: "#fffbeb",
      },
      font: "Inter",
    },
    initialState: {
      score: 0,
      turns: 0,
      timer: 0,
      isPlaying: true,
      gameOver: false,
      clicks: 0,
      clickPower: 1,
      autoClicks: 0,
      upgrades: [
        { id: "cursor", name: "Cursor", cost: 10, owned: 0, cps: 0.1 },
        { id: "grandma", name: "Grandma", cost: 100, owned: 0, cps: 1 },
        { id: "farm", name: "Cookie Farm", cost: 500, owned: 0, cps: 5 },
        { id: "factory", name: "Factory", cost: 2000, owned: 0, cps: 20 },
      ],
    },
    components: [
      { type: "ScoreBoard", props: { score: 0 } },
      { type: "Clicker", props: { emoji: "🍪", size: "xl" } },
      {
        type: "Grid",
        props: { columns: 2, gap: 3 },
        children: [
          { type: "Upgrade", props: { name: "Cursor", cost: 10, effect: "0.1/sec" } },
          { type: "Upgrade", props: { name: "Grandma", cost: 100, effect: "1/sec" } },
          { type: "Upgrade", props: { name: "Farm", cost: 500, effect: "5/sec" } },
          { type: "Upgrade", props: { name: "Factory", cost: 2000, effect: "20/sec" } },
        ],
      },
    ],
    logic: {
      onInit: "startAutoClicker",
      onAction: {
        click: "handleCookieClick",
        buyUpgrade: "handleUpgradePurchase",
      },
    },
  },

  // NEW EXAMPLE GAMES
  
  // Space Shooter - Entity + Projectile + HealthBar + ParticleEffect
  shooter: {
    name: "Neon Space Defender",
    description: "Defend Earth from alien invaders! Shoot enemies and collect power-ups.",
    theme: {
      colors: {
        primary: "#06b6d4",
        secondary: "#ec4899",
        background: "#0f172a",
        text: "#f8fafc",
      },
      font: "Inter",
    },
    initialState: {
      score: 0,
      turns: 0,
      timer: 0,
      isPlaying: true,
      gameOver: false,
      playerHealth: 100,
      playerX: 375,
      playerY: 520,
      enemies: [
        { id: 1, x: 100, y: 50, health: 30, emoji: "👾" },
        { id: 2, x: 300, y: 80, health: 30, emoji: "👾" },
        { id: 3, x: 500, y: 50, health: 30, emoji: "👾" },
        { id: 4, x: 700, y: 80, health: 30, emoji: "👾" },
      ],
      projectiles: [],
      particles: [],
      level: 1,
    },
    components: [
      { type: "ScoreBoard", props: { score: 0, level: 1 } },
      { type: "HealthBar", props: { current: 100, max: 100, label: "Player HP", variant: "segmented" } },
      {
        type: "GameContainer",
        props: { width: 800, height: 600 },
        children: [
          // Player Entity
          { type: "Entity", props: { x: 375, y: 520, emoji: "🚀", color: "#06b6d4", isPlayer: true, width: 50, height: 50 } },
          // Enemies
          { type: "Entity", props: { x: 100, y: 50, emoji: "👾", color: "#ec4899", health: 30, maxHealth: 30 } },
          { type: "Entity", props: { x: 300, y: 80, emoji: "👾", color: "#ec4899", health: 30, maxHealth: 30 } },
          { type: "Entity", props: { x: 500, y: 50, emoji: "👾", color: "#ec4899", health: 30, maxHealth: 30 } },
          { type: "Entity", props: { x: 700, y: 80, emoji: "👾", color: "#ec4899", health: 30, maxHealth: 30 } },
          // Collectible power-up
          { type: "Collectible", props: { x: 400, y: 300, type: "powerup", emoji: "⚡", value: 0 } },
        ],
      },
      {
        type: "Grid",
        props: { columns: 3, gap: 2 },
        children: [
          { type: "Button", props: { variant: "neon", children: "← Left" } },
          { type: "Button", props: { variant: "primary", children: "🔥 Shoot" } },
          { type: "Button", props: { variant: "neon", children: "Right →" } },
        ],
      },
      {
        type: "PowerUp",
        props: { type: "shield", isActive: false, duration: 5 },
      },
    ],
    logic: {
      onInit: "initShooterGame",
      onAction: {
        moveLeft: "playerMoveLeft",
        moveRight: "playerMoveRight",
        shoot: "playerShoot",
        enemyHit: "handleEnemyDamage",
        collectPowerUp: "activatePowerUp",
      },
      onTimer: "updateEnemies",
    },
  },

  // Platformer - PhysicsBody + Collectible + Obstacle
  platformer: {
    name: "Cyber Jumper",
    description: "Jump through platforms, collect coins, and avoid spikes in this neon platformer!",
    theme: {
      colors: {
        primary: "#22c55e",
        secondary: "#84cc16",
        background: "#0f172a",
        text: "#f0fdf4",
      },
      font: "Inter",
    },
    initialState: {
      score: 0,
      turns: 0,
      timer: 0,
      isPlaying: true,
      gameOver: false,
      playerX: 50,
      playerY: 400,
      playerVelocityY: 0,
      isJumping: false,
      coinsCollected: 0,
      totalCoins: 8,
      health: 3,
    },
    components: [
      { type: "ScoreBoard", props: { score: 0 } },
      { type: "HealthBar", props: { current: 3, max: 3, label: "Lives", variant: "hearts" } },
      { type: "ProgressBar", props: { value: 0, max: 8, label: "Coins", color: "#fbbf24" } },
      {
        type: "GameContainer",
        props: { width: 800, height: 500 },
        children: [
          // Player PhysicsBody
          { type: "PhysicsBody", props: { x: 50, y: 400, emoji: "🤖", color: "#22c55e" } },
          // Platforms (as Obstacles type="block")
          { type: "Obstacle", props: { x: 0, y: 450, width: 800, height: 50, type: "block", color: "#1e293b" } },
          { type: "Obstacle", props: { x: 200, y: 350, width: 150, height: 20, type: "block", color: "#334155" } },
          { type: "Obstacle", props: { x: 450, y: 280, width: 150, height: 20, type: "block", color: "#334155" } },
          { type: "Obstacle", props: { x: 100, y: 200, width: 150, height: 20, type: "block", color: "#334155" } },
          // Spikes
          { type: "Obstacle", props: { x: 380, y: 430, width: 40, height: 20, type: "spike", damage: 1 } },
          { type: "Obstacle", props: { x: 600, y: 430, width: 40, height: 20, type: "spike", damage: 1 } },
          // Collectible coins
          { type: "Collectible", props: { x: 250, y: 310, type: "coin", value: 10 } },
          { type: "Collectible", props: { x: 300, y: 310, type: "coin", value: 10 } },
          { type: "Collectible", props: { x: 500, y: 240, type: "coin", value: 10 } },
          { type: "Collectible", props: { x: 550, y: 240, type: "coin", value: 10 } },
          { type: "Collectible", props: { x: 150, y: 160, type: "coin", value: 10 } },
          { type: "Collectible", props: { x: 200, y: 160, type: "coin", value: 10 } },
          // Gem collectible
          { type: "Collectible", props: { x: 700, y: 380, type: "gem", value: 50 } },
          // Star collectible
          { type: "Collectible", props: { x: 50, y: 150, type: "star", value: 100 } },
        ],
      },
      {
        type: "Grid",
        props: { columns: 2, gap: 3 },
        children: [
          { type: "Button", props: { variant: "neon", size: "lg", children: "← Left" } },
          { type: "Button", props: { variant: "neon", size: "lg", children: "Right →" } },
        ],
      },
      { type: "Button", props: { variant: "primary", size: "lg", children: "⬆️ Jump" } },
    ],
    logic: {
      onInit: "initPlatformer",
      onAction: {
        moveLeft: "movePlayerLeft",
        moveRight: "movePlayerRight",
        jump: "playerJump",
        collect: "collectItem",
        hitObstacle: "takeDamage",
      },
      onTimer: "applyPhysics",
    },
  },

  // Puzzle Drag - Draggable + Grid
  puzzle: {
    name: "Neon Slide Puzzle",
    description: "Drag and drop pieces to solve the puzzle! Match the pattern to win.",
    theme: {
      colors: {
        primary: "#8b5cf6",
        secondary: "#ec4899",
        background: "#1e1b4b",
        text: "#f8fafc",
      },
      font: "Inter",
    },
    initialState: {
      score: 0,
      turns: 0,
      timer: 0,
      isPlaying: true,
      gameOver: false,
      moves: 0,
      piecesPlaced: 0,
      totalPieces: 6,
      puzzleSolved: false,
    },
    components: [
      { type: "ScoreBoard", props: { turns: 0 } },
      { type: "Timer", props: { seconds: 0, isRunning: true } },
      { type: "ProgressBar", props: { value: 0, max: 6, label: "Progress", color: "#ec4899" } },
      {
        type: "GameContainer",
        props: { width: 600, height: 400 },
        children: [
          // Target grid (drop zones shown as faint outlines)
          { type: "Grid", props: { columns: 3, gap: 2 },
            children: [
              { type: "Button", props: { variant: "secondary", children: "🌟" } },
              { type: "Button", props: { variant: "secondary", children: "🌙" } },
              { type: "Button", props: { variant: "secondary", children: "☀️" } },
              { type: "Button", props: { variant: "secondary", children: "⭐" } },
              { type: "Button", props: { variant: "secondary", children: "🌈" } },
              { type: "Button", props: { variant: "secondary", children: "💫" } },
            ]
          },
        ],
      },
      { type: "Card", props: { children: "Drag pieces to match the target pattern above!" } },
      // Draggable puzzle pieces
      {
        type: "Grid",
        props: { columns: 3, gap: 4 },
        children: [
          { type: "Draggable", props: { id: "piece1", x: 0, y: 0, emoji: "🌟", color: "#fbbf24", snapToGrid: true, gridSize: 80 } },
          { type: "Draggable", props: { id: "piece2", x: 0, y: 0, emoji: "🌙", color: "#94a3b8", snapToGrid: true, gridSize: 80 } },
          { type: "Draggable", props: { id: "piece3", x: 0, y: 0, emoji: "☀️", color: "#f59e0b", snapToGrid: true, gridSize: 80 } },
          { type: "Draggable", props: { id: "piece4", x: 0, y: 0, emoji: "⭐", color: "#fcd34d", snapToGrid: true, gridSize: 80 } },
          { type: "Draggable", props: { id: "piece5", x: 0, y: 0, emoji: "🌈", color: "#a855f7", snapToGrid: true, gridSize: 80 } },
          { type: "Draggable", props: { id: "piece6", x: 0, y: 0, emoji: "💫", color: "#ec4899", snapToGrid: true, gridSize: 80 } },
        ],
      },
      { type: "Button", props: { variant: "secondary", children: "🔄 Shuffle Pieces" } },
    ],
    logic: {
      onInit: "shufflePieces",
      onAction: {
        dragStart: "handleDragStart",
        dragEnd: "handleDrop",
        shuffle: "shufflePieces",
        checkWin: "verifySolution",
      },
    },
  },
};
