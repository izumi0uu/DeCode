"use client";

import { useState, useEffect } from "react";
import type { RefObject } from "react";

type Placement = "top" | "bottom" | "left" | "right";

const spacing = 8; // 间距

export const usePosition = (
  triggerRef: RefObject<HTMLElement>,
  placement: Placement,
  isActive: boolean
) => {
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!triggerRef.current || !isActive) return;

    const calculatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const scrollX = window.scrollX;
      const scrollY = window.scrollY;

      switch (placement) {
        case "top":
          return {
            top: rect.top + scrollY - spacing,
            left: rect.left + scrollX + rect.width / 2,
          };
        case "bottom":
          return {
            top: rect.top + scrollY + rect.height + spacing,
            left: rect.left + scrollX + rect.width / 2,
          };
        case "left":
          return {
            top: rect.top + scrollY + rect.height / 2,
            left: rect.left + scrollX - spacing,
          };
        case "right":
          return {
            top: rect.top + scrollY + rect.height / 2,
            left: rect.left + scrollX + rect.width + spacing,
          };
        default:
          return { top: 0, left: 0 };
      }
    };

    const update = () => setCoords(calculatePosition());
    update();

    // 处理窗口变化
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);

    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [isActive, placement]);

  return coords;
};
