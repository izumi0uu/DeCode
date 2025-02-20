"use client";

import { CascaderProps } from "@/components/cascader";

const CascaderInteraction = ({
  children,
  onSelect,
}: {
  children: React.ReactNode;
} & Pick<CascaderProps, "onSelect">) => {
  const handleInteraction = (e: React.MouseEvent | React.MouseEvent) => {
    const path = (e.target as HTMLElement)
      .closest("[data-path]")
      ?.getAttribute("data-path");

    if (path && onSelect) onSelect(path);
  };

  return (
    <div onClick={handleInteraction} onMouseEnter={handleInteraction}>
      {children}
    </div>
  );
};

export { CascaderInteraction };
