"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { GameButton } from "./GameComponents";
import { Loader2, Sparkles, Gamepad2, Brain, Cookie } from "lucide-react";
import { GameSpec } from "../types/game";
import { generateGame, EXAMPLE_GAMES } from "../lib/gameGenerator";

interface PromptInterfaceProps {
  onGameGenerated: (game: GameSpec) => void;
  onSelectExample: (game: GameSpec) => void;
}

const EXAMPLE_PROMPTS = [
  "Memory game with space theme",
  "Quiz about animals with 10 questions",
  "Clicker game with cookie upgrades",
  "Matching game with emojis",
  "Trivia about world capitals",
  "Clicker game with farm theme and animals",
];

export default function PromptInterface({ onGameGenerated, onSelectExample }: PromptInterfaceProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full shadow-lg">
            <Gamepad2 className="w-6 h-6" />
            <h1 className="text-2xl font-bold">AI Game Generator</h1>
          </div>
          <p className="text-slate-400 max-w-lg mx-auto">
            Describe any game you want to play, and AI will generate it for you instantly. 
            From memory games to quizzes to clickers - your imagination is the limit!
          </p>
        </div>

        {/* Prompt Input */}
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              Describe Your Game
            </CardTitle>
            <CardDescription>
              Tell us what kind of game you want to play. Be creative!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A memory game with space rockets and planets..."
              className="min-h-[120px] bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 resize-none"
            />
            
            {error && (
              <div className="p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
                {error}
              </div>
            )}
            
            <GameButton
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              variant="primary"
              size="lg"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin inline" />
                  Generating Game...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2 inline" />
                  Generate Game
                </>
              )}
            </GameButton>
          </CardContent>
        </Card>

        {/* Example Prompts */}
        <div className="space-y-3">
          <h3 className="text-slate-400 text-sm font-medium">Try these examples:</h3>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((example, i) => (
              <button
                key={i}
                onClick={() => handleExampleClick(example)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-full text-sm text-slate-300 transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Example Games */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card 
            className="bg-gradient-to-br from-blue-900/50 to-purple-900/50 border-blue-800/50 hover:border-blue-700/50 cursor-pointer transition-all hover:scale-105 group"
            onClick={() => onSelectExample(EXAMPLE_GAMES.memory)}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-blue-500/30 transition-colors">
                <span className="text-2xl">🚀</span>
              </div>
              <CardTitle className="text-white text-lg">Space Memory</CardTitle>
              <CardDescription className="text-slate-400">
                Match pairs of space-themed cards in this cosmic memory challenge
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-800/50 hover:border-green-700/50 cursor-pointer transition-all hover:scale-105 group"
            onClick={() => onSelectExample(EXAMPLE_GAMES.quiz)}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-green-500/30 transition-colors">
                <Brain className="w-6 h-6 text-green-400" />
              </div>
              <CardTitle className="text-white text-lg">Animal Trivia</CardTitle>
              <CardDescription className="text-slate-400">
                Test your knowledge of amazing animals with timed questions
              </CardDescription>
            </CardHeader>
          </Card>

          <Card 
            className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border-amber-800/50 hover:border-amber-700/50 cursor-pointer transition-all hover:scale-105 group"
            onClick={() => onSelectExample(EXAMPLE_GAMES.clicker)}
          >
            <CardHeader>
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mb-3 group-hover:bg-amber-500/30 transition-colors">
                <Cookie className="w-6 h-6 text-amber-400" />
              </div>
              <CardTitle className="text-white text-lg">Cookie Clicker</CardTitle>
              <CardDescription className="text-slate-400">
                Click cookies and buy upgrades in this addictive idle game
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="bg-slate-800/30 border-slate-700/50">
          <CardHeader>
            <CardTitle className="text-white text-base">How it works</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 text-sm space-y-2">
            <ol className="list-decimal list-inside space-y-1">
              <li>Describe the game you want to play</li>
              <li>AI generates a complete game specification</li>
              <li>Play instantly in your browser</li>
              <li>No coding required!</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
