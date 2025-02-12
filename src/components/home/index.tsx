import {
  Column,
  Flex,
  Heading,
  RevealFx,
  SmartImage,
  Text,
  Button,
  Avatar,
} from "@/once-ui/components";
import styles from "./index.module.scss";
import { courses, website } from "@/resources/content";

const Home = () => {
  const cover1 = "/images/cover1.jpg";

  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Column fillWidth paddingY="l" gap="m">
        <Column maxWidth="s">
          <RevealFx
            translateY="4"
            fillWidth
            horizontal="end"
            paddingBottom="m"
            gap="m"
          >
            <SmartImage src={cover1} alt="cover" />
            <Heading wrap="balance" variant="display-strong-l">
              {website.headline}
            </Heading>
          </RevealFx>
          <RevealFx
            translateY="8"
            delay={0.2}
            fillWidth
            horizontal="start"
            paddingBottom="m"
          >
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="heading-default-xl"
            >
              {website.subline}
            </Text>
          </RevealFx>
          <RevealFx translateY="12" delay={0.4} horizontal="start">
            <Button
              id="about"
              data-border="rounded"
              href="/courses"
              variant="secondary"
              size="m"
              arrowIcon
            >
              <Flex gap="8" vertical="center">
                <Avatar
                  style={{ marginLeft: "-0.75rem", marginRight: "0.25rem" }}
                  src={courses.picUrl}
                  size="m"
                />
                {courses.button}
              </Flex>
            </Button>
          </RevealFx>
        </Column>
      </Column>
    </Column>
  );
};

export { Home };
