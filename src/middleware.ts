import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // 获取响应对象
  const response = NextResponse.next();

  // 设置CORS和COOP头部
  response.headers.set("Cross-Origin-Opener-Policy", "unsafe-none");
  response.headers.set("Cross-Origin-Embedder-Policy", "unsafe-none");

  // 处理Web3Auth API请求
  if (request.nextUrl.pathname.startsWith("/web3auth/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  // 处理以太坊RPC请求
  if (request.nextUrl.pathname.startsWith("/ethereum-rpc/")) {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization",
    );
  }

  return response;
}

// 配置中间件匹配路径
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
