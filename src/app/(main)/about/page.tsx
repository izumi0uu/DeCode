"use client";

import React from "react";
import {
  Flex,
  Column,
  Heading,
  Text,
  Card,
  Badge,
  SmartImage,
  Button,
  Icon,
  Line,
} from "@/once-ui/components";

// 模拟项目技术栈数据
const techStack = [
  {
    category: "Front-end frameworks",
    items: [
      {
        name: "Next.js 15.1.4",
        icon: "nextjs",
        description: "React framework, used to build modern web applications",
      },
      {
        name: "React 18.2.0",
        icon: "react",
        description:
          "User interface library, providing a componentized development experience",
      },
      {
        name: "once-ui 0.5.0",
        icon: "layout",
        description:
          "Internal UI component library, providing a consistent user experience",
      },
    ],
  },
  {
    category: "Blockchain integration",
    items: [
      {
        name: "ethers.js",
        icon: "ethereum",
        description:
          "JavaScript library for interacting with the Ethereum blockchain",
      },
      {
        name: "RainbowKit",
        icon: "wallet",
        description:
          "Wallet connection component library, simplifying Web3 identity verification",
      },
      {
        name: "Wagmi",
        icon: "code",
        description:
          "React hooks library, used for Ethereum application development",
      },
    ],
  },
  {
    category: "Data management",
    items: [
      {
        name: "@tanstack/react-query 5.68.0",
        icon: "database",
        description:
          "Asynchronous state management library, handling API requests",
      },
      {
        name: "IPFS",
        icon: "folder",
        description:
          "Distributed file system, storing course videos and documents",
      },
      {
        name: "The Graph",
        icon: "chart",
        description:
          "  Blockchain indexing protocol, querying chain learning records",
      },
    ],
  },
  {
    category: "Smart contracts",
    items: [
      {
        name: "Hardhat",
        icon: "tool",
        description:
          "Ethereum development environment, used for smart contract deployment and testing",
      },
      {
        name: "OpenZeppelin",
        icon: "shield",
        description:
          "Security smart contract standard library, implementing the ERC-721S standard",
      },
      {
        name: "Solidity",
        icon: "code",
        description: "Ethereum smart contract programming language",
      },
    ],
  },
  {
    category: "AI integration",
    items: [
      {
        name: "Gemini API",
        icon: "bot",
        description:
          "Google AI model, used for code analysis and intelligent question answering.",
      },
    ],
  },
];

// 模拟项目主要功能数据
const features = [
  {
    title: "Course learning center",
    description:
      "Explore various aspects of Web3 development, from blockchain basics to advanced smart contract development.",
    image: "/images/features/courses.png",
    path: "/courses",
  },
  {
    title: "Interactive course content",
    description:
      "Learn the core concepts of blockchain development through videos, documents, and interactive code examples.",
    image: "/images/features/course-detail.png",
    path: "/courses/ethereum-basics",
  },
  {
    title: "Code challenges and knowledge quizzes",
    description:
      "Consolidate your knowledge through practical code challenges and quizzes, and receive immediate feedback.",
    image: "/images/features/quiz.png",
    path: "/quiz/intro",
  },
  {
    title: "AI code analysis",
    description:
      "Submit your code for analysis by AI, receive detailed analysis, improvement suggestions, and performance evaluations.",
    image: "/images/features/result.png",
    path: "/result/example",
  },
  {
    title: "Blockchain certification achievements",
    description:
      "Upon completion of the course, receive a non-transferable SBT digital certificate, proving your learning achievements.",
    image: "/images/features/certification.png",
    path: "/certification",
  },
];

