import Image from "next/image";
import { Flex, Text } from "@/once-ui/components";
import styles from "./index.module.scss";

interface CourseCarouselItemProps {
  item: any;
}

const CourseCarouselItem = ({ item }: CourseCarouselItemProps) => {
  const randomImageId = Math.floor(Math.random() * 1000);
  return (
    <Flex>
      <Image
        src={`https://picsum.photos/600/350?v=${randomImageId}`}
        alt={item.title}
        width={160}
        height={80}
      />
      <Flex className={styles.itemContent}>
        <Text>{item.title}</Text>
      </Flex>
    </Flex>
  );
};

export { CourseCarouselItem };
