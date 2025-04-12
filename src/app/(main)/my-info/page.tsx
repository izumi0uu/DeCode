"use client";

import React, { useState } from "react";
import {
  Flex,
  Column,
  Heading,
  Text,
  Card,
  Badge,
  SmartImage,
  Button,
  Avatar,
  Icon,
  Input,
  Textarea,
} from "@/once-ui/components";
import { useWeb3Auth } from "@/contexts/web3auth-context";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

// 模拟获取用户课程进度数据
const fetchUserProgress = async (userId: string) => {
  // 这里应当用实际API替换
  return {
    completedCourses: 2,
    inProgressCourses: 3,
    totalCourses: 8,
    completedLessons: 12,
    totalLessons: 36,
  };
};

// 模拟获取SBT成就数据
const fetchUserAchievements = async (walletAddress: string) => {
  // 这里应当用实际API替换
  return [
    {
      id: "1",
      name: "Web3基础",
      description: "完成Web3和区块链基础课程",
      imageUrl: "/images/sbt/web3-basics.png",
      dateEarned: "2023-10-15",
    },
    {
      id: "2",
      name: "以太坊开发者",
      description: "完成智能合约开发基础",
      imageUrl: "/images/sbt/ethereum-dev.png",
      dateEarned: "2023-11-20",
    },
  ];
};