export default function AboutPage() {
  return (
    <Column maxWidth="m">
      {/* 头部介绍 */}
      <Column
        fillWidth
        gap="l"
        paddingTop="xl"
        paddingBottom="xl"
        horizontal="center"
      >
        {/* <SmartImage
          src="/images/logo.png"
          alt="Decode Logo"
          width={120}
          height={120}
        /> */}
        <Heading variant="display-strong-xl" style={{ textAlign: "center" }}>
          Unlocking Web3 Development
        </Heading>
        <Text
          variant="display-default-m"
          onBackground="neutral-weak"
          style={{ textAlign: "center", maxWidth: "800px" }}
        >
          From Solidity security models to DAO governance frameworks, master the
          core technologies of the next-generation internet
        </Text>
        <Flex gap="m" wrap horizontal="center">
          <Button
            prefixIcon="book"
            label="Explore courses"
            size="m"
            variant="primary"
            href="/courses"
          />
          <Button
            prefixIcon="github"
            label="GitHub repositorypository"
            size="m"
            variant="secondary"
            href="https://github.com/R4frain/decode"
          />
        </Flex>
      </Column>

      <Line marginY="xl" />

      {/* 项目特色功能 */}
      <Column fillWidth gap="xl" paddingBottom="xl">
        <Heading
          as="h2"
          variant="display-strong-l"
          style={{ textAlign: "center" }}
        >
          Platform features
        </Heading>

        {features.map((feature, index) => (
          <Card
            key={feature.title}
            border="neutral-medium"
            radius="l"
            padding="xl"
          >
            <Flex
              fillWidth
              gap="xl"
              direction={index % 2 === 0 ? "row" : "row-reverse"}
              mobileDirection="column"
              vertical="center"
            >
              <Flex flex={1}>
                <Card
                  background="brand-alpha-weak"
                  border="brand-alpha-medium"
                  radius="m"
                  style={{
                    aspectRatio: "16/9",
                    overflow: "hidden",
                    width: "100%",
                  }}
                >
                  <Flex center fillWidth fillHeight>
                    <Icon name="image" size="xl" onBackground="brand-medium" />
                  </Flex>
                </Card>
              </Flex>
              <Column flex={1} gap="m">
                <Heading variant="heading-strong-l">{feature.title}</Heading>
                <Text variant="body-default-l">{feature.description}</Text>
                <Flex>
                  <Button
                    variant="tertiary"
                    size="s"
                    label="Learn more"
                    suffixIcon="arrowRight"
                    href={feature.path}
                  />
                </Flex>
              </Column>
            </Flex>
          </Card>
        ))}
      </Column>

      <Line marginY="xl" />

      {/* 技术栈部分 */}
      <Column fillWidth gap="xl" paddingBottom="xl">
        <Heading
          as="h2"
          variant="display-strong-l"
          style={{ textAlign: "center" }}
        >
          Technology stack
        </Heading>
        <Text variant="body-default-l" style={{ textAlign: "center" }}>
          We use a modern technology stack to build the Decode learning
          platform, ensuring scalability, security, and an excellent user
          experience
        </Text>

        <Column gap="l">
          {techStack.map((category) => (
            <Column key={category.category} gap="m">
              <Heading variant="heading-strong-m">{category.category}</Heading>
              <Flex gap="m">
                {category.items.map((tech) => (
                  <Card
                    key={tech.name}
                    border="neutral-medium"
                    radius="m"
                    padding="l"
                    style={{ flex: "1 1 300px", minWidth: "300px" }}
                  >
                    <Column gap="m">
                      <Flex gap="m" vertical="center">
                        <Flex
                          center
                          style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "12px",
                            background: "var(--color-brand-background-weak)",
                          }}
                        >
                          <Icon
                            name={tech.icon}
                            size="l"
                            onBackground="brand-medium"
                          />
                        </Flex>
                        <Heading variant="heading-strong-s">
                          {tech.name}
                        </Heading>
                      </Flex>
                      <Text variant="body-default-m">{tech.description}</Text>
                    </Column>
                  </Card>
                ))}
              </Flex>
            </Column>
          ))}
        </Column>
      </Column>

      {/* 合作与贡献 */}
      <Line marginY="xl" />
      <Column fillWidth gap="m" paddingBottom="xl" horizontal="center">
        <Heading variant="heading-strong-m" style={{ textAlign: "center" }}>
          Contribute to the project
        </Heading>
        <Text
          variant="body-default-l"
          style={{ textAlign: "center", maxWidth: "600px" }}
        >
          Decode is an open-source project, we welcome developers, educators,
          and blockchain enthusiasts to contribute and improve
        </Text>
        <Flex gap="m" marginTop="l">
          <Button
            variant="secondary"
            label="Join the community"
            prefixIcon="users"
            size="m"
          />
          <Button
            variant="secondary"
            label="Submit feature suggestions"
            prefixIcon="lightbulb"
            size="m"
          />
        </Flex>
      </Column>
    </Column>
  );
}
