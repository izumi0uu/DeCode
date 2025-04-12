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

  // 添加新方法测试RPC节点
  private async testRpcNode(url: string): Promise<boolean> {
    try {
      const rpcTest = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: "1",
          method: "eth_blockNumber",
          params: [],
        }),
      });

      const response = await rpcTest.json();
      if (response.error) {
        console.error(`RPC节点 ${url} 测试失败:`, response.error);
        return false;
      }

      console.log(`RPC节点 ${url} 测试成功，当前区块:`, response.result);
      return true;
    } catch (error) {
      console.error(`测试RPC节点 ${url} 时出错:`, error);
      return false;
    }
  }

  // 添加新方法获取可用的RPC节点
  private async getWorkingRpcNode(): Promise<string> {
    // 常用的公共RPC节点列表
    const publicNodes = [
      process.env.NEXT_PUBLIC_ETHEREUM_RPC_URL ||
        "https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      "https://eth.llamarpc.com",
      "https://ethereum.publicnode.com",
      "https://1rpc.io/eth",
      "https://rpc.ankr.com/eth",
    ];

    // 测试每个节点，返回第一个可用的
    for (const node of publicNodes) {
      if (await this.testRpcNode(node)) {
        return node;
      }
    }

    // 如果所有节点都不可用，返回默认节点
    console.warn("所有RPC节点测试失败，使用默认节点");
    return publicNodes[0];
  }

  public async init() {
    if (this.initialized) {
      return this.web3AuthInstance;
    }

    try {
      const clientId =
        (process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID as string) ||
        "BF-3fmX2O0lpikGoPpWj7TsT3qASjfrBl8a3jRHnwL6ZCccO8nVtyj8Jukn4rHpxnvM5nSn_gRfzKQ5eABldWbM";

      // 获取可用的RPC节点
      const workingRpcUrl = await this.getWorkingRpcNode();
      console.log("使用RPC节点:", workingRpcUrl);

      const chainConfig = {
        chainNamespace: CHAIN_NAMESPACES.EIP155,
        chainId: "0x1", // 以太坊主网
        rpcTarget: workingRpcUrl,
        displayName: "Ethereum Mainnet",
        blockExplorerUrl: "https://etherscan.io/",
        ticker: "ETH",
        tickerName: "Ethereum",
      };

      // 去掉RPC节点验证部分，因为我们已经在getWorkingRpcNode中完成了验证

      const privateKeyProvider = new EthereumPrivateKeyProvider({
        config: { chainConfig },
      });

      // 获取网络配置，支持从环境变量中读取
      const networkConfig =
        process.env.NEXT_PUBLIC_WEB3AUTH_NETWORK || "sapphire_devnet";
      let web3AuthNetwork;

      switch (networkConfig) {
        case "sapphire_mainnet":
          web3AuthNetwork = WEB3AUTH_NETWORK.SAPPHIRE_MAINNET;
          break;
        case "mainnet":
          web3AuthNetwork = WEB3AUTH_NETWORK.MAINNET;
          break;
        default:
          web3AuthNetwork = WEB3AUTH_NETWORK.SAPPHIRE_DEVNET;
      }

      const web3AuthOptions: Web3AuthOptions = {
        clientId,
        web3AuthNetwork,
        privateKeyProvider,
      };

      this.web3AuthInstance = new Web3Auth(web3AuthOptions);

      // 如果有自定义API URL，直接设置Web3Auth的baseUrl
      if (process.env.NEXT_PUBLIC_WEB3AUTH_API_URL) {
        try {
          // @ts-ignore - 手动设置baseUrl来解决URL构造问题
          this.web3AuthInstance.settings = this.web3AuthInstance.settings || {};
          // @ts-ignore
          this.web3AuthInstance.settings.baseUrl =
            process.env.NEXT_PUBLIC_WEB3AUTH_API_URL;
          console.log(
            "设置Web3Auth API URL:",
            process.env.NEXT_PUBLIC_WEB3AUTH_API_URL,
          );
        } catch (error) {
          console.error("设置Web3Auth API URL时出错:", error);
        }
      }

      // 初始化 SDK
      try {
        await this.web3AuthInstance.initModal();

        if (this.web3AuthInstance.connected) {
          this.provider = this.web3AuthInstance.provider;
        }

        this.initialized = true;
        return this.web3AuthInstance;
      } catch (error) {
        console.error("初始化Web3Auth Modal时出错:", error);
        throw error;
      }
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

      try {
        console.log("尝试连接Web3Auth...");
        this.provider = await this.web3AuthInstance.connect();
        console.log("Web3Auth连接成功");
        return this.provider;
      } catch (error) {
        console.error("Web3Auth连接失败", error);
        throw error;
      }
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

      if (!this.provider) {
        console.warn("Provider未初始化，尝试先登录...");
        try {
          await this.login();
        } catch (error) {
          console.error("自动登录失败", error);
          return null;
        }
      }

      console.log("尝试获取用户信息...");
      const user = await this.web3AuthInstance.getUserInfo();
      console.log("成功获取用户信息", user);
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
