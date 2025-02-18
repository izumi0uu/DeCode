import { Flex } from "@/once-ui/components";
import { NavNode } from "@/types";

interface CascaderProps {
  data: NavNode[];
  onSelect: (path: string) => void;
  currentPath?: string;
}

const Cascader = ({ data, onSelect }: CascaderProps) => {
  return <Flex></Flex>;
};

export { Cascader };
