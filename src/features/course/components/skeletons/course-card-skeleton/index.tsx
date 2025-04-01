import { Flex, Skeleton } from "@/once-ui/components";
import styles from "./styles.module.scss";

interface CourseCardSkeletonProps {
  className?: string;
}
const CourseCardSkeleton = ({ className }: CourseCardSkeletonProps) => {
  return (
    <Flex direction="column" className={className}>
      <Skeleton shape="block" width="xl" height="m" />
      <Flex
        direction="column"
        gap="s"
        style={{ width: "100%", padding: "16px" }}
      >
        <Skeleton shape="line" width="l" height="s" />
        <Skeleton shape="line" width="m" height="s" delay="1" />
        <Skeleton shape="line" width="s" height="s" delay="2" />
      </Flex>
    </Flex>
  );
};

const CourseCardSkeletons = ({ count = 3 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <CourseCardSkeleton key={index} className={styles.card} />
      ))}
    </>
  );
};

export { CourseCardSkeleton, CourseCardSkeletons };
