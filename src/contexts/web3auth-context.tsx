"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import web3AuthService from "@/services/web3auth";
import mockWeb3AuthService from "@/services/mock-web3auth";
import { UserInfo } from "@web3auth/base";

interface Web3AuthContextType {
  user: UserInfo | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const Web3AuthContext = createContext<Web3AuthContextType | undefined>(
  undefined,
);

export const Web3AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const initWeb3Auth = async () => {
      try {
        await web3AuthService.init();
        const userInfo = await web3AuthService.getUserInfo();

        // await mockWeb3AuthService.init();
        // const userInfo = await mockWeb3AuthService.getUserInfo();

        if (userInfo) {
          setUser(userInfo as UserInfo);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to initialize Web3Auth", error);
      } finally {
        setIsLoading(false);
      }
    };

    initWeb3Auth();
  }, []);

  const login = async () => {
    try {
      setIsLoading(true);
      await web3AuthService.login();
      const userInfo = await web3AuthService.getUserInfo();

      // await mockWeb3AuthService.login();
      // const userInfo = await mockWeb3AuthService.getUserInfo();

      if (userInfo) {
        setUser(userInfo as UserInfo);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await web3AuthService.logout();
      // await mockWeb3AuthService.logout();
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
};

export const useWeb3Auth = () => {
  const context = useContext(Web3AuthContext);
  if (context === undefined) {
    throw new Error("useWeb3Auth must be used within a Web3AuthProvider");
  }
  return context;
};
