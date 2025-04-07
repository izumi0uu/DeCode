// components/questions/ProgrammingQuestion.tsx
import React from "react";
import { Text } from "@/once-ui/components";

interface ProgrammingQuestionProps {
  questionId: number;
  codeTemplate?: string;
  value: string;
  onChange: (questionId: number, value: string) => void;
}

const ProgrammingQuestion: React.FC<ProgrammingQuestionProps> = ({
  questionId,
  codeTemplate,
  value,
  onChange,
}) => {
  return (
    <div style={{ width: "100%" }}>
      <Text variant="body-strong-m" style={{ marginBottom: "12px" }}>
        Write your code here:
      </Text>
      {codeTemplate && (
        <div style={{ position: "relative" }}>
          <textarea
            style={{
              width: "100%",
              minHeight: "300px",
              padding: "16px",
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
              border: "1px solid #333333",
              borderRadius: "8px",
              fontFamily: "monospace",
              fontSize: "14px",
              lineHeight: "1.5",
              resize: "vertical",
            }}
            value={
              value || codeTemplate.replace(/\\n/g, "\n").replace(/\\"/g, '"')
            }
            onChange={(e) => onChange(questionId, e.target.value)}
          />
          <div
            style={{
              position: "absolute",
              top: "8px",
              right: "8px",
              background: "#252525",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#888888",
            }}
          >
            Solidity
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgrammingQuestion;
