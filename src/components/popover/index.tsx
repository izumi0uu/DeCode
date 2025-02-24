"use client";

import { createPortal } from "react-dom";
import { useRef, useState, useEffect, RefObject } from "react";
import classNames from "classnames";
import { useHover } from "@/components/hooks/useHover";
import { useClickOutside } from "@/components/hooks/useClickOutside";
import { usePosition } from "@/components/hooks/usePosition";
import styles from "./index.module.scss";

type Placement = "top" | "bottom" | "left" | "right";

interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: Placement;
}

/**
 * 弹出层
 * @param param0
 * @returns
 * usePosition 计算弹出层的位置
 * useHover 监听鼠标悬停
 * useClickOutside 监听点击外部
 */

const Popover = ({ content, children, placement = "bottom" }: PopoverProps) => {
  // 弹出层是否显示
  const [isVisible, setIsVisible] = useState(false);

  // triggerRef 触发弹出层的元素
  // contentRef 弹出层的内容
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // 监听鼠标悬停
  const isHovered = useHover(
    triggerRef as RefObject<HTMLElement>,
    contentRef as RefObject<HTMLElement>
  );

  // 计算弹出层的位置
  const coords = usePosition(
    triggerRef as RefObject<HTMLElement>,
    placement,
    isHovered
  );

  // 监听点击外部
  useClickOutside(contentRef as RefObject<HTMLElement>, () =>
    setIsVisible(false)
  );

  // 监听鼠标悬停
  useEffect(() => {
    setIsVisible(isHovered);
  }, [isHovered]);

  return (
    <div ref={triggerRef} className={styles.trigger}>
      {children}
      {isVisible &&
        createPortal(
          <div
            ref={contentRef}
            className={classNames(styles.content, styles[placement])}
            role="tooltip"
            data-visible={isVisible}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: `translate(-50%, ${
                placement === "bottom" ? "10px" : "-10px"
              })`,
            }}
          >
            {content}
          </div>,
          document.body
        )}
    </div>
  );
};

export { Popover };
