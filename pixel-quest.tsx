"use client";

import { Volume2, VolumeX } from "lucide-react";
import NextImage from "next/image";
import { useEffect, useRef, useState } from "react";

const generateRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * (640 - 40)), // canvas width - item width
    y: Math.floor(Math.random() * (480 - 40)), // canvas height - item height
  };
};

const firstItemPos = generateRandomPosition();

const defaultGameState = {
  player: { x: 100, y: 100, width: 80, height: 80, speed: 3 },
  currentItemIndex: 0,
  items: [
    {
      id: "helmet",
      x: firstItemPos.x,
      y: firstItemPos.y,
      width: 40,
      height: 40,
      collected: false,
    },
    {
      id: "chestplate",
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      collected: false,
    },
    {
      id: "boots",
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      collected: false,
    },
    {
      id: "shield",
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      collected: false,
    },
    {
      id: "sword",
      x: 0,
      y: 0,
      width: 40,
      height: 40,
      collected: false,
    },
  ],
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
  const [gameState, setGameState] = useState(defaultGameState);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showInstructions, setShowInstructions] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const pickupAudioRef = useRef<HTMLAudioElement>(null);
  const victoryAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const playerImg = new Image();
    playerImg.src = "/player.png";

    const itemImages: Record<string, HTMLImageElement> = {};
    gameState.items.forEach((item) => {
      itemImages[item.id] = new Image();
      itemImages[item.id].src = `/${item.id}.png`;
    });

    const mapImg = new Image();
    mapImg.src = "/map.png";

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      if (!canvas) return;

      ctx.fillStyle = "#0f0a1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (mapImg.complete) {
        ctx.drawImage(mapImg, 0, 0, canvas.width, canvas.height);
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

      applyCRTEffect(ctx, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState]);

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
      setGameState((prev) => {
        let newX = prev.player.x;
        let newY = prev.player.y;

        if ((prev.keys.up || prev.keys.w) && newY > 0) {
          newY -= prev.player.speed;
        }
        if (
          (prev.keys.down || prev.keys.s) &&
          newY < 480 - prev.player.height
        ) {
          newY += prev.player.speed;
        }
        if ((prev.keys.left || prev.keys.a) && newX > 0) {
          newX -= prev.player.speed;
        }
        if (
          (prev.keys.right || prev.keys.d) &&
          newX < 640 - prev.player.width
        ) {
          newX += prev.player.speed;
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

            // Set position for next item if available
            const nextItem = updatedItems[prev.currentItemIndex + 1];
            if (nextItem) {
              const newPos = generateRandomPosition();
              nextItem.x = newPos.x;
              nextItem.y = newPos.y;
            }
          }
        }

        if (itemCollected && soundEnabled && pickupAudioRef.current) {
          pickupAudioRef.current.currentTime = 0;
          pickupAudioRef.current.play();

          // Move to next item
          if (prev.currentItemIndex < updatedItems.length - 1) {
            prev.currentItemIndex++;
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

  const resetGame = () => {
    const firstPos = generateRandomPosition();
    setGameState({
      ...defaultGameState,
      items: [
        {
          id: "helmet",
          x: firstPos.x,
          y: firstPos.y,
          width: 40,
          height: 40,
          collected: false,
        },
        {
          id: "chestplate",
          x: 0,
          y: 0,
          width: 40,
          height: 40,
          collected: false,
        },
        {
          id: "boots",
          x: 0,
          y: 0,
          width: 40,
          height: 40,
          collected: false,
        },
        {
          id: "shield",
          x: 0,
          y: 0,
          width: 40,
          height: 40,
          collected: false,
        },
        {
          id: "sword",
          x: 0,
          y: 0,
          width: 40,
          height: 40,
          collected: false,
        },
      ],
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
      <NextImage
        src={"/dungeon_quest_2.png"}
        alt="game name"
        width={300}
        height={300}
      />
      <div className="flex flex-col md:flex-row gap-4 w-full p-4">
        <div className="relative border-4 border-orange-950 rounded-sm overflow-hidden">
          <canvas
            ref={canvasRef}
            width={1500}
            height={1000}
            className="pixelated"
            onClick={() => setShowInstructions(false)}
          />

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="absolute top-2 left-2 text-white p-1 rounded-sm"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>

          {/* Instructions Overlay */}
          {showInstructions && (
            <div
              className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4 cursor-pointer"
              onClick={() => setShowInstructions(false)}
            >
              <div className="bg-black border-4 border-orange-700 rounded-sm max-w-md flex items-center flex-col">
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

          {/* Victory Screen */}
          {gameState.gameComplete && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
              <div className="bg-black border-4 border-orange-700 rounded-sm max-w-md flex items-center flex-col">
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
                  className="hover:scale-110 cursor-pointer"
                  height={100}
                  onClick={resetGame}
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#0f0a1e] border-4 border-orange-800 p-4 rounded-sm h-fit w-[230px]">
          <NextImage
            src={"/ui/inventory.png"}
            alt="game name"
            width={300}
            className="mb-5"
            height={200}
          />
          <div className="grid grid-cols-1 gap-3 w-fit">
            {gameState.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center w-full ${
                  item.collected ? "text-[#5df15d]" : "text-[#6e6a85]"
                }`}
              >
                <div className="flex items-center gap-2 w-fit">
                  <div
                    className={`w-6 h-6 flex items-center justify-center border border-current ${
                      item.collected ? "bg-[#392f5a]" : "bg-[#1a142e]"
                    }`}
                  >
                    {item.collected && <span>✓</span>}
                  </div>
                  <div className="w-8 h-8 relative">
                    <img
                      src={`/${item.id}.png`}
                      alt={item.id}
                      className="w-full h-full object-contain pixelated opacity-60"
                    />
                  </div>
                  <span className="capitalize text-sm ">{item.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Audio Elements */}
      <audio ref={audioRef} src="/bgm.mp3" loop />
      <audio ref={pickupAudioRef} src="/pickup.mp3" />
      <audio ref={victoryAudioRef} src="/victory.mp3" />

      <style jsx global>{`
        .pixelated {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </div>
  );
}
