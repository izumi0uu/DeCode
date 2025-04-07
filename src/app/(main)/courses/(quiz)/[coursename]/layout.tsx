import { Metadata } from "next";

export const metadata: Metadata = {
  title: "课程测验",
  description: "课程测验页面",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
