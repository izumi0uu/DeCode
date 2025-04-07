import React from "react";
import { Flex, Text, Card } from "@/once-ui/components";

interface ValidationErrorsProps {
  errors: string[];
}

const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Card
      padding="m"
      style={{
        marginBottom: "20px",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        border: "1px solid rgba(244, 67, 54, 0.3)",
        borderRadius: "8px",
      }}
    >
      <Flex gap="s" style={{ marginBottom: "8px", alignItems: "center" }}>
        <span
          className="material-icons-round"
          style={{ color: "var(--color-error)", fontSize: "18px" }}
        >
          error_outline
        </span>
        <Text variant="body-strong-m" color="error">
          Please fix the following issues:
        </Text>
      </Flex>
      <Flex direction="column" gap="s">
        {errors.map((error, index) => (
          <Text key={index} variant="body-default-m" color="error">
            • {error}
          </Text>
        ))}
      </Flex>
    </Card>
  );
};

export default ValidationErrors;
