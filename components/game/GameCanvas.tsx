import React, { useEffect, useRef } from "react";
import { GameState } from "@/lib/game-types";
import { applyCRTEffect } from "@/lib/game-utils";
import { BASE_WIDTH, BASE_HEIGHT } from "@/lib/game-constants";

interface GameCanvasProps {
  gameState: GameState;
  width: number;
  height: number;
  scale: number;
  onCanvasClick?: () => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  gameState,
  width,
  height,
  scale,
  onCanvasClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.save();
    ctx.scale(scale, scale);

    let animationFrameId: number;

    const render = () => {
      if (!canvas) return;

      ctx.resetTransform();
      ctx.fillStyle = "#0f0a1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

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

      applyCRTEffect(ctx, BASE_WIDTH, BASE_HEIGHT);

      ctx.resetTransform();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, width, height, scale]);

  return (
    <canvas
      ref={canvasRef}
      className="pixelated max-w-full h-auto mx-auto block"
      onClick={onCanvasClick}
    />
  );
};

export default GameCanvas;
