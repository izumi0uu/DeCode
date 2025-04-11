/* 创建src/services/mock-web3auth.tsx */
import { UserInfo } from "@web3auth/base";

class MockWeb3AuthService {
  private static instance: MockWeb3AuthService;

  private constructor() {}

  public static getInstance(): MockWeb3AuthService {
    if (!MockWeb3AuthService.instance) {
      MockWeb3AuthService.instance = new MockWeb3AuthService();
    }
    return MockWeb3AuthService.instance;
  }

  public async init() {
    console.log("Mock Web3Auth 初始化");
    return null;
  }

  public async login() {
    console.log("Mock 登录");
    return null;
  }

  public async getUserInfo() {
    // 返回模拟的用户信息
    const mockUserInfo: UserInfo = {
      email: "test@example.com",
      name: "测试用户",
      //   profileImage: "https://via.placeholder.com/150",
      verifier: "mock",
      verifierId: "mock-id",
      typeOfLogin: "google",
      aggregateVerifier: "mock",
      dappShare: "",
    };
    return mockUserInfo;
  }

  public getProvider() {
    return null;
  }

  public async logout() {
    console.log("Mock 登出");
    return true;
  }
}

export default MockWeb3AuthService.getInstance();
