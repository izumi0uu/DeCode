"use client";

import React from "react";
import { Flex, Text } from "@/once-ui/components";

export default function Loading() {
  return (
    <Flex
      direction="column"
      padding="xl"
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
      }}
    >
      <div className="loading-spinner">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <Text variant="heading-strong-m" style={{ marginTop: "24px" }}>
        Loading Quiz...
      </Text>

      <style jsx>{`
        .loading-spinner {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
        }
        .loading-spinner div {
          position: absolute;
          border: 4px solid #3366ff;
          opacity: 1;
          border-radius: 50%;
          animation: loading-spinner 1.5s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .loading-spinner div:nth-child(2) {
          animation-delay: -0.5s;
        }
        .loading-spinner div:nth-child(3) {
          animation-delay: -1s;
        }
        @keyframes loading-spinner {
          0% {
            top: 36px;
            left: 36px;
            width: 0;
            height: 0;
            opacity: 1;
          }
          100% {
            top: 0px;
            left: 0px;
            width: 72px;
            height: 72px;
            opacity: 0;
          }
        }
      `}</style>
    </Flex>
  );
}
