"use client";

import { Volume2, VolumeX, Pause, Play, X, Info } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";
import { useResponsiveCanvas } from "./hooks/use-responsive-canvas";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
// Game constants
const BASE_WIDTH = 1200;
const BASE_HEIGHT = 1200;

const generateRandomPosition = () => {
  // Use the correct BASE_WIDTH and BASE_HEIGHT values
  // Add buffer from edges and account for item size (50x50)
  const buffer = 100; // Buffer from edges
  return {
    x: Math.floor(Math.random() * (BASE_WIDTH - 50 - buffer)) + buffer / 2,
    y: Math.floor(Math.random() * (BASE_HEIGHT - 50 - buffer)) + buffer / 2,
  };
};

const defaultGameState = {
  player: { x: 100, y: 100, width: 80, height: 80, speed: 10 },
  currentItemIndex: 0,
  items: [
    "boots",
    "shield",
    "chestplate",
    "helmet",
    "sword",
    "bread",
    "dagger",
    "elixir",
    "flame",
    "green_potion",
    "key_rusty",
    "meat",
    "orb of light",
    "pickaxe",
    "red_potion",
    "ring of fire",
    "rope",
    "spellbook",
    "treasure_map",
    "water",
    "yellow_potion",
  ].map((id, index) => {
    const { x, y } = generateRandomPosition();
    return {
      id,
      x,
      y,
      width: 50,
      height: 50,
      collected: false,
    };
  }),
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
};

