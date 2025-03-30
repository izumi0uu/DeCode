import Image from "next/image";
import { Flex, Text, RevealFx, Fade } from "@/once-ui/components";
import styles from "./index.module.scss";

interface BannerCarouselProps {
  children: React.ReactNode;
  data?: any;
}

const BannerCarousel = ({ children, data }: BannerCarouselProps) => {
  return (
    <Flex fillWidth className={styles.bannerCarousel} direction="column">
      <Flex className={styles.imageContainer}>
        <Image
          src="/images/banner2.png"
          alt="banner"
          width={1550}
          height={500}
          quality={100}
          priority
          className={styles.bannerBackgroundImage}
        />
      </Flex>

      <div className={styles.contentWrapper}>
        {children}
        <Text variant="body-strong-xl" color="white">
          Hello
        </Text>
      </div>

      <Fade
        hide="s"
        position="absolute"
        fillWidth
        height="104"
        zIndex={9}
        bottom="0"
        to="top"
      />
    </Flex>
  );
};
export { BannerCarousel };
