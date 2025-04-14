"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { defaultGameState } from "@/lib/game-state";
import { GameState } from "@/lib/game-types";
import { generateRandomPosition } from "@/lib/game-utils";
import { useResponsiveCanvas } from "@/hooks/use-responsive-canvas";
import { useKeyboardControls } from "@/hooks/use-keyboard-controls";
import { useGameLogic } from "@/hooks/use-game-logic";
import { useBackgroundMusic } from "@/hooks/use-background-music";
import { BASE_WIDTH, BASE_HEIGHT } from "@/lib/game-constants";
import GameCanvas from "@/components/game/GameCanvas";
import GameControls from "@/components/game/GameControls";
import InstructionsScreen from "@/components/game/InstructionsScreen";
import PauseScreen from "@/components/game/PauseScreen";
import VictoryScreen from "@/components/game/VictoryScreen";
import CreditsScreen from "@/components/game/CreditsScreen";
import Inventory from "@/components/game/Inventory";
import { Toaster } from "@/components/ui/toaster";

export default function RetroPixelQuest() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showCredits, setShowCredits] = useState(false);

  // Custom hooks for game functionality
  const { width, height, scale } = useResponsiveCanvas(
    containerRef,
    BASE_WIDTH,
    BASE_HEIGHT
  );

  useKeyboardControls(setGameState);

  const { pickupAudioRef, victoryAudioRef } = useGameLogic(
    gameState,
    setGameState,
    isPaused,
    soundEnabled,
    scale
  );

  const audioRef = useBackgroundMusic(soundEnabled);

  // Game control functions
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const toggleCredits = () => {
    setShowCredits((prev) => !prev);
  };

  const quitGame = () => {
    resetGame();
    setShowInstructions(true);
  };

  const resetGame = () => {
    const newItems = defaultGameState.items.map((itemTemplate) => {
      const { x, y } = generateRandomPosition();
      return {
        ...itemTemplate,
        x,
        y,
        collected: false,
      };
    });

    setGameState({
      player: { ...defaultGameState.player },
      currentItemIndex: 0,
      items: newItems,
      keys: {
        up: false,
        down: false,
        left: false,
        right: false,
        w: false,
        a: false,
        s: false,
        d: false,
      },
      gameComplete: false,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black select-none">
      <div className="pointer-events-none fixed inset-0 z-[99] crt-overlay" />

      <div className="fixed left-0 top-0 w-full h-full opacity-60 z-0">
        <Image src={"/map_dungeon.png"} alt="rock" fill={true} />
      </div>
      <Image
        src={"/dungeon_quest_2.png"}
        alt="game name"
        width={300}
        height={300}
        className="z-[1] relative"
      />

      <div className="flex flex-col md:flex-row gap-4 p-4 w-full">
        <div
          ref={containerRef}
          className="relative overflow-hidden flex-1 w-full h-[60vh] md:h-[65vh]"
        >
          <GameCanvas
            gameState={gameState}
            width={width}
            height={height}
            scale={scale}
            onCanvasClick={() => setShowInstructions(false)}
          />

          <GameControls
            soundEnabled={soundEnabled}
            isPaused={isPaused}
            onToggleSound={toggleSound}
            onTogglePause={togglePause}
            onQuitGame={quitGame}
          />

          {showInstructions && (
            <InstructionsScreen onClose={() => setShowInstructions(false)} />
          )}
          {isPaused && !showInstructions && (
            <PauseScreen onResume={togglePause} onQuit={quitGame} />
          )}
          {gameState.gameComplete && !isPaused && (
            <VictoryScreen onRestart={resetGame} />
          )}
          {showCredits && <CreditsScreen onClose={toggleCredits} />}
        </div>

        {/* Add Inventory sidebar */}
        <div className="w-full md:w-[240px] h-[60vh] md:h-[65vh]">
          <Inventory items={gameState.items} />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={toggleCredits}
          className="bg-orange-700/50 text-white px-4 py-2 rounded hover:bg-orange-700"
        >
          Credits
        </button>
      </div>

      <audio ref={audioRef} src="/bgm.mp3" loop />
      <audio ref={pickupAudioRef} src="/pickup.mp3" />
      <audio ref={victoryAudioRef} src="/victory.mp3" />

      <Toaster />
    </div>
  );
}
