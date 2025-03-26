type CourseID = number;
type LessonID = number;
type QuestionID = number;

// 题目类型定义
type QuizQuestion = {
  id: QuestionID;
  course_id: CourseID;
  lesson_id: LessonID;
  title: string;
  explanation: string; // 题目解析
  difficulty: "easy" | "medium" | "hard";
  weight: number; // 题目分值
  updated_at: string;
  created_at: string;
} & (
  | {
      type: "single";
      options: string[];
      correct_option_index: number;
    }
  | {
      type: "multiple";
      options: string[];
      correct_option_index: number[];
    }
  | {
      type: "fill_blank";
      template: string; // 包含 ___ 的填空模板
      correct: string[];
    }
  | {
      type: "code_submission";
      language: "solidity" | "react";
      starter_code: string;
      test_cases: {
        input: string;
        expected: string;
        isHidden: boolean;
      }[];
      ai_evaluation: boolean;
    }
);

// 测验元数据
interface QuizMeta {
  id: string;
  course_id: CourseID;
  lesson_id: LessonID;
  required_score: number; // 通过分数
  retry_limit: number; // 重试次数限制
  sbt_reward: {
    contract_address: string;
    token_id: number;
  } | null;
}

// 用户答题记录
interface QuizAttempt {
  user_id: string;
  quiz_id: string;
  start_time: Date;
  end_time?: Date;
  score: number;
  passed: boolean;
  answers: {
    [questionId: QuestionID]: {
      response: any;
      isCorrect?: boolean;
      feedback?: string; // AI反馈
      code_score?: number; // 代码题评分
    };
  };
}

interface QuizResponse {
  meta: QuizMeta;
  questions: QuizQuestion[];
}

interface CodeEvaluationParams {
  code: string;
  questionId: QuestionID;
  userId: string;
  attemptId: string;
}

export type {
  QuizQuestion,
  QuizMeta,
  QuizAttempt,
  QuizResponse,
  CodeEvaluationParams,
};
