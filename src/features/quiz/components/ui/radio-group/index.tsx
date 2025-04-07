import React from "react";
import { RadioButton, type RadioButtonProps } from "@/once-ui/components";

interface RadioButtonWithValueProps extends Omit<RadioButtonProps, "onToggle"> {
  value: string;
  onToggle?: () => void;
}

interface RadioGroupProps {
  name: string;
  selectedValue: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  selectedValue,
  onChange,
  children,
}) => {
  // 递归处理子元素，确保只有RadioButton接收isChecked属性
  const processChildren = (children: React.ReactNode): React.ReactNode => {
    return React.Children.map(children, (child) => {
      if (!React.isValidElement(child)) return child;

      // 检查是否为RadioButton组件
      if (
        child.type === RadioButton ||
        (child.props && child.props.value !== undefined)
      ) {
        return React.cloneElement(child, {
          name,
          isChecked: child.props.value === selectedValue,
          onToggle: () => onChange(child.props.value),
        });
      }

      // 如果不是RadioButton但有子元素，递归处理子元素
      if (child.props && child.props.children) {
        return React.cloneElement(child, {
          ...child.props,
          children: processChildren(child.props.children),
        });
      }

      // 其他元素不变
      return child;
    });
  };

  return <>{processChildren(children)}</>;
};

export default RadioGroup;
