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
    // 获取所有有效的dom元素
    const elements = refs.map((ref) => ref.current).filter(Boolean);
    if (elements.length === 0) return;

    const handleEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      currentElements.current.add(target);
      setIsHovered(true);
    };

    const handleLeave = (e: MouseEvent) => {
      const target = e.target as HTMLElement; // 鼠标正在离开的元素
      const relatedTarget = e.relatedTarget as Node; // 鼠标正在进入的元素

      // 从当前悬停元素集合中移除离开的元素
      currentElements.current.delete(target);

      // 如果relatedTarget为null或不在监听的元素中，且没有其他元素被悬停
      // if (
      //   (!relatedTarget ||
      //     !elements.some((el) => el?.contains(relatedTarget))) &&
      //   currentElements.current.size === 0
      // ) {
      //   console.log(!relatedTarget);
      //   console.log(!elements.some((el) => el?.contains(relatedTarget)));
      //   console.log(currentElements.current.size === 0);
      //   console.log("leave");
      //   setIsHovered(false);
      // }

      //   if (relatedTarget) {
      //     // 检查是否移动到了任何监听的元素或其子元素
      //     const isMovingToTrackedElement = elements.some(
      //       (el) => el?.contains(relatedTarget) || el === relatedTarget
      //     );

      //     if (!isMovingToTrackedElement && currentElements.current.size === 0) {
      //       console.log("leave");
      //       setIsHovered(false);
      //     }
      //   } else {
      //     // 如果 relatedTarget 为 null 且没有其他悬停元素，才设置 false
      //     if (currentElements.current.size === 0) {
      //       setIsHovered(false);
      //     }
      //   }
      // };

      // 修改：检查 relatedTarget 是否是任何监听元素或其子元素
      // 即使通过 Portal 渲染，DOM 结构仍然可以被检查到
      const isMovingToTrackedElement = elements.some((el) => {
        // 1. 检查是否是监听的元素本身
        if (el === relatedTarget) return true;

        // 2. 检查是否是监听元素的子元素
        if (el?.contains(relatedTarget)) return true;

        // 3. 检查 Portal 渲染的内容
        // 通过 data-visible 属性识别相关元素
        if (
          relatedTarget instanceof Element &&
          relatedTarget.closest('[data-visible="true"]')
        ) {
          return true;
        }

        return false;
      });

      if (!isMovingToTrackedElement && currentElements.current.size === 0) {
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

  return isHovered;
};
