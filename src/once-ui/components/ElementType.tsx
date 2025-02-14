import Link from "next/link";
import React, { ReactNode, forwardRef } from "react";

interface ElementTypeProps {
  href?: string;
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onHoverStart?: (event: React.MouseEvent<HTMLElement>) => void;
  onHoverEnd?: (event: React.MouseEvent<HTMLElement>) => void;
  [key: string]: any;
}

const isExternalLink = (url: string) => /^https?:\/\//.test(url);

const ElementType = forwardRef<HTMLElement, ElementTypeProps>(
  (
    { href, children, className, style, onHoverStart, onHoverEnd, ...props },
    ref
  ) => {
    const commonProps = {
      className,
      style,
      onMouseEnter: onHoverStart,
      onMouseLeave: onHoverEnd,
    };

    if (href) {
      const isExternal = isExternalLink(href);
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            ref={ref as React.Ref<HTMLAnchorElement>}
            {...commonProps}
            {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
          >
            {children}
          </a>
        );
      }
      return (
        <Link
          href={href}
          ref={ref as React.Ref<HTMLAnchorElement>}
          {...commonProps}
          {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </Link>
      );
    }
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        {...commonProps}
        {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);

ElementType.displayName = "ElementType";
export { ElementType };
