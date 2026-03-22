"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card as UICard } from "@/components/ui/card";
import { Button as UIButton } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// ============================================
// EXISTING COMPONENTS (ENHANCED WITH NEON)
// ============================================

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
        !isDisabled && !isMatched && "hover:scale-105 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]",
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
            <UICard className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-cyan-500/30 hover:border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
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
              "w-full h-full flex items-center justify-center border-2 shadow-lg",
              isMatched 
                ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.5)]" 
                : "bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]"
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
  variant?: "primary" | "secondary" | "danger" | "success" | "neon";
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
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white border border-slate-600",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]",
    success: "bg-green-600 hover:bg-green-700 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]",
    neon: "bg-transparent border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 shadow-[0_0_15px_rgba(34,211,238,0.4)] hover:shadow-[0_0_25px_rgba(34,211,238,0.6)]",
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
        "font-semibold rounded-lg transition-all duration-200 active:scale-95",
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
      <Badge variant="default" className="text-lg px-4 py-2 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]">
        Score: {score}
      </Badge>
      {highScore !== undefined && (
        <Badge variant="secondary" className="text-lg px-4 py-2 border border-purple-500/50">
          Best: {highScore}
        </Badge>
      )}
      {turns !== undefined && (
        <Badge variant="outline" className="text-lg px-4 py-2 border-cyan-500/50 text-cyan-300">
          Turns: {turns}
        </Badge>
      )}
      {level !== undefined && (
        <Badge variant="default" className="text-lg px-4 py-2 bg-purple-600 shadow-[0_0_10px_rgba(147,51,234,0.5)]">
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
        isRunning ? "text-cyan-400" : "text-slate-400",
        isLow && "text-red-400 animate-pulse"
      )}>
        ⏱️ {displayTime}
      </div>
      {maxSeconds && (
        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <div
            className={cn(
              "h-full transition-all duration-1000 shadow-[0_0_10px_currentColor]",
              isLow ? "bg-red-500 shadow-red-500/50" : "bg-cyan-500 shadow-cyan-500/50"
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
    easy: "bg-green-600 shadow-[0_0_10px_rgba(34,197,94,0.5)]",
    medium: "bg-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.5)]",
    hard: "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]",
  };

  return (
    <UICard className={cn("p-6 bg-slate-900/80 border border-slate-700/50 backdrop-blur", className)}>
      <div className="flex flex-wrap gap-2 mb-4">
        {category && (
          <Badge variant="outline" className="border-cyan-500/50 text-cyan-300">{category}</Badge>
        )}
        {difficulty && (
          <Badge className={difficultyColors[difficulty]}>
            {difficulty}
          </Badge>
        )}
        {questionNumber && totalQuestions && (
          <Badge variant="secondary" className="border border-purple-500/30">
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
      if (isCorrect) return "bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]";
      if (isSelected) return "bg-red-600 border-red-400 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]";
      return "bg-slate-800 border-slate-700 text-slate-500";
    }
    if (isSelected) {
      return "bg-cyan-600 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] ring-2 ring-cyan-300";
    }
    return "bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:border-cyan-500/50";
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
          isRevealed && isCorrect && "bg-green-400 text-green-900",
          isRevealed && isSelected && !isCorrect && "bg-red-400 text-red-900",
          !isRevealed && isSelected && "bg-cyan-400 text-cyan-900",
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
        "shadow-[0_0_30px_rgba(251,191,36,0.5)] hover:shadow-[0_0_50px_rgba(251,191,36,0.7)]",
        "active:scale-95 transition-all duration-100 flex items-center justify-center",
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
        ? "bg-slate-800/80 border-cyan-500/50 hover:border-cyan-400 cursor-pointer hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]" 
        : "bg-slate-900/60 border-slate-800 opacity-60"
    )}
    onClick={canAfford ? onBuy : undefined}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-white">{name}</h4>
        {owned > 0 && (
          <Badge variant="default" className="bg-cyan-600 shadow-[0_0_5px_rgba(6,182,212,0.5)]">
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
          className={canAfford ? "bg-amber-500 text-black shadow-[0_0_5px_rgba(245,158,11,0.5)]" : ""}
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
              isNewHighScore ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" : "text-white"
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
          <GameButton onClick={onMenu} variant="neon">
            📋 Main Menu
          </GameButton>
        )}
      </div>
    </div>
  );
}

// ============================================
// NEW GAME COMPONENTS
// ============================================

// Entity Component - Characters/enemies that move
interface EntityProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  emoji?: string;
  color?: string;
  health?: number;
  maxHealth?: number;
  isPlayer?: boolean;
  onClick?: () => void;
  className?: string;
}

