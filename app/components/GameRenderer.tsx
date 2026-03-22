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
  Entity,
  Projectile,
  Collectible,
  Obstacle,
  HealthBar,
  ProgressBar,
  AnimatedSprite,
  PhysicsBody,
  Draggable,
  ParticleEffect,
  Joystick,
  PowerUp,
  GameContainer,
} from "./GameComponents";

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
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; type: string }>>([]);
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
              cards.map((c, i) =
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
            setShuffledCards(cards =
              cards.map((c, i) =
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

      const newUpgrades = prev.upgrades.map((u: any) =
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

  // Shooter game handlers
  const handleEntityClick = useCallback((entityId: string) => {
    // Spawn particle effect
    const entity = gameState.enemies?.find((e: any) => e.id === entityId);
    if (entity) {
      setParticles(prev => [...prev, { id: `particle-${Date.now()}`, x: entity.x, y: entity.y, type: "explosion" }]);
      setTimeout(() => {
        setParticles(prev => prev.filter(p => !p.id.startsWith(`particle-${Date.now()}`)));
      }, 1000);
    }
  }, [gameState.enemies]);

  const handleCollectibleCollect = useCallback((collectibleId: string) => {
    setGameState(prev => ({
      ...prev,
      score: prev.score + 50,
      coinsCollected: (prev.coinsCollected || 0) + 1,
    }));
  }, []);

  // Draggable handlers
  const handleDragStart = useCallback((id: string) => {
    // Track drag start
  }, []);

  const handleDragEnd = useCallback((id: string, x: number, y: number) => {
    setGameState(prev => ({
      ...prev,
      moves: (prev.moves || 0) + 1,
    }));
  }, []);

  // Joystick handler
  const handleJoystickMove = useCallback((x: number, y: number) => {
    // Update player position based on joystick input
    setGameState(prev => ({
      ...prev,
      playerVelocityX: x * 5,
      playerVelocityY: y * 5,
    }));
  }, []);

  // PowerUp handler
  const handlePowerUpActivate = useCallback((type: string) => {
    setGameState(prev => ({
      ...prev,
      activePowerUp: type,
      powerUpTimeLeft: 5,
    }));
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
    setParticles([]);
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

      // NEW COMPONENTS
      case "Entity":
        return (
          <Entity
            key={index}
            x={props.x ?? gameState.playerX ?? 0}
            y={props.y ?? gameState.playerY ?? 0}
            width={props.width}
            height={props.height}
            emoji={props.emoji}
            color={props.color}
            health={props.health}
            maxHealth={props.maxHealth}
            isPlayer={props.isPlayer}
            onClick={props.onClick ? () => handleEntityClick(props.id) : undefined}
          />
        );

      case "Projectile":
        return (
          <Projectile
            key={index}
            x={props.x}
            y={props.y}
            direction={props.direction}
            emoji={props.emoji}
            color={props.color}
            size={props.size}
            trail={props.trail}
          />
        );

      case "Collectible":
        return (
          <Collectible
            key={index}
            x={props.x}
            y={props.y}
            type={props.type}
            emoji={props.emoji}
            value={props.value}
            onCollect={props.onCollect ? () => handleCollectibleCollect(props.id) : undefined}
            isCollected={gameState.collected?.includes(props.id)}
            animate={props.animate}
          />
        );

      case "Obstacle":
        return (
          <Obstacle
            key={index}
            x={props.x}
            y={props.y}
            width={props.width}
            height={props.height}
            type={props.type}
            emoji={props.emoji}
            color={props.color}
            damage={props.damage}
            isMoving={props.isMoving}
          />
        );

      case "HealthBar":
        return (
          <HealthBar
            key={index}
            current={props.current ?? gameState.playerHealth ?? gameState.health ?? 100}
            max={props.max ?? gameState.playerMaxHealth ?? gameState.maxHealth ?? 100}
            label={props.label}
            showValue={props.showValue}
            size={props.size}
            variant={props.variant}
          />
        );

      case "ProgressBar":
        return (
          <ProgressBar
            key={index}
            value={props.value ?? gameState.progress ?? gameState.coinsCollected ?? 0}
            max={props.max ?? gameState.totalCoins ?? gameState.totalPieces ?? 100}
            label={props.label}
            showPercentage={props.showPercentage}
            color={props.color}
            size={props.size}
          />
        );

      case "AnimatedSprite":
        return (
          <AnimatedSprite
            key={index}
            x={props.x}
            y={props.y}
            frames={props.frames}
            frameRate={props.frameRate}
            isPlaying={props.isPlaying}
            size={props.size}
            onAnimationEnd={props.onAnimationEnd}
          />
        );

      case "PhysicsBody":
        return (
          <PhysicsBody
            key={index}
            x={props.x ?? gameState.playerX ?? 0}
            y={props.y ?? gameState.playerY ?? 0}
            vx={props.vx ?? gameState.playerVelocityX ?? 0}
            vy={props.vy ?? gameState.playerVelocityY ?? 0}
            width={props.width}
            height={props.height}
            mass={props.mass}
            emoji={props.emoji}
            color={props.color}
            gravity={props.gravity}
            friction={props.friction}
            bounce={props.bounce}
          />
        );

      case "Draggable":
        return (
          <Draggable
            key={index}
            id={props.id}
            x={props.x}
            y={props.y}
            emoji={props.emoji}
            label={props.label}
            color={props.color}
            size={props.size}
            snapToGrid={props.snapToGrid}
            gridSize={props.gridSize}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        );

      case "ParticleEffect":
        return (
          <ParticleEffect
            key={index}
            x={props.x}
            y={props.y}
            type={props.type}
            count={props.count}
            color={props.color}
            duration={props.duration}
            onComplete={props.onComplete}
          />
        );

      case "Joystick":
        return (
          <div key={index} className="flex justify-center py-4">
            <Joystick
              size={props.size}
              onMove={handleJoystickMove}
              onEnd={props.onEnd}
            />
          </div>
        );

      case "PowerUp":
        return (
          <PowerUp
            key={index}
            type={props.type}
            emoji={props.emoji}
            name={props.name}
            duration={props.duration}
            isActive={gameState.activePowerUp === props.type}
            onActivate={() => handlePowerUpActivate(props.type)}
          />
        );

      case "GameContainer":
        return (
          <GameContainer
            key={index}
            width={props.width}
            height={props.height}
          >
            {Array.isArray(children) && children.map((child: any, i: number) => renderComponent(child, i))}
            {/* Render active particles */}
            {particles.map((p) => (
              <ParticleEffect
                key={p.id}
                x={p.x}
                y={p.y}
                type={p.type}
                count={12}
                onComplete={() => setParticles(prev => prev.filter(part => part.id !== p.id))}
              />
            ))}
          </GameContainer>
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
      className="min-h-screen p-4 md:p-8 relative overflow-hidden"
      style={{ 
        backgroundColor: gameSpec.theme.colors.background,
        color: gameSpec.theme.colors.text,
        fontFamily: gameSpec.theme.font,
      }}
    >
      {/* Animated grid background */}
      <div 
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(${gameSpec.theme.colors.primary}40 1px, transparent 1px),
            linear-gradient(90deg, ${gameSpec.theme.colors.primary}40 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 
            className="text-3xl md:text-4xl font-bold"
            style={{ 
              color: gameSpec.theme.colors.primary,
              textShadow: `0 0 20px ${gameSpec.theme.colors.primary}60`,
            }}
          >
            {gameSpec.name}
          </h1>
          <GameButton onClick={onExit} variant="neon" size="sm">
            ← Exit
          </GameButton>
        </div>

        {/* Game Description */}
        <p className="mb-6 text-center opacity-70">{gameSpec.description}</p>

        {/* Game Over Overlay */}
        {gameState.gameOver && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm">
            <div 
              className="p-8 rounded-2xl shadow-2xl max-w-md w-full border"
              style={{
                backgroundColor: gameSpec.theme.colors.background,
                borderColor: gameSpec.theme.colors.primary + "40",
                boxShadow: `0 0 60px ${gameSpec.theme.colors.primary}30`,
              }}
            >
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
          <div className="mt-8 text-center opacity-60">
            <p>Clicks: {gameState.clicks || 0}</p>
            {gameState.autoClicks > 0 && <p>Per second: {gameState.autoClicks.toFixed(1)}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
