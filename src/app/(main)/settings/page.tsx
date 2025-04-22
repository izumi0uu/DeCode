"use client";

import React from "react";
import { useState } from "react";
import {
  Flex,
  Text,
  SegmentedControl,
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Grid,
  Heading,
} from "@/once-ui/components";
import { motion, AnimatePresence } from "framer-motion";
import { useFloating, offset, flip, shift } from "@floating-ui/react";
import { IoHelpCircleOutline } from "react-icons/io5";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const ContributionPage = () => {
  const [activeTab, setActiveTab] = useState("course");
  const { refs, floatingStyles } = useFloating({
    placement: "top",
    middleware: [offset(10), flip(), shift()],
  });
  const [showTooltip, setShowTooltip] = useState(false);

  const renderForm = () => {
    switch (activeTab) {
      case "course":
        return (
          <motion.div
            key="course-form"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            <Heading as="h2">Handle Course</Heading>
            <motion.div variants={itemVariants}>
              <Input id="course-title" label="Course Title" required />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Textarea
                id="course-description"
                label="Course Description"
                rows={5}
                required
              />
            </motion.div>
            <Grid columns={2} gap="8">
              <motion.div variants={itemVariants}>
                <Select
                  id="course-category"
                  label="课程分类"
                  options={[
                    { label: "区块链基础", value: "blockchain-basics" },
                    { label: "智能合约开发", value: "smart-contracts" },
                    { label: "Web3开发", value: "web3-dev" },
                    { label: "数字资产", value: "digital-assets" },
                  ]}
                  required
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <Select
                  id="course-difficulty"
                  label="难度级别"
                  options={[
                    { label: "入门", value: "beginner" },
                    { label: "中级", value: "intermediate" },
                    { label: "高级", value: "advanced" },
                  ]}
                  required
                />
              </motion.div>
            </Grid>
            <motion.div variants={itemVariants}>
              <Input
                id="course-cover"
                label="课程封面图"
                type="file"
                accept="image/*"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Flex flex-end>
                <Button size="l">提交课程</Button>
              </Flex>
            </motion.div>
          </motion.div>
        );
      case "lesson":
        return (
          <motion.div
            key="lesson-form"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            <Heading as="h2" mt="lg" mb="md">
              提交课时内容
            </Heading>
            <motion.div variants={itemVariants}>
              <Select
                label="选择课程"
                placeholder="选择要添加课时的课程"
                options={[
                  { label: "Ethereum开发入门", value: "ethereum-basics" },
                  { label: "Solidity智能合约开发", value: "solidity-dev" },
                  { label: "Web3.js应用开发", value: "web3js-dev" },
                ]}
                mb="md"
                required
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input label="课时标题" mb="md" required />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Textarea
                label="课时内容"
                placeholder="使用Markdown格式编写课时内容，支持代码块、数学公式等"
                rows={10}
                mb="md"
                required
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="视频链接(可选)"
                placeholder="输入视频链接"
                mb="md"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Flex justifyContent="flex-end" mt="lg">
                <Button variant="outline" mr="md">
                  保存草稿
                </Button>
                <Button colorScheme="primary" size="lg">
                  提交课时
                </Button>
              </Flex>
            </motion.div>
          </motion.div>
        );
      case "quiz":
        return (
          <motion.div
            key="quiz-form"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={containerVariants}
          >
            <Heading as="h2" mt="lg" mb="md">
              创建测验问题
            </Heading>
            <Flex alignItems="center" mb="md">
              <Text fontWeight="bold" mr="md">
                需要帮助？
              </Text>
              <Flex
                ref={refs.setReference}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                cursor="pointer"
              >
                <IoHelpCircleOutline size={20} />
              </Flex>
              {showTooltip && (
                <div
                  ref={refs.setFloating}
                  style={{
                    ...floatingStyles,
                    background: "rgba(0, 0, 0, 0.8)",
                    color: "white",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    maxWidth: "300px",
                    zIndex: 1000,
                  }}
                >
                  测验问题将用于评估学习者对课程内容的理解。支持多选题、单选题和判断题。
                </div>
              )}
            </Flex>
            <motion.div variants={itemVariants}>
              <Select
                label="关联课程"
                placeholder="选择关联课程"
                options={[
                  { label: "Ethereum开发入门", value: "ethereum-basics" },
                  { label: "Solidity智能合约开发", value: "solidity-dev" },
                  { label: "Web3.js应用开发", value: "web3js-dev" },
                ]}
                mb="md"
                required
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Select
                label="关联课时"
                placeholder="选择关联课时"
                options={[
                  { label: "区块链基础概念", value: "blockchain-basics-1" },
                  { label: "以太坊架构", value: "ethereum-arch" },
                  { label: "智能合约生命周期", value: "contract-lifecycle" },
                ]}
                mb="md"
                required
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Input
                label="问题标题"
                placeholder="输入问题标题"
                mb="md"
                required
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Select
                label="问题类型"
                placeholder="选择问题类型"
                options={[
                  { label: "单选题", value: "single" },
                  { label: "多选题", value: "multiple" },
                  { label: "判断题", value: "boolean" },
                ]}
                mb="md"
                required
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card p="md" mb="md" variant="outlined">
                <Heading as="h4" mb="sm">
                  选项
                </Heading>
                <Input placeholder="选项A" mb="sm" />
                <Input placeholder="选项B" mb="sm" />
                <Input placeholder="选项C" mb="sm" />
                <Input placeholder="选项D" mb="sm" />
                <Button size="sm" variant="ghost">
                  + 添加选项
                </Button>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Select
                label="正确答案"
                placeholder="选择正确答案"
                options={[
                  { label: "选项A", value: "A" },
                  { label: "选项B", value: "B" },
                  { label: "选项C", value: "C" },
                  { label: "选项D", value: "D" },
                ]}
                mb="md"
                required
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Textarea
                label="解释(可选)"
                placeholder="解释为什么这是正确答案"
                rows={3}
                mb="md"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <Flex justifyContent="flex-end" mt="lg">
                <Button variant="outline" mr="md">
                  预览问题
                </Button>
                <Button colorScheme="primary" size="lg">
                  提交问题
                </Button>
              </Flex>
            </motion.div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <Flex
      as="section"
      direction="column"
      mx="auto"
      px="md"
      py="xl"
      style={{ width: "100%" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Heading as="h1" mb="lg">
          内容贡献中心
        </Heading>
        <Text size="lg" mb="xl">
          作为平台贡献者，您可以提交课程、课时内容和测验问题，丰富DECODE平台的学习资源。
        </Text>

        <Flex height={1000}>
          <SegmentedControl
            buttons={[
              { label: "课程提交", value: "course" },
              { label: "课时内容", value: "lesson" },
              { label: "测验问题", value: "quiz" },
            ]}
            selected={activeTab}
            onToggle={(value) => setActiveTab(value)}
            mb="lg"
          />

          <AnimatePresence mode="wait">{renderForm()}</AnimatePresence>
        </Flex>
      </motion.div>
    </Flex>
  );
};

export default ContributionPage;
