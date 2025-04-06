import React from "react";
import { Flex, Button } from "@/once-ui/components";
import Link from "next/link";

interface LessonNavigationProps {
  courseName: string;
  prevLesson?: { slug: string; title: string };
  nextLesson?: { slug: string; title: string };
}

export const LessonNavigation: React.FC<LessonNavigationProps> = ({
  courseName,
  prevLesson,
  nextLesson,
}) => {
  return (
    <Flex
      style={{
        marginTop: "48px",
        padding: "24px 0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {prevLesson ? (
        <Link href={`/courses/${courseName}/${prevLesson.slug}`} passHref>
          <Button variant="secondary">Previous: {prevLesson.title}</Button>
        </Link>
      ) : (
        <div></div>
      )}

      {nextLesson && (
        <Link href={`/courses/${courseName}/${nextLesson.slug}`} passHref>
          <Button variant="primary" arrowIcon>
            Next: {nextLesson.title}
          </Button>
        </Link>
      )}
    </Flex>
  );
};

export default LessonNavigation;
