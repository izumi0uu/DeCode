"use client";

import React from "react";
import { Flex } from "@/once-ui/components";
import {
  BannerCarousel,
  AnimatePresenceStackWrapper,
} from "@/features/home-and-course-preview/components";

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <Flex>
      <BannerCarousel>
        <AnimatePresenceStackWrapper />
      </BannerCarousel>
    </Flex>
  );
}
