import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Quiz",
  description: "Quiz page",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
}
