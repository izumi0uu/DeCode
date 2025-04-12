import { Web3Auth, Web3AuthOptions } from "@web3auth/modal";
import { CHAIN_NAMESPACES, WEB3AUTH_NETWORK, IProvider } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";

export class Web3AuthService {
  private static instance: Web3AuthService;
  private web3AuthInstance: Web3Auth | null = null;
  private initialized = false;
  private provider: IProvider | null = null;

  private constructor() {}

  public static getInstance(): Web3AuthService {
    if (!Web3AuthService.instance) {
      Web3AuthService.instance = new Web3AuthService();
    }
    return Web3AuthService.instance;
  }

  public async init() {
    if (this.initialized) {
      return this.web3AuthInstance;
    }

    try {
      const clientId =
        (process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string) ||
        "BF-3fmX2O0lpikGoPpWj7TsT3qASjfrBl8a3jRHnwL6ZCccO8nVtyj8Jukn4rHpxnvM5nSn_gRfzKQ5eABldWbM";

      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1", // 以太坊主网
        // 使用环境变量中的RPC节点配置
        rpcTarget: process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL || "/ethereum-rpc",
        // 备选可靠节点
        // rpcTarget: "https://eth-mainnet.g.alchemy.com/v2/demo",
        // rpcTarget: "https://rpc.ankr.com/eth",
        displayName: "Ethereum Mainnet",
        blockExplorerUrl: "https://etherscan.io/",
        ticker: "ETH",
        tickerName: "Ethereum",
      };

      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig },
      });

      const web3AuthOptions: Web3AuthOptions = {
        clientId,
        web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
        privateKeyProvider,
      };

      this.web3AuthInstance = new Web3Auth(web3AuthOptions);

      // 初始化 SDK
      await this.web3AuthInstance.initModal();

      if (this.web3AuthInstance.connected) {
        this.provider = this.web3AuthInstance.provider;
      }

      this.initialized = true;
      return this.web3AuthInstance;
    } catch (error) {
      console.error("初始化 Web3Auth 时出错：", error);
      return null;
    }
  }

  public async login() {
    try {
      if (!this.web3AuthInstance) {
        await this.init();
      }

      if (!this.web3AuthInstance) {
        throw new Error("Web3Auth 未初始化");
      }

      this.provider = await this.web3AuthInstance.connect();
      return this.provider;
    } catch (error) {
      console.error("登录失败：", error);
      throw error;
    }
  }

  public async getUserInfo() {
    try {
      if (!this.web3AuthInstance) {
        throw new Error("Web3Auth 未初始化");
      }

      const user = await this.web3AuthInstance.getUserInfo();
      return user;
    } catch (error) {
      console.error("获取用户信息失败：", error);
      return null;
    }
  }

  public getProvider() {
    return this.provider;
  }

  public async logout() {
    try {
      if (!this.web3AuthInstance) {
        throw new Error("Web3Auth 未初始化");
      }

      await this.web3AuthInstance.logout();
      this.provider = null;
      return true;
    } catch (error) {
      console.error("登出失败：", error);
      return false;
    }
  }
}

export default Web3AuthService.getInstance();
