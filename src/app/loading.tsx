import { Heading, Column } from "@/once-ui/components";

export default function Loading() {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Column maxWidth="s">
        <Heading wrap="balance" variant="display-strong-l">
          Loading ......
        </Heading>
      </Column>
    </Column>
  );
}
