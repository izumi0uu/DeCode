"use client";

import React from "react";
import { Checkbox } from "@/once-ui/components";

interface CheckboxProps {
  value: string;
  label: string;
  isChecked?: boolean;
  onToggle?: () => void;
}

interface CheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
  children: React.ReactNode;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  value,
  onChange,
  children,
}) => {
  const handleCheckboxChange = (checkboxValue: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...value, checkboxValue]);
    } else {
      onChange(value.filter((v) => v !== checkboxValue));
    }
  };

  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement<CheckboxProps>(child) && child.type === Checkbox) {
      return React.cloneElement(child, {
        ...child.props,
        isChecked: value.includes(child.props.value),
        onToggle: () =>
          handleCheckboxChange(
            child.props.value,
            !value.includes(child.props.value)
          ),
      });
    }
    return child;
  });

  return <>{childrenWithProps}</>;
};

export default CheckboxGroup;
