import { BASE_WIDTH, BASE_HEIGHT } from './game-constants';
import { Position } from './game-types';

export const generateRandomPosition = (): Position => {
    const buffer = 100;
    return {
        x: Math.floor(Math.random() * (BASE_WIDTH - 50 - buffer)) + buffer / 2,
        y: Math.floor(Math.random() * (BASE_HEIGHT - 50 - buffer)) + buffer / 2,
    };
};

export const applyCRTEffect = (
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
