import { useEffect, useRef } from 'react';
import { GameState } from '@/lib/game-types';
import { generateRandomPosition } from '@/lib/game-utils';
import { BASE_HEIGHT, BASE_WIDTH } from '@/lib/game-constants';
import { useToast } from './use-toast';

export const useGameLogic = (
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
    isPaused: boolean,
    soundEnabled: boolean,
    scale: number = 1
) => {
    const { toast } = useToast();
    const pickupAudioRef = useRef<HTMLAudioElement>(null);
    const victoryAudioRef = useRef<HTMLAudioElement>(null);

    useEffect(() => {
        const updateGame = () => {
            if (isPaused) return;

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
                    }
                }

                if (itemCollected) {
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

                    const uncollectedItems = updatedItems
                        .map((item, index) => ({ item, index }))
                        .filter(({ item }) => !item.collected);

                    if (uncollectedItems.length > 0) {
                        const randomIndex = Math.floor(
                            Math.random() * uncollectedItems.length
                        );
                        prev.currentItemIndex = uncollectedItems[randomIndex].index;

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
    }, [isPaused, setGameState, soundEnabled, scale, toast]);

    return { pickupAudioRef, victoryAudioRef };
};
