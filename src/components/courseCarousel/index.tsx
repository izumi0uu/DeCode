"use client";

import React from "react";
import useSWR from "swr";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";
import { Flex } from "@/once-ui/components";
import { CourseCarouselInteraction, CourseCarouselItem } from "@/components";
import styles from "./index.module.scss";

const CourseCarousel = () => {
  const fetcher = async () => {
    const response = await fetch("/api/navigation");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data: carouselData, error } = useSWR("/api/navigation", fetcher, {
    dedupingInterval: 60000,
    onError: (err) => {
      console.log(err);
    },
  });

  const [emblaRef, emblaApi] = useEmblaCarousel();

  if (error || !carouselData) return null;

  return (
    <Flex className={styles.courseCarousel} ref={emblaRef}>
      {carouselData?.data.map((item: any) => (
        <CourseCarouselItem key={item.id} item={item} />
      ))}
    </Flex>
  );
};

export { CourseCarousel };
