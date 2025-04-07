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
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<RadioButtonWithValueProps>(child)) {
      return React.cloneElement(child, {
        name,
        isChecked: child.props.value === selectedValue,
        onToggle: () => onChange(child.props.value),
      });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

export default RadioGroup;
