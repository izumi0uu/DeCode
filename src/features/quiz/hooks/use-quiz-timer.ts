import { useState, useEffect } from "react";

const useQuizTimer = (quizData: any, quizSubmitted: boolean) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!quizData?.timeLimit) return;

    setTimeLeft(quizData.timeLimit * 60); // 转换为秒

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0 || quizSubmitted) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizData, quizSubmitted]);

  const resetTimer = () => {
    if (quizData?.timeLimit) {
      setTimeLeft(quizData.timeLimit * 60);
    }
  };

  return {
    timeLeft,
    resetTimer,
  };
};

export default useQuizTimer;
