import { Flex } from "@/once-ui/components/Flex";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz",
  description: "Quiz page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
