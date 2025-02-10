import { Column, Heading } from "@/once-ui/components";

import styles from "./index.module.scss";
const Entrance = () => {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Column maxWidth="s">
        <Heading wrap="balance" variant="display-strong-l">
          Loading ......
        </Heading>
      </Column>
    </Column>
  );
};

export { Entrance };