export default function MyInfoPage() {
  const { user, isLoggedIn } = useWeb3Auth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
  });

  const { data: userProgress } = useQuery({
    queryKey: ["userProgress", user?.id],
    queryFn: () => fetchUserProgress(user?.id || ""),
    enabled: !!user?.id && isLoggedIn,
  });

  const { data: achievements } = useQuery({
    queryKey: ["userAchievements", user?.walletAddress],
    queryFn: () => fetchUserAchievements(user?.walletAddress || ""),
    enabled: !!user?.walletAddress && isLoggedIn,
  });

  const handleEditFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveChanges = () => {
    // 这里应实现保存用户数据的API调用
    console.log("保存用户数据:", editForm);
    // 模拟API调用成功后关闭编辑区域
    setIsEditing(false);
  };

  if (!isLoggedIn) {
    return (
      <Column maxWidth="m">
        <Flex fillHeight center vertical="center" style={{ minHeight: "60vh" }}>
          <Column gap="m" horizontal="center" textVariant="body-default-l">
            <Heading variant="display-strong-l">Please login first</Heading>
            <Text onBackground="neutral-weak">
              You need to login to view your personal information
            </Text>
          </Column>
        </Flex>
      </Column>
    );
  }

  return (
    <Column maxWidth="m">
      <Flex fillWidth mobileDirection="column" horizontal="center">
        {/* 左侧个人资料卡片 */}
        <Column
          minWidth="160"
          paddingX="l"
          paddingBottom="xl"
          gap="m"
          flex={3}
          horizontal="center"
        >
          {user?.profileImage ? (
            <Avatar src={user.profileImage} size="xl" />
          ) : (
            <Avatar
              value={user?.name?.charAt(0).toUpperCase() || "U"}
              size="xl"
            />
          )}

          {user?.walletAddress && (
            <Flex gap="8" vertical="center">
              <Icon onBackground="accent-weak" name="link" />
              <Text>{`${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`}</Text>
            </Flex>
          )}

          <Flex wrap gap="8" horizontal="center">
            <Badge arrow={false}>Web3 Learner</Badge>
            {achievements && achievements.length > 0 && (
              <Badge background="success-weak">
                {achievements.length} certifications
              </Badge>
            )}
          </Flex>
        </Column>

        {/* 右侧内容区域 */}
        <Column flex={9} maxWidth={40}>
          {/* 个人信息部分 */}
          <Column fillWidth minHeight="160" vertical="center" marginBottom="32">
            <Heading variant="display-strong-xl">
              {user?.name || "Unnamed user"}
            </Heading>
            <Text variant="display-default-xs" onBackground="neutral-weak">
              {user?.email || "No email provided"}
            </Text>

            <Flex
              paddingTop="20"
              paddingBottom="8"
              gap="8"
              horizontal="center"
              fitWidth
            >
              <Button
                prefixIcon="edit"
                label="Edit personal information"
                size="s"
                variant="secondary"
                onClick={() => setIsEditing(!isEditing)}
              />
            </Flex>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  style={{ width: "100%", overflow: "hidden" }}
                >
                  <Card
                    border="neutral-medium"
                    radius="m"
                    padding="l"
                    marginTop="m"
                    style={{ width: "100%" }}
                  >
                    <Column gap="m" style={{ width: "100%", flexGrow: 1 }}>
                      <Heading variant="heading-strong-s">
                        Edit your profile
                      </Heading>

                      <Input
                        id="user-name"
                        label="Name"
                        value={editForm.name}
                        onChange={(e) =>
                          handleEditFormChange("name", e.target.value)
                        }
                        hasPrefix={
                          <Icon name="user" onBackground="neutral-medium" />
                        }
                      />

                      <Input
                        id="user-email"
                        label="Email"
                        value={editForm.email}
                        onChange={(e) =>
                          handleEditFormChange("email", e.target.value)
                        }
                        hasPrefix={
                          <Icon name="email" onBackground="neutral-medium" />
                        }
                      />

                      <Textarea
                        id="user-bio"
                        label="Bio"
                        value={editForm.bio}
                        onChange={(e) =>
                          handleEditFormChange("bio", e.target.value)
                        }
                      />

                      <Flex gap="m" horizontal="end">
                        <Button
                          label="Cancel"
                          size="s"
                          variant="tertiary"
                          onClick={() => setIsEditing(false)}
                        />
                        <Button
                          label="Save changes"
                          size="s"
                          variant="primary"
                          onClick={handleSaveChanges}
                        />
                      </Flex>
                    </Column>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </Column>

          {/* 学习进度部分 */}
          {userProgress && (
            <Column
              textVariant="body-default-l"
              fillWidth
              gap="m"
              marginBottom="xl"
            >
              <Heading as="h2" variant="display-strong-s" marginBottom="m">
                Learning progress
              </Heading>

              <Flex fillWidth gap="m" wrap>
                <Card border="neutral-medium" radius="m" padding="l" flex={1}>
                  <Column gap="4">
                    <Text onBackground="neutral-weak">Completed courses</Text>
                    <Heading variant="heading-strong-l">
                      {userProgress.completedCourses}/
                      {userProgress.totalCourses}
                    </Heading>
                    <Text variant="body-default-s" onBackground="brand-weak">
                      {Math.round(
                        (userProgress.completedCourses /
                          userProgress.totalCourses) *
                          100,
                      )}
                      % completed
                    </Text>
                  </Column>
                </Card>

                <Card border="neutral-medium" radius="m" padding="l" flex={1}>
                  <Column gap="4">
                    <Text onBackground="neutral-weak">In progress courses</Text>
                    <Heading variant="heading-strong-l">
                      {userProgress.inProgressCourses}
                    </Heading>
                    <Text variant="body-default-s" onBackground="brand-weak">
                      Continue learning
                    </Text>
                  </Column>
                </Card>

                <Card border="neutral-medium" radius="m" padding="l" flex={1}>
                  <Column gap="4">
                    <Text onBackground="neutral-weak">Completed lessons</Text>
                    <Heading variant="heading-strong-l">
                      {userProgress.completedLessons}/
                      {userProgress.totalLessons}
                    </Heading>
                    <Text variant="body-default-s" onBackground="brand-weak">
                      {Math.round(
                        (userProgress.completedLessons /
                          userProgress.totalLessons) *
                          100,
                      )}
                      % completed
                    </Text>
                  </Column>
                </Card>
              </Flex>

              <Flex marginTop="m">
                <Button
                  href="/courses"
                  label="Continue learning"
                  prefixIcon="play"
                  size="m"
                  variant="primary"
                />
              </Flex>
            </Column>
          )}

          {/* SBT成就部分 */}
          <Column fillWidth>
            <Heading as="h2" variant="display-strong-s" marginBottom="m">
              SBT certifications
            </Heading>

            {achievements && achievements.length > 0 ? (
              <Flex fillWidth gap="m" wrap>
                {achievements.map((achievement) => (
                  <Card
                    key={achievement.id}
                    border="neutral-medium"
                    radius="m"
                    padding="l"
                    flex={1}
                  >
                    <Column gap="4">
                      {achievement.imageUrl && (
                        <Flex horizontal="center" marginBottom="m">
                          <SmartImage
                            src={achievement.imageUrl}
                            alt={achievement.name}
                            width={100}
                            height={100}
                            radius="m"
                          />
                        </Flex>
                      )}
                      <Heading variant="heading-strong-m">
                        {achievement.name}
                      </Heading>
                      <Text variant="body-default-m">
                        {achievement.description}
                      </Text>
                      <Text
                        variant="body-default-xs"
                        onBackground="neutral-weak"
                      >
                        Date of award: {achievement.dateEarned}
                      </Text>
                    </Column>
                  </Card>
                ))}
              </Flex>
            ) : (
              <Card border="neutral-medium" radius="m" padding="xl">
                <Column horizontal="center" gap="m">
                  <Text variant="body-default-m" onBackground="neutral-weak">
                    You have not yet obtained SBT certification achievements
                  </Text>
                  <Button
                    href="/courses"
                    label="Browse courses"
                    size="m"
                    variant="primary"
                  />
                </Column>
              </Card>
            )}
          </Column>
        </Column>
      </Flex>
    </Column>
  );
}
