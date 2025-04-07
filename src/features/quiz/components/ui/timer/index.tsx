import React from "react";
import { Flex, Text } from "@/once-ui/components";

interface TimerProps {
  timeLeft: number;
}

const Timer: React.FC<TimerProps> = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isWarning = timeLeft < 300; // 少于5分钟显示警告

  return (
    <Flex
      gap="s"
      style={{
        background: isWarning
          ? "rgba(244, 67, 54, 0.1)"
          : "rgba(33, 150, 243, 0.1)",
        padding: "8px 16px",
        borderRadius: "20px",
        transition: "background 0.3s ease",
        alignItems: "center",
      }}
    >
      <span
        className="material-icons-round"
        style={{
          fontSize: "18px",
          color: isWarning ? "var(--color-error)" : "var(--color-primary)",
        }}
      >
        {isWarning ? "alarm" : "schedule"}
      </span>
      <Text
        variant="body-strong-m"
        color={isWarning ? "error" : "primary"}
        style={{
          fontVariantNumeric: "tabular-nums",
          animation: isWarning ? "pulse 1s infinite" : "none",
        }}
      >
        {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </Text>
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 1;
          }
        }
        .material-icons-round {
          font-family: "Material Icons Round";
          font-weight: normal;
          font-style: normal;
          display: inline-block;
          line-height: 1;
          text-transform: none;
          letter-spacing: normal;
          word-wrap: normal;
          white-space: nowrap;
          direction: ltr;
        }
      `}</style>
    </Flex>
  );
};

export default Timer;
