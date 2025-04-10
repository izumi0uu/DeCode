// components/index.ts
// UI 组件
export { default as Progress } from "./components/ui/progress";
export { default as RadioGroup } from "./components/ui/radio-group";
export { default as Timer } from "./components/ui/timer";

// 问题组件
export { default as SingleChoiceQuestion } from "./components/questions/single-choice-question";
export { default as MultipleChoiceQuestion } from "./components/questions/mutiple-choice-question";
export { default as TrueFalseQuestion } from "./components/questions/true-false-question";
export { default as ShortAnswerQuestion } from "./components/questions/short-answer-question";
export { default as ProgrammingQuestion } from "./components/questions/programming-question";
export { default as QuestionRenderer } from "./components/question-renderer";

// 页面组件
export { default as QuizHeader } from "./components/quiz-header";
export { default as QuizFooter } from "./components/quiz-footer";
export { default as QuestionNav } from "./components/question-nav";
export { default as ValidationErrors } from "./components/validation-errors";
export { default as QuizNotFound } from "./components/quiz-not-found";
export { default as QuizContent } from "./components/quiz-content";
