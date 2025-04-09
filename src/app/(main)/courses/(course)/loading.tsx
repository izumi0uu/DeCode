import classNames from "classnames";
import { rootLoadingStyles } from "@/features/loading-scss";

export default function Loading() {
  return (
    <div className={rootLoadingStyles.loader}>
      <div
        className={classNames(rootLoadingStyles.face, rootLoadingStyles.face1)}
      >
        <div className={rootLoadingStyles.circle}></div>
      </div>
      <div
        className={classNames(rootLoadingStyles.face, rootLoadingStyles.face2)}
      >
        <div className={rootLoadingStyles.circle}></div>
      </div>
    </div>
  );
}
