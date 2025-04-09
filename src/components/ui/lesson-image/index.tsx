// src/components/LessonImage/index.tsx
import React, { Suspense } from "react";
import Image from "next/image";
import { Skeleton } from "@/once-ui/components";
import styles from "./index.module.scss";

interface LessonImageProps {
  imageUrl: string | null;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

// 图片加载失败时的占位图
const fallbackImage = "/images/placeholder-course.jpg";

// 实际图片组件
const ActualImage = ({
  imageUrl,
  alt,
  width,
  height,
  priority,
  className,
}: LessonImageProps) => {
  // 如果没有图片URL，使用占位图
  const src = imageUrl || fallbackImage;

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 300}
      height={height || 200}
      className={className}
      priority={priority}
      quality={80}
      loading={priority ? "eager" : "lazy"}
    />
  );
};

// 图片骨架屏组件
const ImageSkeleton = ({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) => (
  <Skeleton
    shape="block"
    style={{
      width: width ? `${width}px` : "100%",
      height: height ? `${height}px` : "200px",
      borderRadius: "10px",
    }}
  />
);

// 主组件
export const LessonImage = (props: LessonImageProps) => {
  return (
    <Suspense
      fallback={<ImageSkeleton width={props.width} height={props.height} />}
    >
      <ActualImage {...props} />
    </Suspense>
  );
};
