"use client";

import { useState, useEffect } from "react";
import { Flex } from "@/once-ui/components";
import { CascaderProps } from "@/components/cascader";
import { CascaderInteraction } from "@/components/cascaderInteraction";
import { navigateTo } from "@/app/actions/navigateTo";
import { getNavigation } from "@/app/actions/navigation";
import { NavNode } from "@/types/navigation";

const CascaderContent = ({ currentPath }: Omit<CascaderProps, "onSelect">) => {
  const [navigationData, setNavigationData] = useState<NavNode[]>([]);

  useEffect(() => {
    getNavigation().then((navigation) => {
      if (navigation.success) setNavigationData(navigation.data as NavNode[]);
    });
  }, []);

  console.log("navigation", navigationData);
  return (
    <CascaderInteraction onSelect={navigateTo}>
      <Flex direction="column">
        {navigationData?.map((node) => (
          <div
            key={node.id}
            data-path={node.path}
            data-selected={currentPath === node.path}
          >
            {node.title}
          </div>
        ))}
      </Flex>
    </CascaderInteraction>
  );
};

export { CascaderContent };
