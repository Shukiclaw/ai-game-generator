"use client";

import React from "react";
import { Card as UICard } from "@/components/ui/card";
import { Button as UIButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Game Card Component
interface GameCardProps {
  id?: string;
  value?: any;
  isFlipped?: boolean;
  isMatched?: boolean;
  isDisabled?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  frontContent?: React.ReactNode;
  backContent?: React.ReactNode;
}

export function GameCard({
  isFlipped = false,
  isMatched = false,
  isDisabled = false,
  onClick,
  children,
  className,
  frontContent,
  backContent,
}: GameCardProps) {
  return (
    <div
      className={cn(
        "relative cursor-pointer transition-all duration-300 transform",
        isDisabled && "opacity-50 cursor-not-allowed",
        isMatched && "scale-95",
        className
      )}
      onClick={!isDisabled ? onClick : undefined}
    >
      <div
        className={cn(
          "relative w-full h-full transition-transform duration-500 transform-style-preserve-3d",
          isFlipped && "rotate-y-180"
        )}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (hidden when flipped) */}
        <div
          className="absolute inset-0 backface-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {frontContent || (
            <UICard className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-600 hover:border-slate-500">
              <span className="text-3xl">❓</span>
            </UICard>
          )}
        </div>
        {/* Back (shown when flipped) */}
        <div
          className="absolute inset-0 rotate-y-180"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          {backContent || (
            <UICard className={cn(
              "w-full h-full flex items-center justify-center border-2",
              isMatched 
                ? "bg-gradient-to-br from-green-500 to-green-600 border-green-400" 
                : "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400"
            )}>
              {children}
            </UICard>
          )}
        </div>
      </div>
    </div>
  );
}

// Game Button Component
interface GameButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  children?: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function GameButton({
  onClick,
  disabled,
  variant = "primary",
  size = "md",
  children,
  className,
  type = "button",
}: GameButtonProps) {
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-slate-600 hover:bg-slate-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <UIButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variantStyles[variant],
        sizeStyles[size],
        "font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {children}
    </UIButton>
  );
}

// Game Grid Component
interface GameGridProps {
  columns?: number;
  gap?: number;
  children?: React.ReactNode;
  className?: string;
}

export function GameGrid({
  columns = 4,
  gap = 4,
  children,
  className,
}: GameGridProps) {
  return (
    <div
      className={cn("grid", className)}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gap: `${gap * 0.25}rem`,
      }}
    >
      {children}
    </div>
  );
}

// ScoreBoard Component
interface ScoreBoardProps {
  score: number;
  highScore?: number;
  turns?: number;
  level?: number;
  className?: string;
}

export function ScoreBoard({
  score,
  highScore,
  turns,
  level,
  className,
}: ScoreBoardProps) {
  return (
    <div className={cn("flex flex-wrap gap-3 justify-center", className)}>
      <Badge variant="default" className="text-lg px-4 py-2 bg-blue-600">
        Score: {score}
      </Badge>
      {highScore !== undefined && (
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Best: {highScore}
        </Badge>
      )}
      {turns !== undefined && (
        <Badge variant="outline" className="text-lg px-4 py-2">
          Turns: {turns}
        </Badge>
      )}
      {level !== undefined && (
        <Badge variant="default" className="text-lg px-4 py-2 bg-purple-600">
          Level: {level}
        </Badge>
      )}
    </div>
  );
}

// Timer Component
interface TimerProps {
  seconds: number;
  maxSeconds?: number;
  isRunning?: boolean;
  format?: "seconds" | "minutes";
  className?: string;
}

export function Timer({
  seconds,
  maxSeconds,
  isRunning,
  format = "seconds",
  className,
}: TimerProps) {
  const displayTime = format === "minutes" 
    ? `${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, "0")}`
    : `${seconds}s`;

  const progress = maxSeconds ? (seconds / maxSeconds) * 100 : 100;
  const isLow = maxSeconds ? seconds < maxSeconds * 0.2 : false;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn(
        "text-2xl font-mono font-bold",
        isRunning ? "text-green-400" : "text-slate-400",
        isLow && "text-red-400 animate-pulse"
      )}>
        ⏱️ {displayTime}
      </div>
      {maxSeconds && (
        <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full transition-all duration-1000",
              isLow ? "bg-red-500" : "bg-green-500"
            )}
            style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}

// QuestionCard Component
interface QuestionCardProps {
  question: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  questionNumber?: number;
  totalQuestions?: number;
  className?: string;
}

export function QuestionCard({
  question,
  category,
  difficulty,
  questionNumber,
  totalQuestions,
  className,
}: QuestionCardProps) {
  const difficultyColors = {
    easy: "bg-green-600",
    medium: "bg-yellow-600",
    hard: "bg-red-600",
  };

  return (
    <UICard className={cn("p-6 bg-slate-800 border-slate-700", className)}>
      <div className="flex flex-wrap gap-2 mb-4">
        {category && (
          <Badge variant="outline">{category}</Badge>
        )}
        {difficulty && (
          <Badge className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
        )}
        {questionNumber && totalQuestions && (
          <Badge variant="secondary">
            Question {questionNumber} of {totalQuestions}
          </Badge>
        )}
      </div>
      <h3 className="text-xl font-semibold text-white leading-relaxed">
        {question}
      </h3>
    </UICard>
  );
}

