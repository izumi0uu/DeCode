"use client";

import { useParams } from "next/navigation";
import { Flex, Text } from "@/once-ui/components";
import {
  QuizResultProvider,
  useQuizResultContext,
} from "@/features/quiz/contexts/quiz-result-context";
import {
  ResultLayout,
  ScoreSummary,
  QuestionList,
  NavigationButtons,
} from "@/features/quiz/components/results";
import Loading from "./loading";

// 对结果进行包装的组件
const QuizResultContent = () => {
  const { quizData, score, isLoading } = useQuizResultContext();

  if (isLoading) {
    return <Loading />;
  }

  if (!quizData) {
    return (
      <Flex direction="column" align="center" padding="8">
        <Text>Failed to load quiz results</Text>
      </Flex>
    );
  }

  return (
    <>
      <ScoreSummary score={score.correct} totalScore={score.total} />
      <QuestionList />
      <NavigationButtons />
    </>
  );
};

// 主页面组件
export default function QuizResultPage() {
  const params = useParams();
  const lessonSlug = params.lessonname as string;
  const quizSlug = params.quizname as string;
  return (
    <QuizResultProvider lessonSlug={lessonSlug} quizSlug={quizSlug}>
      <ResultLayout>
        <QuizResultContent />
      </ResultLayout>
    </QuizResultProvider>
  );
}
