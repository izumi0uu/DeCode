import { quizLoadingStyles as quizResultLoadingStyles } from "@/features/loading-scss";

export default function Loading() {
  return (
    <div className={quizResultLoadingStyles.loadingWrapper}>
      <div className={quizResultLoadingStyles.loadingContainer}>
        <div className={quizResultLoadingStyles.loadingSpinner}>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div className={quizResultLoadingStyles.loadingText}>
          Loading Quiz Result
          <span className={quizResultLoadingStyles.dot}>.</span>
          <span className={quizResultLoadingStyles.dot}>.</span>
          <span className={quizResultLoadingStyles.dot}>.</span>
        </div>
      </div>
    </div>
  );
}
