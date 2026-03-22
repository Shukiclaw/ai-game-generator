"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GameButton } from "./GameComponents";
import { Loader2, Sparkles, Gamepad2, Brain, Cookie, Rocket, Puzzle, Mountain } from "lucide-react";
import { GameSpec } from "../types/game";
import { generateGame, EXAMPLE_GAMES } from "../lib/gameGenerator";

interface PromptInterfaceProps {
  onGameGenerated: (game: GameSpec) => void;
  onSelectExample: (game: GameSpec) => void;
}

const EXAMPLE_PROMPTS = [
  "Space shooter with alien enemies and power-ups",
  "Platformer with coins to collect and spikes to avoid",
  "Puzzle game with draggable pieces",
  "Racing game with obstacles and speed boosts",
  "Tower defense with shooting towers and waves",
  "RPG battle with health bars and special attacks",
  "Fruit ninja style slicing game",
  "Maze runner with collectibles and enemies",
];

// Animated grid background component
function GridBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Grid lines */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/50 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function PromptInterface({ onGameGenerated, onSelectExample }: PromptInterfaceProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [glowIntensity, setGlowIntensity] = useState(0);

  // Animate glow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGlowIntensity((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError(null);
    
    try {
      const game = await generateGame(prompt);
      onGameGenerated(game);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate game");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExampleClick = (examplePrompt: string) => {
    setPrompt(examplePrompt);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden">
      <GridBackground />
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div 
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl relative overflow-hidden group"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.3)',
                boxShadow: `0 0 ${30 + Math.sin(glowIntensity * 0.1) * 10}px rgba(6, 182, 212, 0.4)`,
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Gamepad2 className="w-8 h-8 text-cyan-400" />
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                AI Game Generator
              </h1>
              <Sparkles className="w-8 h-8 text-purple-400 animate-pulse" />
            </div>
            
            <p className="text-slate-400 max-w-xl mx-auto text-lg">
              Describe any game you want to play, and AI will generate it instantly with 
              <span className="text-cyan-400">Entities</span>, 
              <span className="text-purple-400">Physics</span>, 
              <span className="text-pink-400">Particles</span> and more!
            </p>
          </div>

          {/* Prompt Input */}
          <Card 
            className="border-cyan-500/20 bg-slate-900/60 backdrop-blur-xl overflow-hidden"
            style={{
              boxShadow: '0 0 40px rgba(6, 182, 212, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3 text-2xl">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                Describe Your Game
              </CardTitle>
              <CardDescription className="text-slate-400 text-base">
                Be creative! Try "space shooter with power-ups" or "platformer with coins and enemies"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., A neon space shooter where I blast alien invaders and collect weapon upgrades..."
                className="min-h-[140px] bg-slate-950/80 border-cyan-500/20 text-white placeholder:text-slate-600 resize-none text-lg focus:border-cyan-500/50 focus:ring-cyan-500/20 transition-all"
              />
              
              {error && (
                <div className="p-4 bg-red-950/50 border border-red-500/30 rounded-lg text-red-300">
                  {error}
                </div>
              )}
              
              <GameButton
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                variant="neon"
                size="lg"
                className="w-full text-lg py-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin inline" />
                    Generating Your Game...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-6 h-6 mr-3 inline" />
                    Generate Game
                  </>
                )}
              </GameButton>
            </CardContent>
          </Card>

          {/* Example Prompts */}
          <div className="space-y-3">
            <h3 className="text-slate-400 text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Try these examples:
            </h3>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(example)}
                  className="px-4 py-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 hover:border-cyan-500/50 rounded-full text-sm text-slate-300 hover:text-cyan-300 transition-all hover:shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Example Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Space Shooter */}
            <Card 
              className="bg-gradient-to-br from-cyan-950/50 to-blue-950/50 border-cyan-500/20 hover:border-cyan-400/40 cursor-pointer transition-all hover:scale-[1.02] group overflow-hidden"
              style={{
                boxShadow: '0 0 20px rgba(6, 182, 212, 0.1)',
              }}
              onClick={() => onSelectExample(EXAMPLE_GAMES.shooter)}
            >
              <CardHeader className="relative">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Rocket className="w-24 h-24 text-cyan-400" />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.7)] transition-shadow">
                  <Rocket className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Neon Space Defender</CardTitle>
                <CardDescription className="text-slate-400">
                  Blast aliens with projectiles! Features entities, health bars, and particle effects.
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['Entity', 'Projectile', 'HealthBar', 'ParticleEffect'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">{tag}</span>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Platformer */}
            <Card 
              className="bg-gradient-to-br from-green-950/50 to-emerald-950/50 border-green-500/20 hover:border-green-400/40 cursor-pointer transition-all hover:scale-[1.02] group overflow-hidden"
              style={{
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.1)',
              }}
              onClick={() => onSelectExample(EXAMPLE_GAMES.platformer)}
            >
              <CardHeader className="relative">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Mountain className="w-24 h-24 text-green-400" />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(34,197,94,0.5)] group-hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-shadow">
                  <Mountain className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Cyber Jumper</CardTitle>
                <CardDescription className="text-slate-400">
                  Jump through platforms! Physics body, collectibles, obstacles, and hazards.
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['PhysicsBody', 'Collectible', 'Obstacle', 'HealthBar'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/30">{tag}</span>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Puzzle */}
            <Card 
              className="bg-gradient-to-br from-purple-950/50 to-pink-950/50 border-purple-500/20 hover:border-purple-400/40 cursor-pointer transition-all hover:scale-[1.02] group overflow-hidden"
              style={{
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.1)',
              }}
              onClick={() => onSelectExample(EXAMPLE_GAMES.puzzle)}
            >
              <CardHeader className="relative">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Puzzle className="w-24 h-24 text-purple-400" />
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] transition-shadow">
                  <Puzzle className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Neon Slide Puzzle</CardTitle>
                <CardDescription className="text-slate-400">
                  Drag and drop to solve! Draggable pieces with snap-to-grid functionality.
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['Draggable', 'Grid', 'ProgressBar', 'AnimatedSprite'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">{tag}</span>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Memory */}
            <Card 
              className="bg-gradient-to-br from-blue-950/50 to-indigo-950/50 border-blue-500/20 hover:border-blue-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
              onClick={() => onSelectExample(EXAMPLE_GAMES.memory)}
            >
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] transition-shadow">
                  <span className="text-3xl">🚀</span>
                </div>
                <CardTitle className="text-white text-lg">Space Memory</CardTitle>
                <CardDescription className="text-slate-400">
                  Match pairs of space-themed cards in this cosmic memory challenge
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['Card', 'Grid', 'ScoreBoard', 'Timer'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">{tag}</span>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Quiz */}
            <Card 
              className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border-emerald-500/20 hover:border-emerald-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
              onClick={() => onSelectExample(EXAMPLE_GAMES.quiz)}
            >
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(16,185,129,0.5)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.7)] transition-shadow">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Animal Trivia</CardTitle>
                <CardDescription className="text-slate-400">
                  Test your knowledge of amazing animals with timed questions
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['QuestionCard', 'AnswerOption', 'Timer', 'ScoreBoard'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30">{tag}</span>
                  ))}
                </div>
              </CardHeader>
            </Card>

            {/* Clicker */}
            <Card 
              className="bg-gradient-to-br from-amber-950/50 to-orange-950/50 border-amber-500/20 hover:border-amber-400/40 cursor-pointer transition-all hover:scale-[1.02] group"
              onClick={() => onSelectExample(EXAMPLE_GAMES.clicker)}
            >
              <CardHeader>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center mb-3 shadow-[0_0_20px_rgba(245,158,11,0.5)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.7)] transition-shadow">
                  <Cookie className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-white text-lg">Cookie Clicker</CardTitle>
                <CardDescription className="text-slate-400">
                  Click cookies and buy upgrades in this addictive idle game
                </CardDescription>
                <div className="flex flex-wrap gap-1 mt-3">
                  {['Clicker', 'Upgrade', 'ScoreBoard', 'Grid'].map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full border border-amber-500/30">{tag}</span>
                  ))}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Instructions */}
          <Card 
            className="bg-slate-900/40 border-slate-700/30 backdrop-blur"
            style={{
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }}
          >
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                How it works
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-400">
              <div className="grid md:grid-cols-2 gap-4">
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Describe the game you want to play</li>
                  <li>AI generates a complete game specification</li>
                  <li>Play instantly with Entities, Physics, Particles</li>
                  <li>No coding required!</li>
                </ol>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Powered by Kimi 2.5 via OpenRouter</p>
                  <div className="flex flex-wrap gap-2">
                    {['Entity', 'Projectile', 'Collectible', 'Obstacle', 'HealthBar', 'ProgressBar', 'AnimatedSprite', 'PhysicsBody', 'Draggable', 'ParticleEffect', 'Joystick', 'PowerUp'].map(component => (
                      <span key={component} className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
                        {component}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
