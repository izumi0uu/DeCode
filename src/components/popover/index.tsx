"use client";

import { useEffect } from "react";
import { FloatingPortal } from "@floating-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { usePopover } from "@/components/hooks/useFloating";

interface PopoverProps {
  content: React.ReactNode;
  children: React.ReactElement;
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
      <div ref={refs.setReference} {...getReferenceProps()}>
        {children}
      </div>
      <FloatingPortal>
        <AnimatePresence>
          {isOpen && (
            <div
              ref={refs.setFloating}
              role="tooltip"
              style={{
                ...floatingStyles,
                zIndex: 1000,
              }}
              {...getFloatingProps()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  scale: [1, 1.05, 0.9], // 放大再缩小
                  opacity: [1, 1, 1], // 保持完全不透明
                  transition: {
                    duration: 0.4,
                    ease: "easeInOut",
                    scale: {
                      times: [0, 0.7, 0.9], // 70%时间完成放大，20%时间完成缩小
                    },
                  },
                }}
              >
                {content}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </FloatingPortal>
    </>
  );
};

export { Popover };
