import { Icon, Button } from "@/once-ui/components";
import { useState, useCallback } from "react";

const useCopy = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback((value: string) => {
    navigator.clipboard
      .writeText(value)
      .then(() => {
        setCopied(true);
        setTimeout(() => {
          setCopied(false);
        }, 3000);
      })
      .catch((error) => {
        console.error("复制失败:", error);
      });
  }, []);

  return {
    copied,
    copy,
  };
};

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const { copied, copy } = useCopy();

  return (
    <Button variant="primary" size="s" onClick={() => copy(value)}>
      {copied ? <Icon name="check" /> : <Icon name="copy" />}
      <span className="sr-only">{copied ? "已复制" : "复制代码"}</span>
    </Button>
  );
}
