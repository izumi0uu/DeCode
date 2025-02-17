"use client";

import {
  Flex,
  Fade,
  ToggleButton,
  Line,
  DropdownWrapper,
  Button,
  Arrow,
  SmartLink,
} from "@/once-ui/components";
import { TimeDisplay, PopoverBtn } from "@/components";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import classNames from "classnames";

import styles from "./index.module.scss";
import { mode, courses, myInfo, about } from "@/resources";

const Header = () => {
  const [locale, setLocale] = useState("en-US");
  const [timeZone, setTimeZone] = useState("Asia/Shanghai");

  useEffect(() => {
    setLocale(navigator.language);
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const pathname = usePathname();
  const isShowHomeBtn = mode.phone.routes["/"] || mode.desktop.routes["/"];
  const isShowMyInfoBtn =
    mode.phone.routes["/myInfo"] || mode.desktop.routes["/myInfo"];
  const isShowCoursesBtn =
    mode.phone.routes["/courses"] || mode.desktop.routes["/courses"];
  const isShowAboutBtn =
    mode.phone.routes["/about"] || mode.desktop.routes["/about"];

  const [isShowMore, setIsShowMore] = useState(false);
  const [isShowHover, setIsShowHover] = useState(false);

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
                  prefixIcon="home"
                  href="/"
                  selected={pathname === "/"}
                />
              )}
              <Line vert maxHeight="24" />
              {isShowCoursesBtn && (
                <>
                  <PopoverBtn
                    className="s-flex-hide"
                    prefixIcon="courses"
                    href="/courses"
                    label={courses.label}
                    selected={pathname.startsWith("/courses")}
                    hovercontent={
                      <Flex direction="column">
                        <SmartLink href="/courses">test</SmartLink>
                        <SmartLink href="/courses">test</SmartLink>
                        <SmartLink href="/courses">test</SmartLink>
                      </Flex>
                    }
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="courses"
                    href="/courses"
                    selected={pathname.startsWith("/courses")}
                  />
                </>
              )}
              <Line vert maxHeight="24" />
              {isShowAboutBtn && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="about"
                    href="/about"
                    label={about.label}
                    selected={pathname === "/about"}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="about"
                    href="/about"
                    selected={pathname === "/about"}
                  />
                </>
              )}
              <Line vert maxHeight="24" />
              {isShowMyInfoBtn && (
                <>
                  <ToggleButton
                    className="s-flex-hide"
                    prefixIcon="user"
                    href="/myInfo"
                    label={myInfo.label}
                    selected={pathname === "/myInfo"}
                  />
                  <ToggleButton
                    className="s-flex-show"
                    prefixIcon="user"
                    href="/myInfo"
                    selected={pathname === "/myInfo"}
                  />
                </>
              )}
              <Line vert maxHeight="24" />
              {
                <DropdownWrapper
                  trigger={
                    <Button
                      id="custom-toggle"
                      variant="secondary"
                      prefixIcon={isShowMore ? "noShowMore" : "showMore"}
                      className={classNames(styles.iconTransition)}
                      onClick={() => setIsShowMore(!isShowMore)}
                    />
                  }
                  dropdown={
                    <Flex
                      padding="20"
                      background="surface"
                      border="neutral-medium"
                      radius="m"
                    >
                      <Button
                        id="trigger"
                        variant="secondary"
                        size="s"
                        href="#"
                      >
                        <Flex>
                          Hover me
                          <Arrow trigger="#trigger" color="onBackground" />
                        </Flex>
                      </Button>
                    </Flex>
                  }
                  isOpen={isShowMore}
                  onOpenChange={setIsShowMore}
                  floatingPlacement="bottom-end"
                />
              }
            </Flex>
          </Flex>
        </Flex>
        <Flex fillWidth horizontal="end" vertical="center">
          <Flex
            paddingRight="12"
            horizontal="end"
            vertical="center"
            textVariant="body-default-s"
            gap="20"
          >
            <Flex hide="s">
              {<TimeDisplay timeZone={timeZone} locale={locale} />}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export { Header };
