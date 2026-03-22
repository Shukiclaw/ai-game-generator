"use client";

import React, { useState } from "react";
import PromptInterface from "./components/PromptInterface";
import GameRenderer from "./components/GameRenderer";
import { GameSpec } from "./types/game";

export default function Home() {
  const [currentGame, setCurrentGame] = useState<GameSpec | null>(null);

  const handleGameGenerated = (game: GameSpec) => {
    setCurrentGame(game);
  };

  const handleSelectExample = (game: GameSpec) => {
    setCurrentGame(game);
  };

  const handleExitGame = () => {
    setCurrentGame(null);
  };

  return (
    <main>
      {currentGame ? (
        <GameRenderer 
          gameSpec={currentGame} 
          onExit={handleExitGame}
        />
      ) : (
        <PromptInterface
          onGameGenerated={handleGameGenerated}
          onSelectExample={handleSelectExample}
        />
      )}
    </main>
  );
}
