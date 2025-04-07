"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function HeaderInteraction({
  children,
}: {
  children: (props: {
    pathname: string;
    locale: string;
    timeZone: string;
    isShowMore: boolean;
    setIsShowMore: (show: boolean) => void;
  }) => React.ReactNode;
}) {
  const [locale, setLocale] = useState("en-US");
  const [timeZone, setTimeZone] = useState("Asia/Shanghai");
  const [isShowMore, setIsShowMore] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setLocale(navigator.language);
    setTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  return children({
    pathname,
    locale,
    timeZone,
    isShowMore,
    setIsShowMore,
  });
}
