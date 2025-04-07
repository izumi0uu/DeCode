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
  // 修改处理子组件的方法，确保只向RadioButton组件传递isChecked属性
  const processChildren = (children: React.ReactNode) => {
    return React.Children.map(children, (child) => {
      // 如果不是React元素，原样返回
      if (!React.isValidElement(child)) {
        return child;
      }

      // 如果是RadioButton组件，添加属性
      if (child.type === RadioButton) {
        return React.cloneElement(child, {
          name,
          isChecked: child.props.value === selectedValue,
          onToggle: () => onChange(child.props.value),
        });
      }

      // 如果是容器组件，递归处理其子组件
      if (child.props.children) {
        return React.cloneElement(
          child,
          {},
          processChildren(child.props.children)
        );
      }

      // 其他情况原样返回
      return child;
    });
  };

  return <>{processChildren(children)}</>;
};

export default RadioGroup;
