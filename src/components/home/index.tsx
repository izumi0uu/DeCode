import { Column, Heading, InlineCode, RevealFx } from "@/once-ui/components";
import styles from "./index.module.scss";

const website = {
  name: "DeCode",
  subName: "DeCode | a guide for web3 beginner",
  title: "A website for best web3 practices",
  description: (
    <>
      Learn best practices in
      <InlineCode>smart contract development</InlineCode>,{" "}
      <InlineCode>decentralized application architecture</InlineCode>, and{" "}
      <InlineCode>blockchain security</InlineCode> through real-world examples,
    </>
  ),
  headline: "Unlocking the Right Way to Web3 Development right now!",
  subline:
    "From Solidity security model to DAO governance framework, master the core technology of the next generation of Internet",
};

const Home = () => {
  return (
    <Column maxWidth="m" gap="xl" horizontal="center">
      <Column maxWidth="s">
        <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="m">
          <Heading wrap="balance" variant="display-strong-l">
            {website.headline}
          </Heading>
        </RevealFx>
      </Column>
    </Column>
  );
};

export { Home };
