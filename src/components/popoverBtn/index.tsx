"use client";

import { forwardRef } from "react";
import { Popover } from "@/components/popover";
import { ToggleButton } from "@/once-ui/components";
import type { ToggleButtonProps } from "@/once-ui/components/ToggleButton";

interface PopoverBtnProps extends ToggleButtonProps {
  hovercontent: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
}

const PopoverBtn = forwardRef<HTMLButtonElement, PopoverBtnProps>(
  (props, ref) => {
    return (
      <Popover content={props.hovercontent} placement={props.placement}>
        <ToggleButton ref={ref} {...props} />
      </Popover>
    );
  }
);

PopoverBtn.displayName = "PopoverBtn";
export { PopoverBtn };
