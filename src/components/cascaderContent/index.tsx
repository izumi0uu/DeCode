"use server";

import { Flex } from "@/once-ui/components";
import { CascaderProps } from "@/components/cascader";
import { CascaderInteraction } from "@/components/cascaderInteraction";
import { navigateTo } from "@/app/actions/navigateTo";
import { fetchNavigation } from "@/lib/mock/api/navigation";
import { mode } from "@/resources/config";

const CascaderContent = async ({
  data,
  currentPath,
}: Omit<CascaderProps, "onSelect">) => {
  const navigation = await fetchNavigation({
    withProgress: mode.cascaderMode.withProgress,
    lang: mode.language as "zh" | "en",
  });

  const navigationData = navigation.success ? navigation.data : [];

  // console.log(navigation);
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
