export const simulateCall = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const simulateCallWithData = <T>(ms: number, data: T) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
