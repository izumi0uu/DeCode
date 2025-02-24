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
                  opacity: 0,
                  scale: [1, 1.02, 0.95],
                  transition: {
                    scale: {
                      duration: 0.3,
                      times: [0, 0.4, 1],
                    },
                    opacity: { duration: 0.2 },
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
