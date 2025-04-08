import { quizLoadingStyles } from "@/features/loading-scss";

export default function Loading() {
  return (
    <div className={quizLoadingStyles.loadingWrapper}>
      <div className={quizLoadingStyles.loadingContainer}>
        <div className={quizLoadingStyles.loadingSpinner}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={quizLoadingStyles.loadingText}>
          Loading Quiz
          <span className={quizLoadingStyles.dot}>.</span>
          <span className={quizLoadingStyles.dot}>.</span>
          <span className={quizLoadingStyles.dot}>.</span>
        </div>
      </div>
    </div>
  );
}
