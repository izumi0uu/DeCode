export const simulateCall = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const simulateCallWithData = <T>(ms: number, data: T) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

export * from "./data/courses";
export * from "./data/lessons";
// export * from "./data/quizzes";
// export * from "./data/userProgress";

export * from "./api/navigation";