// AnswerOption Component
interface AnswerOptionProps {
  answer: string;
  isSelected?: boolean;
  isCorrect?: boolean;
  isRevealed?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  letter?: string;
  className?: string;
}

export function AnswerOption({
  answer,
  isSelected,
  isCorrect,
  isRevealed,
  onClick,
  disabled,
  letter,
  className,
}: AnswerOptionProps) {
  const getStyles = () => {
    if (isRevealed) {
      if (isCorrect) return "bg-green-600 border-green-500 text-white";
      if (isSelected) return "bg-red-600 border-red-500 text-white";
      return "bg-slate-700 border-slate-600 text-slate-400";
    }
    if (isSelected) {
      return "bg-blue-600 border-blue-500 text-white ring-2 ring-blue-400";
    }
    return "bg-slate-700 border-slate-600 text-white hover:bg-slate-600";
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isRevealed}
      className={cn(
        "w-full p-4 rounded-lg border-2 text-left transition-all duration-200",
        "flex items-center gap-4",
        getStyles(),
        disabled && !isRevealed && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {letter && (
        <span className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
          isRevealed && isCorrect && "bg-green-500",
          isRevealed && isSelected && !isCorrect && "bg-red-500",
          !isRevealed && isSelected && "bg-blue-500",
          !isRevealed && !isSelected && "bg-slate-600"
        )}>
          {letter}
        </span>
      )}
      <span className="flex-1">{answer}</span>
      {isRevealed && isCorrect && <span>✅</span>}
      {isRevealed && isSelected && !isCorrect && <span>❌</span>}
    </button>
  );
}

// Clicker Component
interface ClickerProps {
  onClick?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  emoji?: string;
  disabled?: boolean;
  className?: string;
}

export function Clicker({
  onClick,
  size = "lg",
  emoji = "🎯",
  disabled,
  className,
}: ClickerProps) {
  const sizeStyles = {
    sm: "w-20 h-20 text-2xl",
    md: "w-32 h-32 text-4xl",
    lg: "w-40 h-40 text-5xl",
    xl: "w-56 h-56 text-7xl",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        sizeStyles[size],
        "rounded-full bg-gradient-to-br from-amber-400 to-orange-500",
        "shadow-xl hover:shadow-2xl active:scale-95 active:shadow-lg",
        "transition-all duration-100 flex items-center justify-center",
        "border-4 border-amber-300 hover:border-amber-200",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {emoji}
    </button>
  );
}

// Upgrade Component
interface UpgradeProps {
  name: string;
  description: string;
  cost: number;
  level?: number;
  owned?: number;
  onBuy?: () => void;
  canAfford?: boolean;
  effect?: string;
  className?: string;
}

export function Upgrade({
  name,
  description,
  cost,
  level,
  owned = 0,
  onBuy,
  canAfford = false,
  effect,
  className,
}: UpgradeProps) {
  return (
    <UICard className={cn(
      "p-4 border-2 transition-all duration-200",
      canAfford 
        ? "bg-slate-800 border-slate-600 hover:border-blue-500 cursor-pointer" 
        : "bg-slate-900 border-slate-700 opacity-60"
    )}
    onClick={canAfford ? onBuy : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-white">{name}</h4>
        {owned > 0 && (
          <Badge variant="default" className="bg-blue-600">
            x{owned}
          </Badge>
        )}
      </div>
      <p className="text-sm text-slate-400 mb-2">{description}</p>
      {effect && (
        <p className="text-xs text-green-400 mb-2">+{effect}</p>
      )}
      <div className="flex justify-between items-center">
        <Badge 
          variant={canAfford ? "default" : "secondary"}
          className={canAfford ? "bg-amber-500 text-black" : ""}
        >
          💰 {cost}
        </Badge>
        {level !== undefined && level > 0 && (
          <span className="text-xs text-slate-500">Lvl {level}</span>
        )}
      </div>
    </UICard>
  );
}

// Game Over Component
interface GameOverProps {
  score: number;
  highScore?: number;
  message?: string;
  onRestart?: () => void;
  onMenu?: () => void;
  className?: string;
}

export function GameOver({
  score,
  highScore,
  message,
  onRestart,
  onMenu,
  className,
}: GameOverProps) {
  const isNewHighScore = highScore !== undefined && score >= highScore;

  return (
    <div className={cn("text-center space-y-6", className)}>
      <div className="space-y-2">
        <h2 className="text-4xl font-bold text-white">
          {isNewHighScore ? "🏆 New High Score!" : "🎮 Game Over"}
        </h2>
        {message && <p className="text-slate-400">{message}</p>}
      </div>

      <div className="flex justify-center gap-4">
        <div className="text-center">
          <div className="text-sm text-slate-500">Score</div>
          <div className="text-3xl font-bold text-white">{score}</div>
        </div>
        {highScore !== undefined && (
          <div className="text-center">
            <div className="text-sm text-slate-500">Best</div>
            <div className={cn(
              "text-3xl font-bold",
              isNewHighScore ? "text-yellow-400" : "text-white"
            )}>
              {highScore}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 justify-center">
        {onRestart && (
          <GameButton onClick={onRestart} variant="success">
            🔄 Play Again
          </GameButton>
        )}
        {onMenu && (
          <GameButton onClick={onMenu} variant="secondary">
            📋 Main Menu
          </GameButton>
        )}
      </div>
    </div>
  );
}
