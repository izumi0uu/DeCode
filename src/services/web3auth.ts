import { Web3AuthMPCCoreKit, WEB3AUTH_NETWORK } from "@web3auth/mpc-core-kit";
import { CHAIN_NAMESPACES, Web3AuthOptions } from "@web3auth/base";

export class Web3AuthService {
  private static instance: Web3AuthService;
  private coreKitInstance: Web3AuthMPCCoreKit | null = null;
  private initialized = false;

  private constructor() {}

  public static getInstance(): Web3AuthService {
    if (!Web3AuthService.instance) {
      Web3AuthService.instance = new Web3AuthService();
    }
    return Web3AuthService.instance;
  }

  public async init() {
    if (this.initialized) {
      return this.coreKitInstance;
    }

    try {
      this.coreKitInstance = new Web3AuthMPCCoreKit({
        web3AuthClientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string,
        web3AuthNetwork: WEB3AUTH_NETWORK.MAINNET,
        manualSync: true, // 推荐的方法
      } as Web3AuthOptions);

      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1", // 使用 0xaa36a7 为 Sepolia 测试网
        rpcTarget: "https://rpc.ethereum.org",
        displayName: "Ethereum Mainnet",
        blockExplorer: "https://etherscan.io/",
        ticker: "ETH",
        tickerName: "Ethereum",
      };

      // 初始化 SDK
      await this.coreKitInstance.init();
      this.initialized = true;
      return this.coreKitInstance;
    } catch (error) {
      console.error("初始化 Web3Auth 时出错：", error);
      return null;
    }
  }

  public async login() {
    try {
      if (!this.coreKitInstance) {
        await this.init();
      }

      if (!this.coreKitInstance) {
        throw new Error("Web3Auth 未初始化");
      }

      const web3authProvider = await this.coreKitInstance.loginWithOAuth({
        subVerifierDetails: {
          typeOfLogin: "google",
          verifier: process.env.NEXT_PUBLIC_WEB3AUTH_VERIFIER_NAME as string,
          clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
        },
      });

      return web3authProvider;
    } catch (error) {
      console.error("登录失败：", error);
      throw error;
    }
  }

  public async getUserInfo() {
    try {
      if (!this.coreKitInstance) {
        throw new Error("Web3Auth 未初始化");
      }

      const user = await this.coreKitInstance.getUserInfo();
      return user;
    } catch (error) {
      console.error("获取用户信息失败：", error);
      return null;
    }
  }

  public async getKeyDetails() {
    try {
      if (!this.coreKitInstance) {
        throw new Error("Web3Auth 未初始化");
      }

      const keyDetails = await this.coreKitInstance.getKeyDetails();
      return keyDetails;
    } catch (error) {
      console.error("获取密钥详情失败：", error);
      return null;
    }
  }

  public async logout() {
    try {
      if (!this.coreKitInstance) {
        throw new Error("Web3Auth 未初始化");
      }

      await this.coreKitInstance.logout();
      return true;
    } catch (error) {
      console.error("登出失败：", error);
      return false;
    }
  }

  public getProvider() {
    return this.coreKitInstance?.provider;
  }
}

export default Web3AuthService.getInstance();
