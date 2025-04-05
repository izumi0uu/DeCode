import { Flex, Skeleton } from "@/once-ui/components";

// 骨架屏单个项组件
const SkeletonItem = () => (
  <Flex direction="column" style={{ marginBottom: "24px", width: "100%" }}>
    <Skeleton
      shape="block"
      style={{
        height: "120px",
        width: "100%",
        marginBottom: "12px",
        borderRadius: "8px",
      }}
    />
    <Skeleton
      shape="block"
      style={{ height: "24px", width: "90%", marginBottom: "8px" }}
    />
    <Skeleton
      shape="block"
      style={{ height: "16px", width: "70%", marginBottom: "8px" }}
    />
    <Flex gap="m" style={{ width: "100%" }}>
      <Skeleton
        shape="block"
        style={{ height: "20px", width: "60px", borderRadius: "4px" }}
      />
      <Skeleton
        shape="block"
        style={{ height: "20px", width: "40px", borderRadius: "4px" }}
      />
    </Flex>
  </Flex>
);

// 侧边栏骨架屏组件
const CourseSidebarSkeleton = () => {
  return (
    <Flex
      direction="column"
      style={{
        width: "400px",
        minWidth: "320px",
        maxWidth: "400px",
        height: "100vh",
        borderRight: "1px solid rgba(51, 102, 255, 0.15)",
        background: "rgba(18, 18, 40, 0.95)",
        padding: "24px 16px",
      }}
    >
      <Skeleton
        shape="block"
        style={{ height: "28px", width: "80%", marginBottom: "8px" }}
      />
      <Skeleton
        shape="block"
        style={{ height: "16px", width: "60%", marginBottom: "24px" }}
      />

      {Array.from({ length: 3 }).map((_, i) => (
        <SkeletonItem key={i} />
      ))}
    </Flex>
  );
};

export { SkeletonItem, CourseSidebarSkeleton };
