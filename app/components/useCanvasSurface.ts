"use client";

import { useCallback, useEffect, useRef } from "react";

export type CanvasDraw = (
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  seconds: number,
  animating: boolean,
) => void;

// A canvas only owns an animation frame while it is visible and motion is on.
// Explicit input can still repaint a single frame when animation is paused.
export function useCanvasSurface(motion: boolean, draw: CanvasDraw) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  const paintRef = useRef<(() => void) | null>(null);
  const redraw = useCallback(() => paintRef.current?.(), []);

  useEffect(() => {
    drawRef.current = draw;
    paintRef.current?.();
  }, [draw]);

  useEffect(() => {
    const node = canvas.current;
    const context = node?.getContext("2d", { alpha: false });
    if (!node || !context) return;
    let width = 0;
    let height = 0;
    let density = 1;
    let frame = 0;
    let previous = 0;
    let inView = false;
    let pageVisible = !document.hidden;
    let disposed = false;

    function paint(now: number) {
      frame = 0;
      if (disposed || !context || width <= 0 || height <= 0) return;
      const animating = motion && inView && pageVisible;
      const seconds = animating && previous ? Math.min((now - previous) / 1000, 0.032) : 0;
      previous = animating ? now : 0;
      context.setTransform(density, 0, 0, density, 0, 0);
      drawRef.current(context, width, height, seconds, animating);
      if (animating) frame = requestAnimationFrame(paint);
    }
    function requestPaint() {
      if (!disposed && !frame) frame = requestAnimationFrame(paint);
    }
    function resize() {
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      density = Math.min(window.devicePixelRatio || 1, 1.5);
      node.width = Math.max(1, Math.round(width * density));
      node.height = Math.max(1, Math.round(height * density));
      requestPaint();
    }
    function visibility() {
      pageVisible = !document.hidden;
      previous = 0;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      if (pageVisible) requestPaint();
    }
    const sizeObserver = new ResizeObserver(resize);
    const viewObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      previous = 0;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      requestPaint();
    });
    paintRef.current = requestPaint;
    sizeObserver.observe(node);
    viewObserver.observe(node);
    document.addEventListener("visibilitychange", visibility);
    resize();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      paintRef.current = null;
      sizeObserver.disconnect();
      viewObserver.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [motion]);

  return { canvas, redraw };
}
