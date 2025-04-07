import React from "react";

interface ProgressProps {
  value: number;
  max: number;
  size: "s" | "m" | "l";
  status: "success" | "error" | "default";
}

const Progress: React.FC<ProgressProps> = ({ value, max, size, status }) => {
  const percentage = (value / max) * 100;
  return (
    <div
      style={{
        width: "100%",
        height: size === "l" ? "12px" : "8px",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: "6px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: "100%",
          backgroundColor:
            status === "success"
              ? "#4CAF50"
              : status === "error"
              ? "#F44336"
              : "#3366FF",
          transition: "width 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {status === "success" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)",
              animation: "shine 1.5s infinite",
            }}
          />
        )}
      </div>
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default Progress;
