export * from "./types/course";
export * from "./types/lesson";
export * from "./types/quiz";
export * from "./types/user";

export const simulateCall = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const simulateCallWithData = <T>(ms: number, data: T) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
