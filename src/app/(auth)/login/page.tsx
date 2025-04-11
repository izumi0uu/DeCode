"use client";

import { useWeb3Auth } from "@/contexts/web3auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { login, isLoggedIn, isLoading, user } = useWeb3Auth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn && user) {
      router.push("/dashboard");
    }
  }, [isLoggedIn, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">登录</h1>
          <p className="mt-2 text-gray-600">使用Web3Auth登录您的账户</p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={login}
            disabled={isLoading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {isLoading ? "登录中..." : "Web3Auth 登录"}
          </button>
        </div>
      </div>
    </div>
  );
}
