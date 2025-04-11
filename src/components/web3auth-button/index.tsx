"use client";

import React from "react";
import {
  Button,
  Flex,
  UserMenu,
  Option,
  Line,
  Column,
} from "@/once-ui/components";
import { useWeb3Auth } from "@/contexts/web3auth-context";

interface Web3AuthButtonProps {
  className?: string;
}

const Web3AuthButton: React.FC<Web3AuthButtonProps> = ({ className }) => {
  const { user, isLoggedIn, isLoading, login, logout } = useWeb3Auth();

  return (
    <Flex className={className}>
      {isLoggedIn && user ? (
        <UserMenu
          name={user.name}
          subline={user.email}
          avatarProps={{
            empty: !user.profileImage,
            src: user.profileImage,
          }}
          dropdown={
            <Column padding="2" gap="2" minWidth={8}>
              <Option label="Profile" value="profile" />
              <Option label="Settings" value="settings" />
              <Line />
              <Option
                label="Logout"
                value="logout"
                onClick={async (e: React.MouseEvent) => {
                  e.preventDefault();
                  await logout();
                }}
              />
            </Column>
          }
        />
      ) : (
        <Button
          size="s"
          variant="primary"
          label={isLoading ? "Loading..." : "Login"}
          onClick={login}
          disabled={isLoading}
        />
      )}
    </Flex>
  );
};

export default Web3AuthButton;
