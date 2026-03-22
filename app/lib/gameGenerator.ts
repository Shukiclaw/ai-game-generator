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
        primary: "#3b82f6",
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
};
