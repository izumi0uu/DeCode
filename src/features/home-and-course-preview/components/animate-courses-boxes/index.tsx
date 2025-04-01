import { Flex } from "@/once-ui/components";
import { useCourseCarousel } from "../../context/courseCarouselContext";
import styles from "./index.module.scss";

const AnimateCoursesBoxes = () => {
  const { courses } = useCourseCarousel();
  return <Flex></Flex>;
};

export { AnimateCoursesBoxes };
