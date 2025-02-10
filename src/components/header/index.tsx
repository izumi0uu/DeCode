"use client";

import { Flex, Fade, ToggleButton, Line } from "@/once-ui/components";
import { usePathname } from "next/navigation";

import styles from "./index.module.scss";
import { mode } from "@/resources/config";

const locale = navigator.language;

const Header = () => {
  const pathname = usePathname();
  const isShowHomeBtn = mode.phone.routes["/"] && mode.desktop.routes["/"];
  const isShowMyInfoBtn =
    mode.phone.routes["/myInfo"] && mode.desktop.routes["/myInfo"];
  const isShowCoursesBtn =
    mode.phone.routes["/courses"] && mode.desktop.routes["/courses"];
  const isShowAboutBtn =
    mode.phone.routes["/about"] && mode.desktop.routes["/about"];

  return (
    <>
      <Fade hide="s" position="fixed" fillWidth height="80" zIndex={9} />
      <Fade
        show="s"
        position="fixed"
        fillWidth
        bottom="0"
        to="top"
        height="80"
        zIndex={9}
      />
      <Flex
        fitHeight
        fillWidth
        className={styles.header}
        as="header"
        padding="8"
        horizontal="center"
        zIndex={9}
      >
        <Flex
          paddingLeft="12"
          fillWidth
          vertical="center"
          textVariant="body-default-s"
        >
          {locale && <Flex hide="s">{locale}</Flex>}
        </Flex>
        <Flex fillWidth horizontal="center">
          <Flex
            background="surface"
            border="neutral-medium"
            radius="m-4"
            shadow="l"
            padding="4"
            horizontal="center"
          >
            <Flex gap="4" vertical="center" textVariant="body-default-s">
              {isShowHomeBtn && (
                <ToggleButton
                  prefixIcon="PiHouseDuotone"
                  href="/"
                  selected={pathname === "/"}
                />
              )}
              <Line vert maxHeight="24" />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export { Header };