export default function RetroPixelQuest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState(defaultGameState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pickupAudioRef = useRef<HTMLAudioElement>(null);
  const victoryAudioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();

  // Import the custom hook for responsive canvas
  const { width, height, scale } = useResponsiveCanvas(
    containerRef,
    BASE_WIDTH,
    BASE_HEIGHT
  );

  useEffect(() => {
    const playerImg = new Image();
    playerImg.src = "/player/player.png";

    const itemImages: Record<string, HTMLImageElement> = {};
    gameState.items.forEach((item) => {
      itemImages[item.id] = new Image();
      itemImages[item.id].src = `/inventory/${item.id}.png`;
    });

    const mapImg = new Image();
    mapImg.src = "/map_dungeon.png";

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions based on the calculated responsive size
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Apply scaling to maintain consistent rendering
    ctx.save();
    ctx.scale(scale, scale);

    let animationFrameId: number;

    const render = () => {
      if (!canvas) return;

      // Clear the canvas and reset transformations
      ctx.resetTransform();
      ctx.fillStyle = "#0f0a1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Apply scaling for consistent rendering across screen sizes
      ctx.scale(scale, scale);

      if (mapImg.complete) {
        ctx.drawImage(mapImg, 0, 0, BASE_WIDTH, BASE_HEIGHT);
      }

      const currentItem = gameState.items[gameState.currentItemIndex];
      if (
        currentItem &&
        !currentItem.collected &&
        itemImages[currentItem.id]?.complete
      ) {
        ctx.drawImage(
          itemImages[currentItem.id],
          currentItem.x,
          currentItem.y,
          currentItem.width,
          currentItem.height
        );

        const floatOffset = Math.sin(Date.now() / 300) * 3;
        ctx.drawImage(
          itemImages[currentItem.id],
          currentItem.x,
          currentItem.y + floatOffset,
          currentItem.width,
          currentItem.height
        );

        ctx.globalAlpha = 0.2 + Math.sin(Date.now() / 200) * 0.1;
        ctx.drawImage(
          itemImages[currentItem.id],
          currentItem.x - 4,
          currentItem.y + floatOffset - 4,
          currentItem.width + 8,
          currentItem.height + 8
        );
        ctx.globalAlpha = 1;
      }

      if (playerImg.complete) {
        ctx.drawImage(
          playerImg,
          gameState.player.x,
          gameState.player.y,
          gameState.player.width,
          gameState.player.height
        );
      } else {
        ctx.fillStyle = "#5df15d";
        ctx.fillRect(
          gameState.player.x,
          gameState.player.y,
          gameState.player.width,
          gameState.player.height
        );
      }

      // Apply CRT effect after all game elements are drawn
      applyCRTEffect(ctx, BASE_WIDTH, BASE_HEIGHT);

      // Reset transformation for next frame
      ctx.resetTransform();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, width, height, scale]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        setGameState((prev) => ({
          ...prev,
          keys: { ...prev.keys, up: true, w: true },
        }));
      }
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        setGameState((prev) => ({
          ...prev,
          keys: { ...prev.keys, down: true, s: true },
        }));
      }
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        setGameState((prev) => ({
          ...prev,
          keys: { ...prev.keys, left: true, a: true },
        }));
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        setGameState((prev) => ({
          ...prev,
          keys: { ...prev.keys, right: true, d: true },
        }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key.toLowerCase() === "w") {
        setGameState((prev) => ({
          ...prev,
          keys: { ...prev.keys, up: false, w: false },
        }));
      }
      if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
        setGameState((prev) => ({
          ...prev,
          keys: { ...prev.keys, down: false, s: false },
        }));
      }
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
        setGameState((prev) => ({
          ...prev,
          keys: { ...prev.keys, left: false, a: false },
        }));
      }
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
        setGameState((prev) => ({
          ...prev,
          keys: { ...prev.keys, right: false, d: false },
        }));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const updateGame = () => {
      if (isPaused) return; // Skip game update when paused

      setGameState((prev) => {
        let newX = prev.player.x;
        let newY = prev.player.y;

        const adjustedSpeed = prev.player.speed * (scale || 1);

        if ((prev.keys.up || prev.keys.w) && newY > 0) {
          newY -= adjustedSpeed;
        }
        if (
          (prev.keys.down || prev.keys.s) &&
          newY < BASE_HEIGHT - prev.player.height
        ) {
          newY += adjustedSpeed;
        }
        if ((prev.keys.left || prev.keys.a) && newX > 0) {
          newX -= adjustedSpeed;
        }
        if (
          (prev.keys.right || prev.keys.d) &&
          newX < BASE_WIDTH - prev.player.width
        ) {
          newX += adjustedSpeed;
        }

        const updatedItems = [...prev.items];
        let itemCollected = false;
        const currentItem = updatedItems[prev.currentItemIndex];

        if (currentItem && !currentItem.collected) {
          if (
            newX < currentItem.x + currentItem.width &&
            newX + prev.player.width > currentItem.x &&
            newY < currentItem.y + currentItem.height &&
            newY + prev.player.height > currentItem.y
          ) {
            currentItem.collected = true;
            itemCollected = true;
            // We'll handle positioning in the random selection block below instead
          }
        }

        if (itemCollected) {
          // Show toast notification
          toast({
            title: "Item Collected!",
            description: `You found: ${currentItem.id.replace("_", " ")}`,
            variant: "default",
            duration: 3000,
          });

          if (soundEnabled && pickupAudioRef.current) {
            pickupAudioRef.current.currentTime = 0;
            pickupAudioRef.current.play();
          }

          // Find uncollected items
          const uncollectedItems = updatedItems
            .map((item, index) => ({ item, index }))
            .filter(({ item }) => !item.collected);

          // Randomly select next item if there are any uncollected
          if (uncollectedItems.length > 0) {
            const randomIndex = Math.floor(
              Math.random() * uncollectedItems.length
            );
            prev.currentItemIndex = uncollectedItems[randomIndex].index;

            // Set a new random position for the newly selected item
            const newPos = generateRandomPosition();
            updatedItems[prev.currentItemIndex].x = newPos.x;
            updatedItems[prev.currentItemIndex].y = newPos.y;
          }
        }

        const allCollected = updatedItems.every((item) => item.collected);
        if (
          allCollected &&
          !prev.gameComplete &&
          soundEnabled &&
          victoryAudioRef.current
        ) {
          victoryAudioRef.current.play();
        }

        return {
          ...prev,
          player: { ...prev.player, x: newX, y: newY },
          items: updatedItems,
          gameComplete: allCollected,
        };
      });
    };

    const gameInterval = setInterval(updateGame, 16);

    return () => {
      clearInterval(gameInterval);
    };
  }, [soundEnabled]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      if (soundEnabled) {
        audioRef.current
          .play()
          .catch((e) => console.log("Audio play failed:", e));
      } else {
        audioRef.current.pause();
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [soundEnabled]);

  const applyCRTEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    ctx.globalAlpha = 0.1;
    for (let i = 0; i < height; i += 4) {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, i, width, 2);
    }

    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, "rgba(0,0,0,0.4)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 1;
  };

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
    // Reset game and show instructions
    resetGame();
    setShowInstructions(true);
  };

  const resetGame = () => {
    // Create a fresh copy of the default game state with new random positions
    const newItems = defaultGameState.items.map((itemTemplate, index) => {
      const { x, y } = generateRandomPosition();
      return {
        ...itemTemplate,
        x,
        y,
        collected: false,
      };
    });

    // Reset to the initial state
    setGameState({
      player: { ...defaultGameState.player }, // Reset player position
      currentItemIndex: 0, // Reset to the first item
      items: newItems,
      keys: {
        // Explicitly reset all key states
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
        <NextImage src={"/map_dungeon.png"} alt="rock" fill={true} />
      </div>
      <NextImage
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
          <canvas
            ref={canvasRef}
            className="pixelated max-w-full h-auto mx-auto block"
            onClick={() => setShowInstructions(false)}
          />

          <div className="absolute top-2 left-2 flex gap-2 flex-col w-fit bg-[#110805] p-6">
            <NextImage
              src={"/ui/volume.png"}
              alt="game name"
              width={50}
              height={50}
              onClick={toggleSound}
              className={`z-[1] relative object-contain cursor-pointer hover:scale-110 ${
                soundEnabled ? "opacity-100" : "opacity-40"
              }`}
            />

            <NextImage
              src={isPaused ? "/ui/play.png" : "/ui/pause.png"}
              onClick={togglePause}
              alt="game name"
              width={100}
              height={100}
              className="z-[1] relative min-w-[75px]  object-contain cursor-pointer hover:scale-110"
            />

            {/* <NextImage
              src={"/ui/pause.png"}
              alt="game name"
              width={70}
              height={100}
              onClick={toggleCredits}
              className="z-[1] relative"
            /> */}

            <NextImage
              src={"/ui/exit.png"}
              alt="game name"
              onClick={quitGame}
              width={82}
              height={30}
              className="z-[1] relative object-contain cursor-pointer hover:scale-110"
            />
          </div>
          {/* Instructions Overlay */}
          {showInstructions && (
            <div
              className="absolute z-[2] inset-0 bg-black/85 flex flex-col items-center justify-center p-4 cursor-pointer"
              onClick={() => setShowInstructions(false)}
            >
              <div className="bg-black border-4 border-orange-700  max-w-md flex items-center flex-col">
                <NextImage
                  src={"/dungeon_quest.png"}
                  alt="game name"
                  width={400}
                  height={300}
                />
                <div className="p-10 mt-7 bg-orange-950/30">
                  <h2 className="text-orange-500 font-bold text-xl mb-3  text-center">
                    HOW TO PLAY
                  </h2>
                  <ul className="text-white space-y-2  text-sm">
                    <li>• Move with WASD or Arrow Keys</li>
                    <li>• Collect all 5 armor pieces</li>
                    <li>• Complete your inventory</li>
                  </ul>
                </div>
                <NextImage
                  src={"/ui/start.png"}
                  alt="game name"
                  width={100}
                  className="hover:scale-110"
                  height={100}
                />
              </div>
            </div>
          )}

          {/* Pause Screen */}
          {isPaused &&
            !gameState.gameComplete &&
            !showInstructions &&
            !showCredits && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-10">
                <div className="bg-black border-4 border-orange-700 max-w-md flex items-center flex-col">
                  <NextImage
                    src={"/dungeon_quest.png"}
                    alt="game name"
                    width={400}
                    height={300}
                  />
                  <div className="p-10 mt-7 bg-orange-950/30">
                    <h2 className="text-orange-500 font-bold text-xl mb-3 text-center">
                      GAME PAUSED
                    </h2>
                    <ul className="text-white space-y-2 text-sm">
                      <li>• Press play to continue your quest</li>
                      <li>• Or exit to return to the main menu</li>
                    </ul>
                  </div>
                  <div className="flex gap-4 my-4">
                    <NextImage
                      src={"/ui/play.png"}
                      onClick={togglePause}
                      alt="game name"
                      width={100}
                      height={100}
                      className="z-[1] relative hover:scale-110 cursor-pointer"
                    />
                    <NextImage
                      src={"/ui/exit.png"}
                      onClick={quitGame}
                      alt="game name"
                      width={100}
                      height={100}
                      className="z-[1] relative hover:scale-110 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

          {/* Victory Screen */}
          {gameState.gameComplete && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
              <div className="bg-black border-4 border-orange-700  max-w-md flex items-center flex-col">
                <NextImage
                  src={"/dungeon_quest.png"}
                  alt="game name"
                  width={400}
                  height={300}
                />
                <div className="p-10 mt-7 bg-orange-950/30">
                  <h2 className="text-orange-500 font-bold text-xl mb-3 text-center">
                    ⚡ QUEST COMPLETE! ⚡
                  </h2>
                  <ul className="text-white space-y-2 text-sm">
                    <li>• You've collected all armor pieces!</li>
                    <li>• Your inventory is complete</li>
                    <li>• Ready for new adventures?</li>
                  </ul>
                </div>
                <NextImage
                  src={"/ui/play.png"}
                  alt="game name"
                  width={100}
                  className="hover:scale-110 cursor-pointer m-6"
                  height={100}
                  onClick={resetGame}
                />
              </div>
            </div>
          )}

          {/* Credits Dialog */}
          {showCredits && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 z-20">
              <div className="bg-black border-4 border-orange-700 max-w-md flex items-center flex-col">
                <NextImage
                  src={"/dungeon_quest.png"}
                  alt="game name"
                  width={400}
                  height={300}
                />
                <div className="p-10 mt-7 bg-orange-950/30">
                  <h2 className="text-orange-500 font-bold text-xl mb-3 text-center">
                    CREDITS
                  </h2>
                  <div className="text-white space-y-4 text-sm">
                    <div>
                      <h3 className="text-orange-400 font-bold">
                        Game Development
                      </h3>
                      <p>Created by Pixel Quest Team</p>
                    </div>
                    <div>
                      <h3 className="text-orange-400 font-bold">Artwork</h3>
                      <p>Pixel Art by Digital Dreamers</p>
                    </div>
                    <div>
                      <h3 className="text-orange-400 font-bold">
                        Music & Sound
                      </h3>
                      <p>Audio by Retro Sounds Studio</p>
                    </div>
                    <div>
                      <h3 className="text-orange-400 font-bold">
                        Special Thanks
                      </h3>
                      <p>To all the pixel art enthusiasts and retro gamers!</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleCredits}
                  className="mb-4 bg-orange-700 hover:bg-orange-600 text-white p-2 px-4 rounded flex items-center gap-2"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#110805] p-4 h-fit w-[300px] relative z-[1] flex flex-col items-center">
          <NextImage
            src={"/ui/inventory.png"}
            alt="game name"
            width={200}
            className="mb-5"
            height={200}
          />
          <div className="grid grid-cols-1 gap-3 w-full max-h-[50vh] overflow-y-auto overflow-x-hidden">
            {gameState.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 w-full ${
                  item.collected ? "text-[#5df15d]" : "text-[#6e6a85]"
                }`}
              >
                <NextImage
                  src={item.collected ? "/ui/check.png" : "/ui/cross.png"}
                  className="object-contain z-[1] relative"
                  alt="game name"
                  width={30}
                  height={30}
                />

                <div className="flex items-center justify-end gap-2 w-full pr-3">
                  <span className="capitalize text-sm  text-right">
                    {item.id.replace("_", " ")}
                  </span>

                  <div className="w-8 h-8 relative ">
                    <img
                      src={`/inventory/${item.id}.png`}
                      alt={item.id}
                      className="w-full h-full object-contain pixelated opacity-60"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-5 mt-2 md:mt-4 px-2  w-full">
        <NextImage
          src={"/ui/joystick.png"}
          className="object-contain z-[1] relative"
          alt="game name"
          width={150}
          height={150}
        />

        <NextImage
          src={"/ui/controls.png"}
          alt="game name"
          className="object-contain z-[1] relative"
          width={150}
          height={150}
        />
        <NextImage
          src={"/ui/wasd.png"}
          alt="game name"
          className="object-contain z-[1] relative"
          width={150}
          height={150}
        />
      </div>

      {/* Audio Elements */}
      <audio ref={audioRef} src="/bgm.mp3" loop />
      <audio ref={pickupAudioRef} src="/pickup.mp3" />
      <audio ref={victoryAudioRef} src="/victory.mp3" />

      {/* Toast notification container */}
      <Toaster />

      <style jsx global>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
}
