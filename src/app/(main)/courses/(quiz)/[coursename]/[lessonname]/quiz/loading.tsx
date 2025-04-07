"use client";

import React from "react";
import { Flex } from "@/once-ui/components";
import { motion } from "framer-motion";

export default function Loading() {
  return (
    <Flex
      direction="column"
      padding="xl"
      style={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: "70vh",
        position: "relative",
        overflow: "hidden", // 防止内容溢出
      }}
    >
      <div className="loading-container">
        <div className="loading-spinner">
          <div></div>
          <div></div>
          <div></div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            height: "28px",
            marginTop: "24px",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "18px",
          }}
        >
          Loading Quiz
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, times: [0, 0.5, 1] }}
          >
            .
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: 0.2,
              times: [0, 0.5, 1],
            }}
          >
            .
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              delay: 0.4,
              times: [0, 0.5, 1],
            }}
          >
            .
          </motion.span>
        </motion.div>
      </div>

      <style jsx>{`
        .loading-container {
          width: 100%;
          height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: absolute; /* 使用绝对定位 */
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%); /* 确保完全居中 */
        }
        .loading-spinner {
          display: inline-block;
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto;
          opacity: 1;
          animation: fadeIn 0.3s ease-in-out;
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
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
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