export function Entity({
  x,
  y,
  width = 48,
  height = 48,
  emoji,
  color = "#3b82f6",
  health,
  maxHealth,
  isPlayer = false,
  onClick,
  className,
}: EntityProps) {
  return (
    <div
      className={cn(
        "absolute transition-all duration-100 flex flex-col items-center",
        onClick && "cursor-pointer hover:scale-110",
        isPlayer && "z-10",
        className
      )}
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
      onClick={onClick}
    >
      <div
        className={cn(
          "w-full h-full rounded-lg flex items-center justify-center text-2xl shadow-lg",
          isPlayer && "shadow-[0_0_20px_rgba(6,182,212,0.6)] border-2 border-cyan-400"
        )}
        style={{
          backgroundColor: color,
          boxShadow: isPlayer ? undefined : `0 0 15px ${color}80`,
        }}
      >
        {emoji}
      </div>
      {health !== undefined && maxHealth !== undefined && (
        <div className="w-full mt-1">
          <Progress value={(health / maxHealth) * 100} className="h-1.5" />
        </div>
      )}
    </div>
  );
}

// Projectile Component - Shots/missiles with trajectory
interface ProjectileProps {
  x: number;
  y: number;
  direction?: "up" | "down" | "left" | "right";
  emoji?: string;
  color?: string;
  size?: number;
  trail?: boolean;
  className?: string;
}

export function Projectile({
  x,
  y,
  direction = "up",
  emoji = "🔥",
  color = "#f59e0b",
  size = 24,
  trail = true,
  className,
}: ProjectileProps) {
  const rotationMap = {
    up: 0,
    right: 90,
    down: 180,
    left: 270,
  };

  return (
    <div
      className={cn(
        "absolute pointer-events-none",
        trail && "shadow-[0_0_10px_currentColor]",
        className
      )}
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `rotate(${rotationMap[direction]}deg)`,
        color,
      }}
    >
      <div className="text-lg">{emoji}</div>
    </div>
  );
}

// Collectible Component - Items to collect (coins, stars, power-ups)
interface CollectibleProps {
  x?: number;
  y?: number;
  type?: "coin" | "star" | "gem" | "heart" | "powerup" | "custom";
  emoji?: string;
  value?: number;
  onCollect?: () => void;
  isCollected?: boolean;
  animate?: boolean;
  className?: string;
}

export function Collectible({
  x,
  y,
  type = "coin",
  emoji,
  value = 10,
  onCollect,
  isCollected = false,
  animate = true,
  className,
}: CollectibleProps) {
  const typeEmojis = {
    coin: "🪙",
    star: "⭐",
    gem: "💎",
    heart: "❤️",
    powerup: "⚡",
    custom: emoji || "✨",
  };

  const typeColors = {
    coin: "#fbbf24",
    star: "#fbbf24",
    gem: "#3b82f6",
    heart: "#ef4444",
    powerup: "#a855f7",
    custom: "#22d3ee",
  };

  if (isCollected) return null;

  return (
    <button
      className={cn(
        "absolute flex flex-col items-center gap-1 transition-all",
        animate && "animate-bounce",
        onCollect && "cursor-pointer hover:scale-125",
        className
      )}
      style={{
        left: x,
        top: y,
        filter: `drop-shadow(0 0 8px ${typeColors[type]})`,
      }}
      onClick={onCollect}
    >
      <span className="text-2xl">{typeEmojis[type]}</span>
      {value > 0 && <span className="text-xs text-yellow-300 font-bold">+{value}</span>}
    </button>
  );
}

// Obstacle Component - Things to avoid
interface ObstacleProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
  type?: "spike" | "block" | "laser" | "pit" | "enemy" | "custom";
  emoji?: string;
  color?: string;
  damage?: number;
  isMoving?: boolean;
  className?: string;
}

