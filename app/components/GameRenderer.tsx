"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { GameSpec, GameState } from "../types/game";
import {
  GameCard,
  GameButton,
  GameGrid,
  ScoreBoard,
  Timer,
  QuestionCard,
  AnswerOption,
  Clicker,
  Upgrade,
  GameOver,
} from "./GameComponents";

// Component registry for json-render
const componentRegistry = {
  Card: GameCard,
  Button: GameButton,
  Grid: GameGrid,
  ScoreBoard,
  Timer,
  QuestionCard,
  AnswerOption,
  Clicker,
  Upgrade,
  GameOver,
};

// Shuffle array helper
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

interface GameRendererProps {
  gameSpec: GameSpec;
  onExit?: () => void;
}

export default function GameRenderer({ gameSpec, onExit }: GameRendererProps) {
  const [gameState, setGameState] = useState<GameState>(gameSpec.initialState);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  const autoClickerRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize game based on type
  useEffect(() => {
    if (gameSpec.name.toLowerCase().includes("memory") || 
        (gameSpec.components.some(c => c.type === "Card" && c.props?.value))) {
      // Memory game initialization
      const gridChildren = gameSpec.components
        .find(c => c.type === "Grid")
        ?.children;
      const cards = Array.isArray(gridChildren)
        ? gridChildren.map((child: any, index: number) => ({
            ...child,
            id: index,
            isFlipped: false,
            isMatched: false,
            value: child.props?.value || "❓",
          }))
        : [];
      setShuffledCards(shuffleArray(cards));
    }

    if (gameSpec.name.toLowerCase().includes("clicker") ||
        gameSpec.components.some(c => c.type === "Clicker")) {
      // Clicker game - start auto-clicker loop
      autoClickerRef.current = setInterval(() => {
        setGameState(prev => {
          if (!prev.isPlaying || prev.gameOver) return prev;
          const autoClicks = prev.autoClicks || 0;
          if (autoClicks > 0) {
            return { ...prev, score: prev.score + autoClicks };
          }
          return prev;
        });
      }, 1000);
    }

    // Start timer if game has one
    if (gameSpec.components.some(c => c.type === "Timer")) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (!prev.isPlaying || prev.gameOver) return prev;
          const newTimer = prev.timer + 1;
          
          // Check if quiz game timer ran out
          if (gameSpec.name.toLowerCase().includes("quiz") && prev.timer <= 1) {
            return { ...prev, gameOver: true, isPlaying: false };
          }
          
          return { ...prev, timer: newTimer };
        });
      }, 1000);
    }

    return () => {
      if (autoClickerRef.current) clearInterval(autoClickerRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameSpec]);

  // Memory game handlers
  const handleCardClick = useCallback((index: number) => {
    setGameState(prev => {
      const flippedCards = prev.flippedCards || [];
      
      // Can't flip more than 2 cards
      if (flippedCards.length >= 2) return prev;
      
      // Can't flip already matched or flipped cards
      if (shuffledCards[index]?.isMatched || flippedCards.includes(index)) {
        return prev;
      }

      const newFlippedCards = [...flippedCards, index];
      
      // Update flipped state
      setShuffledCards(cards => 
        cards.map((c, i) => i === index ? { ...c, isFlipped: true } : c)
      );

      // Check for match when 2 cards flipped
      if (newFlippedCards.length === 2) {
        const [first, second] = newFlippedCards;
        const firstCard = shuffledCards[first];
        const secondCard = shuffledCards[second];

        setTimeout(() => {
          if (firstCard?.value === secondCard?.value) {
            // Match found
            setShuffledCards(cards => 
              cards.map((c, i) =>
                i === first || i === second ? { ...c, isMatched: true } : c
              )
            );
            setGameState(p => ({
              ...p,
              score: p.score + 100,
              matchedPairs: (p.matchedPairs || 0) + 1,
              flippedCards: [],
              gameOver: (p.matchedPairs || 0) + 1 >= (p.totalPairs || 8),
            }));
          } else {
            // No match - flip back
            setShuffledCards(cards =>
              cards.map((c, i) =>
                i === first || i === second ? { ...c, isFlipped: false } : c
              )
            );
            setGameState(p => ({
              ...p,
              turns: p.turns + 1,
              flippedCards: [],
            }));
          }
        }, 1000);
      }

      return { ...prev, flippedCards: newFlippedCards };
    });
  }, [shuffledCards]);

  // Quiz game handlers
  const handleAnswerSelect = useCallback((answerIndex: number) => {
    setGameState(prev => {
      if (prev.isRevealed || prev.gameOver) return prev;
      
      const currentQ = prev.questions?.[prev.currentQuestion || 0];
      const isCorrect = currentQ?.correct === answerIndex;
      
      return {
        ...prev,
        selectedAnswer: answerIndex,
        isRevealed: true,
        score: isCorrect ? prev.score + 100 : prev.score,
      };
    });

    // Auto-advance to next question after delay
    setTimeout(() => {
      setGameState(prev => {
        const nextQuestion = (prev.currentQuestion || 0) + 1;
        const totalQuestions = prev.questions?.length || 0;
        
        if (nextQuestion >= totalQuestions) {
          return { ...prev, gameOver: true, isPlaying: false };
        }
        
        return {
          ...prev,
          currentQuestion: nextQuestion,
          selectedAnswer: null,
          isRevealed: false,
        };
      });
    }, 1500);
  }, []);

  // Clicker game handlers
  const handleCookieClick = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + (prev.clickPower || 1),
      clicks: (prev.clicks || 0) + 1,
    }));
  }, []);

  const handleUpgradePurchase = useCallback((upgradeId: string) => {
    setGameState(prev => {
      const upgrade = prev.upgrades?.find((u: any) => u.id === upgradeId);
      if (!upgrade || prev.score < upgrade.cost) return prev;

      const newUpgrades = prev.upgrades.map((u: any) =>
        u.id === upgradeId 
          ? { ...u, owned: (u.owned || 0) + 1, cost: Math.floor(u.cost * 1.15) }
          : u
      );

      const autoClicks = newUpgrades.reduce((sum: number, u: any) => 
        sum + ((u.owned || 0) * (u.cps || 0)), 0
      );

      return {
        ...prev,
        score: prev.score - upgrade.cost,
        upgrades: newUpgrades,
        autoClicks,
      };
    });
  }, []);

  // Reset game
  const handleRestart = useCallback(() => {
    setGameState(gameSpec.initialState);
    if (gameSpec.name.toLowerCase().includes("memory")) {
      const gridChildren = gameSpec.components
        .find(c => c.type === "Grid")
        ?.children;
      const cards = Array.isArray(gridChildren)
        ? gridChildren.map((child: any, index: number) => ({
            ...child,
            id: index,
            isFlipped: false,
            isMatched: false,
            value: child.props?.value || "❓",
          }))
        : [];
      setShuffledCards(shuffleArray(cards));
    }
  }, [gameSpec]);

  // Render component based on type
  const renderComponent = (component: any, index: number): React.ReactNode => {
    const { type, props = {}, children } = component;

    switch (type) {
      case "ScoreBoard":
        return (
          <ScoreBoard
            key={index}
            score={gameState.score}
            highScore={gameState.highScore}
            turns={gameState.turns}
            level={gameState.level}
            {...props}
          />
        );

      case "Timer":
        // For quiz games, show countdown
        const isQuiz = gameSpec.name.toLowerCase().includes("quiz");
        const displaySeconds = isQuiz 
          ? Math.max(0, (props.maxSeconds || 60) - gameState.timer)
          : gameState.timer;
        return (
          <Timer
            key={index}
            seconds={displaySeconds}
            maxSeconds={props.maxSeconds}
            isRunning={gameState.isPlaying && !gameState.gameOver}
            format={props.format}
          />
        );

      case "Grid":
        if (gameSpec.name.toLowerCase().includes("memory") && shuffledCards.length > 0) {
          return (
            <GameGrid key={index} columns={props.columns} gap={props.gap}>
              {shuffledCards.map((card, i) => (
                <GameCard
                  key={i}
                  isFlipped={card.isFlipped}
                  isMatched={card.isMatched}
                  isDisabled={gameState.gameOver || card.isMatched}
                  onClick={() => handleCardClick(i)}
                  backContent={
                    <div className="text-4xl">{card.value}</div>
                  }
                />
              ))}
            </GameGrid>
          );
        }
        
        if (gameSpec.name.toLowerCase().includes("clicker")) {
          return (
            <GameGrid key={index} columns={props.columns} gap={props.gap}>
              {gameState.upgrades?.map((upgrade: any, i: number) => (
                <Upgrade
                  key={i}
                  name={upgrade.name}
                  description={upgrade.description || `Generates ${upgrade.cps} per second`}
                  cost={upgrade.cost}
                  owned={upgrade.owned}
                  canAfford={gameState.score >= upgrade.cost}
                  effect={`${upgrade.cps}/sec`}
                  onBuy={() => handleUpgradePurchase(upgrade.id)}
                />
              ))}
            </GameGrid>
          );
        }
        
        return (
          <GameGrid key={index} columns={props.columns} gap={props.gap}>
            {Array.isArray(children) && children.map((child: any, i: number) => renderComponent(child, i))}
          </GameGrid>
        );

      case "Card":
        return <GameCard key={index} {...props} />;

      case "Button":
        return <GameButton key={index} {...props} />;

      case "QuestionCard":
        const currentQuestion = gameState.questions?.[gameState.currentQuestion || 0];
        return currentQuestion ? (
          <QuestionCard
            key={index}
            question={currentQuestion.question}
            category={currentQuestion.category}
            difficulty={currentQuestion.difficulty}
            questionNumber={(gameState.currentQuestion || 0) + 1}
            totalQuestions={gameState.questions?.length}
          />
        ) : null;

      case "AnswerOption":
        const q = gameState.questions?.[gameState.currentQuestion || 0];
        const answerIndex = index - gameSpec.components.findIndex((c: any) => c.type === "AnswerOption");
        const answer = q?.answers?.[answerIndex];
        if (!answer) return null;
        
        return (
          <AnswerOption
            key={index}
            answer={answer}
            letter={String.fromCharCode(65 + answerIndex)}
            isSelected={gameState.selectedAnswer === answerIndex}
            isCorrect={q?.correct === answerIndex}
            isRevealed={gameState.isRevealed}
            onClick={() => handleAnswerSelect(answerIndex)}
            disabled={gameState.isRevealed}
          />
        );

      case "Clicker":
        return (
          <div key={index} className="flex justify-center py-8">
            <Clicker
              onClick={handleCookieClick}
              emoji={props.emoji}
              size={props.size}
              disabled={gameState.gameOver}
            />
          </div>
        );

      case "Upgrade":
        const upg = gameState.upgrades?.find((u: any) => u.name === props.name);
        if (!upg) return null;
        return (
          <Upgrade
            key={index}
            name={upg.name}
            description={props.description}
            cost={upg.cost}
            owned={upg.owned}
            canAfford={gameState.score >= upg.cost}
            effect={props.effect}
            onBuy={() => handleUpgradePurchase(upg.id)}
          />
        );

      case "GameOver":
        if (!gameState.gameOver) return null;
        return (
          <GameOver
            key={index}
            score={gameState.score}
            highScore={Math.max(gameState.highScore || 0, gameState.score)}
            message={props.message}
            onRestart={handleRestart}
            onMenu={onExit}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div 
      className="min-h-screen p-4 md:p-8"
      style={{ 
        backgroundColor: gameSpec.theme.colors.background,
        color: gameSpec.theme.colors.text,
        fontFamily: gameSpec.theme.font,
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">{gameSpec.name}</h1>
          <GameButton onClick={onExit} variant="secondary" size="sm">
            ← Exit
          </GameButton>
        </div>

        {/* Game Description */}
        <p className="text-slate-400 mb-6 text-center">{gameSpec.description}</p>

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl max-w-md w-full">
              <GameOver
                score={gameState.score}
                highScore={Math.max(gameState.highScore || 0, gameState.score)}
                onRestart={handleRestart}
                onMenu={onExit}
              />
            </div>
          </div>
        )}

        {/* Render Game Components */}
        <div className="space-y-6">
          {gameSpec.components.map((component, index) => renderComponent(component, index))}
        </div>

        {/* Clicker Stats */}
        {(gameSpec.name.toLowerCase().includes("clicker") || gameState.clickPower) && (
          <div className="mt-8 text-center text-slate-400">
            <p>Clicks: {gameState.clicks || 0}</p>
            {gameState.autoClicks > 0 && <p>Per second: {gameState.autoClicks.toFixed(1)}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
