import Image from "next/image";
import { Flex, Fade } from "@/once-ui/components";
import styles from "./index.module.scss";

interface BannerCarouselProps {
  children: React.ReactNode;
  data?: any;
}

const BannerCarousel = ({ children, data }: BannerCarouselProps) => {
  return (
    <Flex fillWidth className={styles.bannerCarousel} direction="column">
      <Flex
        className={styles.imageContainer}
        style={{ position: "relative", height: "500px" }}
      >
        <Image
          src="/images/banner2.png"
          alt="banner"
          sizes="100vw"
          fill
          style={{ objectFit: "cover" }}
          quality={100}
          priority
        />
      </Flex>

      <div className={styles.contentWrapper}>{children}</div>

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
