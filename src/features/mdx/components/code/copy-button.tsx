import { Icon, Button } from "@/once-ui/components";
import useCopy from "@/hooks/use-copy";

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
