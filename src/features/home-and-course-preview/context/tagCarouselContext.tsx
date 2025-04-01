import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import { Tag } from "@/features/types";
import { useCourseCarousel } from "./courseCarouselContext";
import { shuffleArray } from "@/lib/utils/shuffleArray";

interface TagCarouselContextType {
  randomTags: Tag[];
  isTooltipVisible: boolean;
  refreshTags: () => void;
  carouselInterval: number;
  setCarouselInterval: (interval: number) => void;
}

const TagCarouselContext = createContext<TagCarouselContextType | undefined>(
  undefined
);

export const TagCarouselProvider = ({
  children,
  maxTags = 4,
  defaultInterval = 30000,
}: {
  children: ReactNode;
  maxTags?: number;
  defaultInterval?: number;
}) => {
  const { currentCourse, currentIndex } = useCourseCarousel();
  const [randomTags, setRandomTags] = useState<Tag[]>([]);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [carouselInterval, setCarouselInterval] = useState(defaultInterval);

  // 刷新随机标签
  const refreshTags = useCallback(() => {
    if (!currentCourse?.tags || currentCourse.tags.length === 0) {
      setRandomTags([]);
      return;
    }

    // 先隐藏 tooltip
    setIsTooltipVisible(false);

    // 随机选择标签
    const shuffled = shuffleArray(currentCourse.tags);
    const selected = shuffled.slice(0, maxTags);
    setRandomTags(selected);

    // 短暂延迟后显示 tooltip
    setTimeout(() => {
      setIsTooltipVisible(true);
    }, 300);
  }, [currentCourse, maxTags]);

  // 当课程改变时重新选择标签
  useEffect(() => {
    refreshTags();
  }, [currentIndex, refreshTags]);

  // 自动轮播
  useEffect(() => {
    if (carouselInterval <= 0) return;

    const timer = setInterval(() => {
      refreshTags();
    }, carouselInterval);

    return () => clearInterval(timer);
  }, [carouselInterval, refreshTags]);

  const value = {
    randomTags,
    isTooltipVisible,
    refreshTags,
    carouselInterval,
    setCarouselInterval,
  };

  return (
    <TagCarouselContext.Provider value={value}>
      {children}
    </TagCarouselContext.Provider>
  );
};

export const useTagCarousel = () => {
  const context = useContext(TagCarouselContext);
  if (context === undefined) {
    throw new Error("useTagCarousel must be used within a TagCarouselProvider");
  }
  return context;
};
