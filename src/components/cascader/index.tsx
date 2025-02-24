"use client";

import { NavNode } from "@/types";
import { CascaderContent } from "@/components/cascaderContent";

export interface CascaderProps {
  data?: NavNode[];
  onSelect?: (path: string) => void;
  currentPath?: string;
}

const Cascader = (props: CascaderProps = {} as CascaderProps) => {
  return <CascaderContent {...props} currentPath={props?.currentPath} />;
};

Cascader.displayName = "Cascader";
export { Cascader };
