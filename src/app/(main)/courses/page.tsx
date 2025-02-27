"use client";

import React from "react";
import { Flex } from "@/once-ui/components";
import { CourseCarousel } from "@/components";

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <Flex>
      <CourseCarousel />
    </Flex>
  );
}
