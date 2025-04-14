import { useEffect } from 'react';
import { GameState } from '@/lib/game-types';

export const useKeyboardControls = (
    setGameState: React.Dispatch<React.SetStateAction<GameState>>
) => {
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
    }, [setGameState]);
};
