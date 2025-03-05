import Image from "next/image";
import { Flex, Text } from "@/once-ui/components";
import styles from "./index.module.scss";

const BannerCarousel = () => {
  return (
    <Flex
      fillWidth
      maxWidth="l"
      hide="s"
      className={styles.bannerCarousel}
      paddingY="l"
      paddingX="l"
    >
      <Image
        src="/images/banner2.png"
        alt="banner"
        fill
        quality={100}
        priority
        className={styles.bannerBackgroundImage}
      />
      <Flex fillWidth className={styles.bannerContent}>
        <Text>WEB3 AND AI ASSISTANT</Text>
      </Flex>
    </Flex>
  );
};

export { BannerCarousel };
