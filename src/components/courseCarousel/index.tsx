import React from "react";
import { Flex } from "@/once-ui/components";
import { CourseCarouselInteraction } from "@/components/courseCarouselInteraction";
import { CourseDetail } from "@/types";
import styles from "./index.module.scss";

const CourseCarousel = ({ courses }: { courses: CourseDetail[] }) => {
  return (
    <CourseCarouselInteraction>
      <Flex className={styles.embla}></Flex>
    </CourseCarouselInteraction>
  );
};

export { CourseCarousel };
