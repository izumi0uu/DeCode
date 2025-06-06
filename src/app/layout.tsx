"use client";
import "@/once-ui/styles/index.scss";
import "@/once-ui/tokens/index.scss";

import classNames from "classnames";
import { Background, Column, Flex } from "@/once-ui/components";

import localFont from "next/font/local";
import { Raleway, Sora } from "next/font/google";

import { Header } from "@/components";

import { style, effects } from "@/resources/index";

import { Providers } from "./providers";

// 本地字体作为备选
const interFont = localFont({
  src: "../../public/fonts/Inter.ttf",
  variable: "--font-inter",
  display: "swap",
});

// 首选Google字体，但添加本地字体作为备选
const primary = Raleway({
  variable: "--font-primary",
  subsets: ["latin"],
  display: "swap",
  fallback: ["var(--font-inter)", "system-ui", "Arial", "sans-serif"],
  preload: true,
  weight: ["400", "500", "600", "700"],
});

const secondary = Sora({
  variable: "--font-secondary",
  subsets: ["latin"],
  display: "swap",
  fallback: ["var(--font-inter)", "Georgia", "serif"],
  preload: true,
  weight: ["400", "500", "600", "700"],
});

type FontConfig = {
  variable: string;
};

type OpacityValue = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100;

interface RootLayoutProps {
  children: React.ReactNode;
}

const tertiary: FontConfig | undefined = undefined;

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      data-neutral={style.neutral}
      data-brand={style.brand}
      data-accent={style.accent}
      data-soild={style.solid}
      data-soild-style={style.solidStyle}
      data-theme={style.theme}
      data-border={style.border}
      data-surface={style.surface}
      data-transition={style.transition}
      className={classNames(
        primary.variable,
        secondary.variable,
        tertiary?.variable,
      )}
      suppressHydrationWarning
    >
      <Providers>
        <Column
          as="body"
          style={{ minHeight: "100vh" }}
          fillWidth
          margin="0"
          padding="0"
          className="page-background"
          suppressHydrationWarning
        >
          <Background
            mask={{
              cursor: effects.mask.cursor,
              x: effects.mask.x,
              y: effects.mask.y,
              radius: effects.mask.radius,
            }}
            gradient={{
              display: effects.gradient.display,
              x: effects.gradient.x,
              y: effects.gradient.y,
              width: effects.gradient.width,
              height: effects.gradient.height,
              tilt: effects.gradient.tilt,
              colorStart: effects.gradient.colorStart,
              colorEnd: effects.gradient.colorEnd,
              opacity: effects.gradient.opacity as OpacityValue,
            }}
            dots={{
              display: effects.dots.display,
              color: effects.dots.color,
              size: effects.dots.size as any,
              opacity: effects.dots.opacity as any,
            }}
            lines={{
              display: effects.lines.display,
              opacity: effects.lines.opacity as any,
            }}
            grid={{
              display: effects.grid.display,
              color: effects.grid.color,
              opacity: effects.grid.opacity as any,
            }}
          />
          <Header />
          <Flex position="relative" zIndex={8} fillWidth flex={1} center>
            <Flex minHeight="0" style={{ flexGrow: 1 }}>
              {children}
            </Flex>
          </Flex>
        </Column>
      </Providers>
    </html>
  );
}
