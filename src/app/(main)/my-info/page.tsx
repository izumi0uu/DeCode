"use client";

import React from "react";
import {
  Flex,
  Column,
  Heading,
  Text,
  Card,
  Line,
  Badge,
  Grid,
  SmartImage,
  Button,
} from "@/once-ui/components";
import { useWeb3Auth } from "@/contexts/web3auth-context";
import { useQuery } from "@tanstack/react-query";

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

  if (!isLoggedIn) {
    return (
      <Flex center alignItems="center" style={{ minHeight: "60vh" }}>
        <Column gap="8" alignItems="center">
          <Heading>请先登录</Heading>
          <Text>您需要登录才能查看个人信息</Text>
        </Column>
      </Flex>
    );
  }

  return (
    <Column
      gap="8"
      style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1rem" }}
    >
      {/* 个人资料部分 */}
      <Card style={{ padding: "2rem" }}>
        <Column gap="8">
          <Flex gap="8" flex-start>
            <Flex
              style={{
                position: "relative",
                minWidth: "120px",
                minHeight: "120px",
              }}
            >
              {user?.profileImage ? (
                <SmartImage
                  src={user.profileImage}
                  alt={user.name || "userAvator"}
                  style={{
                    borderRadius: "50%",
                    width: "120px",
                    height: "120px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Flex
                  center
                  alignItems="center"
                  style={{
                    borderRadius: "50%",
                    width: "120px",
                    height: "120px",
                    backgroundColor: "#3B82F6",
                    color: "white",
                    fontSize: "2rem",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </Flex>
              )}
            </Flex>

            <Column gap="4" style={{ flex: 1 }}>
              <Heading>{user?.name || "未命名用户"}</Heading>
              <Text>{user?.email || "未提供邮箱"}</Text>

              {user?.walletAddress && (
                <Text>
                  钱包地址:{" "}
                  {`${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`}
                </Text>
              )}

              <Flex gap="2">
                <Badge>Web3学习者</Badge>
                {achievements && achievements.length > 0 && (
                  <Badge color="success">
                    已获得 {achievements.length} 个认证
                  </Badge>
                )}
              </Flex>
            </Column>
          </Flex>

          <Line />

          <Button
            variant="secondary"
            label="编辑个人资料"
            size="m"
            style={{ alignSelf: "flex-start" }}
          />
        </Column>
      </Card>

      {/* 学习进度部分 */}
      {userProgress && (
        <Card style={{ padding: "2rem" }}>
          <Column gap="4">
            <Heading level="h3">学习进度</Heading>

            <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap="4">
              <Card style={{ padding: "1.5rem", backgroundColor: "#f8fafc" }}>
                <Column gap="2">
                  <Text color="secondary">完成课程</Text>
                  <Heading level="h2">
                    {userProgress.completedCourses}/{userProgress.totalCourses}
                  </Heading>
                  <Text>
                    {Math.round(
                      (userProgress.completedCourses /
                        userProgress.totalCourses) *
                        100,
                    )}
                    % 完成
                  </Text>
                </Column>
              </Card>

              <Card style={{ padding: "1.5rem", backgroundColor: "#f8fafc" }}>
                <Column gap="2">
                  <Text color="secondary">进行中课程</Text>
                  <Heading level="h2">{userProgress.inProgressCourses}</Heading>
                  <Text>继续学习</Text>
                </Column>
              </Card>

              <Card style={{ padding: "1.5rem", backgroundColor: "#f8fafc" }}>
                <Column gap="2">
                  <Text color="secondary">完成课时</Text>
                  <Heading level="h2">
                    {userProgress.completedLessons}/{userProgress.totalLessons}
                  </Heading>
                  <Text>
                    {Math.round(
                      (userProgress.completedLessons /
                        userProgress.totalLessons) *
                        100,
                    )}
                    % 完成
                  </Text>
                </Column>
              </Card>
            </Grid>

            <Button
              variant="primary"
              label="继续学习"
              size="m"
              style={{ alignSelf: "flex-start", marginTop: "1rem" }}
            />
          </Column>
        </Card>
      )}

      {/* SBT成就部分 */}
      <Card style={{ padding: "2rem" }}>
        <Column gap="4">
          <Heading level="h3">SBT认证成就</Heading>

          {achievements && achievements.length > 0 ? (
            <Grid columns={{ sm: 1, md: 2, lg: 3 }} gap="4">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  style={{ padding: "1.5rem", backgroundColor: "#f8fafc" }}
                >
                  <Column gap="3">
                    {achievement.imageUrl && (
                      <Flex
                        justifyContent="center"
                        style={{ marginBottom: "1rem" }}
                      >
                        <SmartImage
                          src={achievement.imageUrl}
                          alt={achievement.name}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </Flex>
                    )}
                    <Heading level="h4">{achievement.name}</Heading>
                    <Text>{achievement.description}</Text>
                    <Text size="xs" color="secondary">
                      获得时间: {achievement.dateEarned}
                    </Text>
                  </Column>
                </Card>
              ))}
            </Grid>
          ) : (
            <Flex
              direction="column"
              alignItems="center"
              gap="4"
              style={{ padding: "3rem 1rem" }}
            >
              <Text>您还没有获得SBT认证成就</Text>
              <Button variant="primary" label="浏览课程" size="m" />
            </Flex>
          )}
        </Column>
      </Card>
    </Column>
  );
}
