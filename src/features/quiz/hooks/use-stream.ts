"use client";

import { useState, useEffect } from "react";

export interface StreamState {
  data: { content: string } | string | null;
  status: "idle" | "loading" | "success" | "error";
}

export const useStream = (url: string | null): StreamState => {
  const [state, setState] = useState<StreamState>({
    data: null,
    status: "idle",
  });

  useEffect(() => {
    if (!url) return;

    let isMounted = true;
    setState((prev) => ({ ...prev, status: "loading" }));

    // 使用实际的流处理
    const processStream = async () => {
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Stream request failed: ${response.status}`);
        }

        // 确保响应支持流处理
        if (!response.body) {
          throw new Error("Response body is null");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = "";

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // 解码和处理数据块
          const chunk = decoder.decode(value, { stream: true });
          result += chunk;

          // 更新状态
          if (isMounted) {
            setState({
              data: { content: result },
              status: "success",
            });
          }
        }
      } catch (error) {
        console.error("Stream processing error:", error);
        if (isMounted) {
          setState((prev) => ({ ...prev, status: "error" }));
        }
      }
    };

    processStream();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return state;
};
