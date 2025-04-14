import { useEffect } from 'react';
import { useResponsiveCanvas } from './use-responsive-canvas';

export const useCanvasRenderer = (
    canvasRef: React.RefObject<HTMLCanvasElement>,
    containerRef: React.RefObject<HTMLDivElement>,
    gameState: any,
    baseWidth: number,
    baseHeight: number,
    renderFunction: (
        ctx: CanvasRenderingContext2D,
        width: number,
        height: number,
        scale: number
    ) => void
) => {
    const { width, height, scale } = useResponsiveCanvas(
        containerRef,
        baseWidth,
        baseHeight
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            if (!canvas) return;

            renderFunction(ctx, width, height, scale);

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [canvasRef, containerRef, gameState, width, height, scale, renderFunction]);

    return { width, height, scale };
};
