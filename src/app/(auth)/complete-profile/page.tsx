"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Auth } from "@/contexts/web3auth-context";
import {
  Flex,
  Column,
  Text,
  Heading,
  Input,
  Button,
} from "@/once-ui/components";

export default function CompleteProfilePage() {
  const { user, updateUserInfo, isLoggedIn } = useWeb3Auth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 如果用户未登录，重定向到登录页
    if (!isLoggedIn) {
      router.push("/login");
    }
    // 如果用户信息已完善，重定向到首页
    if (user?.isProfileCompleted) {
      router.push("/");
    }
  }, [isLoggedIn, user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "用户名不能为空";
    }

    if (!formData.password) {
      newErrors.password = "密码不能为空";
    } else if (formData.password.length < 8) {
      newErrors.password = "密码长度至少为8位";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "两次密码不一致";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await updateUserInfo({
        username: formData.username,
        password: formData.password,
        isProfileCompleted: true,
      });

      router.push("/");
    } catch (error) {
      console.error("更新用户信息失败:", error);
      setErrors({ form: "更新用户信息失败，请重试" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Column
      maxWidth="m"
      gap="xl"
      horizontal="center"
      style={{ margin: "0 auto", padding: "40px 20px" }}
    >
      <Heading variant="display-strong-l">完善您的个人信息</Heading>
      <Text variant="body-default-l">请设置您的用户名和密码以完成注册</Text>

      <Column
        as="form"
        onSubmit={handleSubmit}
        gap="l"
        style={{ width: "100%" }}
      >
        <Flex direction="column" gap="xs">
          <Text as="label" htmlFor="username" variant="body-strong-m">
            用户名
          </Text>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="请输入用户名"
            error={errors.username}
          />
          {errors.username && (
            <Text variant="body-default-s" style={{ color: "red" }}>
              {errors.username}
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="xs">
          <Text as="label" htmlFor="password" variant="body-strong-m">
            密码
          </Text>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="请设置密码"
            error={errors.password}
          />
          {errors.password && (
            <Text variant="body-default-s" style={{ color: "red" }}>
              {errors.password}
            </Text>
          )}
        </Flex>

        <Flex direction="column" gap="xs">
          <Text as="label" htmlFor="confirmPassword" variant="body-strong-m">
            确认密码
          </Text>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="请再次输入密码"
            error={errors.confirmPassword}
          />
          {errors.confirmPassword && (
            <Text variant="body-default-s" style={{ color: "red" }}>
              {errors.confirmPassword}
            </Text>
          )}
        </Flex>

        {errors.form && (
          <Text variant="body-default-m" style={{ color: "red" }}>
            {errors.form}
          </Text>
        )}

        <Button
          type="submit"
          variant="primary"
          size="m"
          fillWidth
          disabled={isSubmitting}
        >
          {isSubmitting ? "提交中..." : "完成注册"}
        </Button>
      </Column>
    </Column>
  );
}
