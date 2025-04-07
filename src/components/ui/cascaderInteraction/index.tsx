"use client";

import { CascaderProps } from "@/components/ui/cascader";

const CascaderInteraction = ({
  children,
  onSelect,
}: {
  children: React.ReactNode;
} & Pick<CascaderProps, "onSelect">) => {
  const handleClickInteraction = (e: React.MouseEvent | React.MouseEvent) => {
    const path = (e.target as HTMLElement)
      .closest("[data-path]")
      ?.getAttribute("data-path");

    if (path && onSelect) onSelect(path);
  };

  const handleMouseEnterInteraction = (
    e: React.MouseEvent | React.MouseEvent
  ) => {
    return null;
  };

  return (
    <div
      onClick={handleClickInteraction}
      onMouseEnter={handleMouseEnterInteraction}
    >
      {children}
    </div>
  );
};

export { CascaderInteraction };
