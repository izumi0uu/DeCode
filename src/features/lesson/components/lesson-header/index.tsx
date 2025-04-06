import React from "react";
import { Flex, Text } from "@/once-ui/components";

interface LessonHeaderProps {
  title: string;
  description?: string;
  duration?: number;
  type?: string;
}

export const LessonHeader: React.FC<LessonHeaderProps> = ({
  title,
  description,
  duration,
  type,
}) => {
  return (
    <Flex direction="column" gap="s" style={{ marginBottom: "32px" }}>
      <Text variant="heading-strong-l" color="light">
        {title}
      </Text>
      {description && (
        <Text variant="body-default-m" color="light" style={{ opacity: 0.8 }}>
          {description}
        </Text>
      )}
      <Flex gap="m" style={{ marginTop: "16px" }}>
        {duration && (
          <Text variant="body-default-s" color="light" style={{ opacity: 0.6 }}>
            Duration: {duration} min
          </Text>
        )}
        {type && (
          <Text variant="body-default-s" color="light" style={{ opacity: 0.6 }}>
            Type: {type}
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default LessonHeader;
