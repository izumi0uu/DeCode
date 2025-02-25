"use client";

import useEmblaCarousel from "embla-carousel-react";
import { EmblaOptionsType } from "embla-carousel";

const CourseCarouselInteraction = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel();

  return <div>{children}</div>;
};

export { CourseCarouselInteraction };
