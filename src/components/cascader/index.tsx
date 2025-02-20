"use client";

import { Suspense } from "react";
import { NavNode } from "@/types";
import { CascaderContent } from "@/components/cascaderContent";

export interface CascaderProps {
  data?: NavNode[];
  onSelect?: (path: string) => void;
  currentPath?: string;
}

const Cascader = (props: CascaderProps = {} as CascaderProps) => {
  console.log("cascader", props);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CascaderContent {...props} currentPath={props?.currentPath} />
    </Suspense>
  );
};

export { Cascader };
