"use client";

import { useState, useEffect, useRef } from "react";

/**
 * 监听元素是否被悬停
 * @returns isHovered
 */
export const useHover = <T extends HTMLElement>(
  ...refs: React.RefObject<T>[]
) => {
  const [isHovered, setIsHovered] = useState(false);
  const currentElements = useRef<Set<HTMLElement>>(new Set());

  useEffect(() => {
    const elements = refs.map((ref) => ref.current).filter(Boolean);
    if (elements.length === 0) return;

    const handleEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      currentElements.current.add(target);
      console.log("currentElements", currentElements.current);
      setIsHovered(true);
    };

    const handleLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const relatedTarget = e.relatedTarget as Node;

      // 从当前悬停元素集合中移除离开的元素
      currentElements.current.delete(target);

      // 如果relatedTarget为null或不在监听的元素中，且没有其他元素被悬停
      if (
        (!relatedTarget ||
          !elements.some((el) => el?.contains(relatedTarget))) &&
        currentElements.current.size === 0
      ) {
        console.log("leave");
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
