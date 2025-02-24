"use client";

import { createPortal } from "react-dom";
import { useEffect } from "react";
import styles from "./index.module.scss";
import { usePopover } from "@/components/hooks/useFloating";

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
 */

const Popover = ({ content, children }: PopoverProps) => {
  const { isOpen, refs, floatingStyles, getReferenceProps, getFloatingProps } =
    usePopover();

  return (
    <>
      <div
        ref={refs.setReference}
        {...getReferenceProps()}
        className={styles.trigger}
      >
        {children}
      </div>
      {isOpen &&
        createPortal(
          <div
            ref={refs.setFloating}
            className={styles.content}
            role="tooltip"
            data-visible={isOpen}
            style={floatingStyles}
            {...getFloatingProps()}
          >
            {content}
          </div>,
          document.body
        )}
    </>
  );
};

export { Popover };
