"use client";

import React, { forwardRef, ReactNode, useState } from "react";
import classNames from "classnames";
import { ElementType } from "./ElementType";
import { Flex, Icon } from ".";
import styles from "./ToggleButton.module.scss";

interface CommonProps {
  label?: ReactNode;
  selected: boolean;
  variant?: "ghost" | "outline";
  size?: "s" | "m" | "l";
  radius?:
    | "none"
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-left"
    | "top-right"
    | "bottom-right"
    | "bottom-left";
  justifyContent?: "flex-start" | "center" | "flex-end" | "space-between";
  fillWidth?: boolean;
  weight?: "default" | "strong";
  truncate?: boolean;
  prefixIcon?: string;
  suffixIcon?: string;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
  href?: string;

  hoverable?: boolean;
  onHoverStart?: (event: React.MouseEvent<HTMLElement>) => void;
  onHoverEnd?: (event: React.MouseEvent<HTMLElement>) => void;
  hoverContent?: ReactNode;
}

export type ToggleButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const ToggleButton = forwardRef<HTMLElement, ToggleButtonProps>(
  (
    {
      label,
      selected,
      variant = "ghost",
      size = "m",
      radius,
      justifyContent = "center",
      fillWidth = false,
      weight = "default",
      truncate = false,
      prefixIcon,
      suffixIcon,
      className,
      style,
      children,
      href,

      hoverable = false,
      onHoverStart,
      onHoverEnd,
      hoverContent,
      ...props
    },
    ref
  ) => {
    const [isHover, setIsHover] = useState(false);

    const handleHoverStart = (e: React.MouseEvent<HTMLElement>) => {
      setIsHover(true);
      onHoverStart?.(e);
    };

    const handleHoverEnd = (e: React.MouseEvent<HTMLElement>) => {
      setIsHover(false);
      onHoverEnd?.(e);
    };

    return (
      <Flex direction="column" className={styles.container}>
        <ElementType
          ref={ref}
          href={href}
          onHoverStart={handleHoverStart}
          onHoverEnd={handleHoverEnd}
          className={classNames(
            styles.button,
            hoverable && isHover && styles.hover,
            styles[variant],
            styles[size],
            selected && styles.selected,
            radius === "none"
              ? "radius-none"
              : radius
              ? `radius-${size}-${radius}`
              : `radius-${size}`,
            "text-decoration-none",
            "button",
            "cursor-interactive",
            {
              ["fill-width"]: fillWidth,
              ["fit-width"]: !fillWidth,
              ["justify-" + justifyContent]: justifyContent,
            },
            className
          )}
          style={style}
          {...props}
        >
          {prefixIcon && (
            <Icon name={prefixIcon} size={size === "l" ? "m" : "s"} />
          )}
          {(label || children) && (
            <Flex
              padding={size === "s" ? "2" : "4"}
              textWeight={weight}
              textSize={size === "l" ? "m" : "s"}
              className="font-label"
            >
              {label || children}
            </Flex>
          )}
          {suffixIcon && (
            <Icon name={suffixIcon} size={size === "l" ? "m" : "s"} />
          )}
        </ElementType>
        {hoverable && (
          <Flex
            fillWidth
            className={classNames(
              styles.hoverContent,
              isHover && styles.visible
            )}
          >
            {hoverContent}
          </Flex>
        )}
      </Flex>
    );
  }
);

ToggleButton.displayName = "ToggleButton";
export { ToggleButton };
