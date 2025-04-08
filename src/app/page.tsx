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
import { courses, website } from "@/resources/content";
import { AnimateLessonsBoxes } from "@/features/home-and-course-preview/components/animate-lessons-boxes";
import { Footer } from "@/components/layout/footer";

const HomeComponent = () => {
  const cover1 = "/images/cover1.jpg";

  return (
    <Column>
      <Column fillWidth paddingY="l" gap="m">
        <Column maxWidth="l" gap="xl" horizontal="center">
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

        {/* Featured Courses and Lessons Section */}
        <Column fillWidth gap="xl" marginTop="xl" center>
          <RevealFx translateY="16" delay={0.6}>
            <Flex direction="column" style={{ textAlign: "center" }}>
              <Heading variant="display-default-m">
                Featured Courses & Lessons
              </Heading>
              <Text
                variant="body-default-l"
                style={{
                  maxWidth: "800px",
                  margin: "1rem auto 2rem",
                  textAlign: "center",
                }}
              >
                Explore our curated selection of Web3 courses and interactive
                lessons
              </Text>
            </Flex>
          </RevealFx>

          <RevealFx translateY="20" delay={0.8}>
            <AnimateLessonsBoxes
              tagList={[
                "All",
                "Web3 Basics",
                "Blockchain",
                "Smart Contracts",
                "NFTs",
              ]}
              currentTag="All"
            />
          </RevealFx>
        </Column>
      </Column>
      <Footer />
    </Column>
  );
};

export default function Home() {
  return <HomeComponent />;
}
