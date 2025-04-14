import { useEffect, useState, RefObject } from "react";

interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
}

/**
 * Custom hook to handle responsive canvas sizing
 * @param containerRef Reference to the container element
 * @param baseWidth Base width of the canvas
 * @param baseHeight Base height of the canvas
 * @param padding Optional padding to apply (default: 0)
 */
export function useResponsiveCanvas(
  containerRef: RefObject<HTMLDivElement>,
  baseWidth: number,
  baseHeight: number,
  padding: number = 0
): CanvasDimensions {
  const [dimensions, setDimensions] = useState<CanvasDimensions>({
    width: baseWidth,
    height: baseHeight,
    scale: 1,
  });

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth - padding * 2;
      const containerHeight = containerRef.current.clientHeight - padding * 2;

      // Determine which dimension is the limiting factor
      const aspectRatio = baseWidth / baseHeight;

      let width, height, scale;

      if (containerWidth / containerHeight > aspectRatio) {
        // Container is wider than needed, height is the limiting factor
        height = containerHeight;
        width = containerHeight * aspectRatio;
        scale = height / baseHeight;
      } else {
        // Container is taller than needed, width is the limiting factor
        width = containerWidth;
        height = containerWidth / aspectRatio;
        scale = width / baseWidth;
      }

      setDimensions({
        width: Math.floor(width),
        height: Math.floor(height),
        scale: scale,
      });
    };

    // Update initially
    updateCanvasSize();

    // Add resize event listener
    window.addEventListener("resize", updateCanvasSize);

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
    };
  }, [containerRef, baseWidth, baseHeight, padding]);

  return dimensions;
}
