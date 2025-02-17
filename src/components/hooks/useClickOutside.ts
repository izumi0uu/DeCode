"use client";

import { useEffect } from "react";

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("touchstart", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("touchstart", handleClick);
    };
  }, [ref, callback]);
}
