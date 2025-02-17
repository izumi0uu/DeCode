"use client";

import { useState, useEffect, useRef } from "react";

/**
 * 监听元素是否被悬停
 * @returns [ref, isHovered]
 */
export const useHover = <T extends HTMLElement>(
  ...refs: React.RefObject<T>[]
) => {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    const elements = refs.map((ref) => ref.current).filter(Boolean);
    if (elements.length === 0) return;

    const handleEnter = () => setIsHovered(true);
    const handleLeave = (e: MouseEvent) => {
      if (!elements.some((el) => el?.contains(e.relatedTarget as Node))) {
        setIsHovered(false);
      }
    };

    elements.forEach((el) => {
      el?.addEventListener("mouseenter", handleEnter);
      el?.addEventListener("mouseleave", handleLeave);
    });

    return () => {
      elements.forEach((el) => {
        el?.removeEventListener("mouseenter", handleEnter);
        el?.removeEventListener("mouseleave", handleLeave);
      });
    };
  }, [refs]);

  return [isHovered];
};