export function Obstacle({
  x,
  y,
  width = 48,
  height = 48,
  type = "spike",
  emoji,
  color,
  damage = 1,
  isMoving = false,
  className,
}: ObstacleProps) {
  const typeEmojis = {
    spike: "🔺",
    block: "🧱",
    laser: "🔴",
    pit: "⚫",
    enemy: "👾",
    custom: emoji || "⚠️",
  };

  const typeColors = {
    spike: "#ef4444",
    block: "#78716c",
    laser: "#f43f5e",
    pit: "#1c1917",
    enemy: "#dc2626",
    custom: color || "#f97316",
  };

  return (
    <div
      className={cn(
        "absolute flex items-center justify-center rounded",
        isMoving && "animate-pulse",
        className
      )}
      style={{
        left: x,
        top: y,
        width,
        height,
        backgroundColor: typeColors[type] + "40",
        border: `2px solid ${typeColors[type]}`,
        boxShadow: `0 0 15px ${typeColors[type]}60`,
      }}
    >
      <span className="text-2xl">{typeEmojis[type]}</span>
    </div>
  );
}

// HealthBar Component - HP display
interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "segmented" | "hearts";
  className?: string;
}

export function HealthBar({
  current,
  max,
  label,
  showValue = true,
  size = "md",
  variant = "default",
  className,
}: HealthBarProps) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  
  const sizeClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  const getHealthColor = () => {
    if (percentage > 60) return "bg-gradient-to-r from-green-500 to-emerald-400";
    if (percentage > 30) return "bg-gradient-to-r from-yellow-500 to-amber-400";
    return "bg-gradient-to-r from-red-600 to-red-400 animate-pulse";
  };

  if (variant === "hearts") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        {label && <span className="text-sm text-slate-400 mr-2">{label}</span>}
        {Array.from({ length: max }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "text-lg transition-all",
              i < current ? "text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.6)]" : "text-slate-700"
            )}
          >
            ❤️
          </span>
        ))}
      </div>
    );
  }

  if (variant === "segmented") {
    return (
      <div className={cn("space-y-1", className)}>
        {(label || showValue) && (
          <div className="flex justify-between text-sm">
            {label && <span className="text-slate-400">{label}</span>}
            {showValue && <span className="text-slate-300">{current}/{max}</span>}
          </div>
        )}
        <div className={cn("flex gap-1", sizeClasses[size])}>
          {Array.from({ length: max }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "flex-1 rounded transition-all",
                i < current 
                  ? getHealthColor() 
                  : "bg-slate-800"
              )}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showValue) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-slate-400">{label}</span>}
          {showValue && <span className="text-slate-300">{current}/{max}</span>}
        </div>
      )}
      <div className={cn("w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700", sizeClasses[size])}>
        <div
          className={cn("h-full transition-all duration-300 shadow-[0_0_10px_currentColor]", getHealthColor())}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ProgressBar Component - Progress tracking
interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ProgressBar({
  value,
  max,
  label,
  showPercentage = false,
  color = "#3b82f6",
  size = "md",
  className,
}: ProgressBarProps) {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));

  const sizeClasses = {
    sm: "h-2",
    md: "h-4",
    lg: "h-6",
  };

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between text-sm">
          {label && <span className="text-slate-400">{label}</span>}
          {showPercentage && <span className="text-slate-300">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700", sizeClasses[size])}>
        <div
          className="h-full transition-all duration-300"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}80`,
          }}
        />
      </div>
    </div>
  );
}

// AnimatedSprite Component - Animated game sprites
interface AnimatedSpriteProps {
  x?: number;
  y?: number;
  frames: string[];
  frameRate?: number;
  isPlaying?: boolean;
  size?: number;
  onAnimationEnd?: () => void;
  className?: string;
}

export function AnimatedSprite({
  x = 0,
  y = 0,
  frames,
  frameRate = 10,
  isPlaying = true,
  size = 64,
  onAnimationEnd,
  className,
}: AnimatedSpriteProps) {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    if (!isPlaying || frames.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentFrame((prev) => {
        const next = (prev + 1) % frames.length;
        if (next === 0 && onAnimationEnd) {
          onAnimationEnd();
        }
        return next;
      });
    }, 1000 / frameRate);

    return () => clearInterval(interval);
  }, [isPlaying, frames.length, frameRate, onAnimationEnd]);

  return (
    <div
      className={cn("absolute flex items-center justify-center", className)}
      style={{ left: x, top: y, width: size, height: size }}
    >
      <div className="text-4xl transition-all duration-75">{frames[currentFrame]}</div>
    </div>
  );
}

// PhysicsBody Component - Physics-enabled objects
interface PhysicsBodyProps {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  width?: number;
  height?: number;
  mass?: number;
  emoji?: string;
  color?: string;
  gravity?: number;
  friction?: number;
  bounce?: number;
  onCollision?: () => void;
  className?: string;
}

export function PhysicsBody({
  x,
  y,
  vx = 0,
  vy = 0,
  width = 48,
  height = 48,
  emoji = "📦",
  color = "#a16207",
  className,
}: PhysicsBodyProps) {
  const [position, setPosition] = useState({ x, y });
  const [velocity, setVelocity] = useState({ x: vx, y: vy });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationId: number;
    const gravity = 0.5;
    const friction = 0.98;
    const bounce = 0.7;
    const groundY = 400;

    const update = () => {
      setVelocity((v) => ({ ...v, y: v.y + gravity }));
      
      setPosition((pos) => {
        let newX = pos.x + velocity.x;
        let newY = pos.y + velocity.y;
        let newVx = velocity.x * friction;
        let newVy = velocity.y;

        // Ground collision
        if (newY + height > groundY) {
          newY = groundY - height;
          newVy = -velocity.y * bounce;
        }

        // Wall collision
        const containerWidth = containerRef.current?.parentElement?.clientWidth || 800;
        if (newX < 0 || newX + width > containerWidth) {
          newVx = -velocity.x * bounce;
          newX = Math.max(0, Math.min(newX, containerWidth - width));
        }

        setVelocity({ x: newVx, y: newVy });
        return { x: newX, y: newY };
      });

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
  }, [velocity.x, velocity.y, height]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "absolute flex items-center justify-center rounded-lg",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        width,
        height,
        backgroundColor: color,
        boxShadow: `0 0 15px ${color}60`,
      }}
    >
      <span className="text-2xl">{emoji}</span>
    </div>
  );
}

// Draggable Component - Draggable items
interface DraggableProps {
  id: string;
  x: number;
  y: number;
  emoji?: string;
  label?: string;
  color?: string;
  size?: number;
  snapToGrid?: boolean;
  gridSize?: number;
  onDragStart?: (id: string) => void;
  onDragEnd?: (id: string, x: number, y: number) => void;
  className?: string;
}

export function Draggable({
  id,
  x,
  y,
  emoji,
  label,
  color = "#3b82f6",
  size = 64,
  snapToGrid = false,
  gridSize = 64,
  onDragStart,
  onDragEnd,
  className,
}: DraggableProps) {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    onDragStart?.(id);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;

      if (snapToGrid) {
        newX = Math.round(newX / gridSize) * gridSize;
        newY = Math.round(newY / gridSize) * gridSize;
      }

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        onDragEnd?.(id, position.x, position.y);
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, snapToGrid, gridSize, id, position.x, position.y, onDragEnd]);

  return (
    <div
      className={cn(
        "absolute flex flex-col items-center justify-center rounded-xl cursor-grab select-none transition-shadow",
        isDragging && "cursor-grabbing z-50 scale-110 shadow-[0_0_30px_rgba(6,182,212,0.6)]",
        !isDragging && "hover:shadow-[0_0_15px_rgba(6,182,212,0.3)]",
        className
      )}
      style={{
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        backgroundColor: color + "30",
        border: `2px solid ${color}`,
      }}
      onMouseDown={handleMouseDown}
    >
      {emoji && <span className="text-2xl">{emoji}</span>}
      {label && <span className="text-xs text-white mt-1">{label}</span>}
    </div>
  );
}

// ParticleEffect Component - Visual effects (explosions, sparks)
interface ParticleEffectProps {
  x: number;
  y: number;
  type?: "explosion" | "sparkle" | "smoke" | "hearts" | "stars";
  count?: number;
  color?: string;
  duration?: number;
  onComplete?: () => void;
  className?: string;
}

export function ParticleEffect({
  x,
  y,
  type = "explosion",
  count = 12,
  color = "#f59e0b",
  duration = 1000,
  onComplete,
  className,
}: ParticleEffectProps) {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
  }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const speed = 2 + Math.random() * 3;
      return {
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        size: 4 + Math.random() * 8,
      };
    });
    setParticles(newParticles);

    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        onComplete?.();
        return;
      }

      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          vy: p.vy + 0.2, // gravity
          life: 1 - progress,
        }))
      );

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [count, duration, onComplete]);

  const typeEmojis = {
    explosion: "💥",
    sparkle: "✨",
    smoke: "💨",
    hearts: "💖",
    stars: "⭐",
  };

  return (
    <div
      className={cn("absolute pointer-events-none", className)}
      style={{ left: x, top: y }}
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            opacity: p.life,
            transform: `scale(${p.life})`,
            fontSize: p.size,
            color,
            textShadow: `0 0 10px ${color}`,
          }}
        >
          {typeEmojis[type]}
        </div>
      ))}
    </div>
  );
}

// Joystick Component - Mobile-style controls
interface JoystickProps {
  size?: number;
  onMove?: (x: number, y: number) => void;
  onEnd?: () => void;
  className?: string;
}

export function Joystick({
  size = 120,
  onMove,
  onEnd,
  className,
}: JoystickProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    updatePosition(clientX, clientY);
  };

  const updatePosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const maxDistance = size * 0.3;
    let dx = clientX - centerX;
    let dy = clientY - centerY;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > maxDistance) {
      dx = (dx / distance) * maxDistance;
      dy = (dy / distance) * maxDistance;
    }
    
    setPosition({ x: dx, y: dy });
    onMove?.(dx / maxDistance, dy / maxDistance);
  };

  const handleEnd = () => {
    setIsDragging(false);
    setPosition({ x: 0, y: 0 });
    onEnd?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative rounded-full bg-slate-800/50 border-2 border-slate-600 touch-none select-none",
        className
      )}
      style={{ width: size, height: size }}
      onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
      onMouseMove={(e) => isDragging && updatePosition(e.clientX, e.clientY)}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchMove={(e) => isDragging && updatePosition(e.touches[0].clientX, e.touches[0].clientY)}
      onTouchEnd={handleEnd}
    >
      <div
        className={cn(
          "absolute rounded-full bg-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-transform",
          !isDragging && "transition-all duration-200"
        )}
        style={{
          width: size * 0.4,
          height: size * 0.4,
          left: "50%",
          top: "50%",
          marginLeft: -(size * 0.2) + position.x,
          marginTop: -(size * 0.2) + position.y,
        }}
      />
    </div>
  );
}

// PowerUp Component - Temporary boosts
interface PowerUpProps {
  type: "speed" | "shield" | "double" | "magnet" | "freeze" | "custom";
  emoji?: string;
  name?: string;
  duration?: number;
  isActive?: boolean;
  onActivate?: () => void;
  className?: string;
}

export function PowerUp({
  type,
  emoji,
  name,
  duration = 5,
  isActive = false,
  onActivate,
  className,
}: PowerUpProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0.1) {
          return 0;
        }
        return prev - 0.1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive, duration]);

  const powerUpData = {
    speed: { emoji: "⚡", name: "Speed Boost", color: "#fbbf24", bgColor: "#fbbf2420" },
    shield: { emoji: "🛡️", name: "Shield", color: "#3b82f6", bgColor: "#3b82f620" },
    double: { emoji: "2️⃣", name: "Double Points", color: "#a855f7", bgColor: "#a855f720" },
    magnet: { emoji: "🧲", name: "Coin Magnet", color: "#22c55e", bgColor: "#22c55e20" },
    freeze: { emoji: "❄️", name: "Time Freeze", color: "#06b6d4", bgColor: "#06b6d420" },
    custom: { emoji: emoji || "✨", name: name || "Power Up", color: "#f97316", bgColor: "#f9731620" },
  };

  const data = powerUpData[type];
  const progress = (timeLeft / duration) * 100;

  return (
    <button
      onClick={!isActive ? onActivate : undefined}
      className={cn(
        "relative flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all",
        isActive 
          ? "scale-105 shadow-[0_0_20px_currentColor]" 
          : "hover:scale-105 hover:shadow-[0_0_15px_currentColor]",
        className
      )}
      style={{
        borderColor: data.color,
        backgroundColor: data.bgColor,
        color: data.color,
      }}
      disabled={isActive}
    >
      <span className="text-xl">{data.emoji}</span>
      <span className="font-semibold text-sm">{data.name}</span>
      {isActive && (
        <div
          className="absolute bottom-0 left-0 h-1 rounded-b-lg transition-all"
          style={{
            width: `${progress}%`,
            backgroundColor: data.color,
          }}
        />
      )}
    </button>
  );
}

// GameContainer Component - Container with game area
interface GameContainerProps {
  width?: number;
  height?: number;
  children?: React.ReactNode;
  className?: string;
}

export function GameContainer({
  width = 800,
  height = 600,
  children,
  className,
}: GameContainerProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-slate-700/50 bg-slate-900/80",
        "shadow-[0_0_40px_rgba(6,182,212,0.1)]",
        className
      )}
      style={{ width, height }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      {children}
    </div>
  );
}
