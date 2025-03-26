interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  data?: string;
  timestamp: number;
  status: "pending" | "confirmed" | "failed";
  confirmations?: number;
  blockNumber?: number;
}

interface WalletConnection {
  address: string;
  chainId: number;
  isConnected: boolean;
  provider?: any;
  networkName: string;
  balance?: string;
}

interface ContractInteraction {
  contractAddress: string;
  method: string;
  params: any[];
  value?: string;
  gasLimit?: string;
  gasPrice?: string;
}

interface SBTMetadata {
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  courseId: number;
  completionDate: string;
  score?: number;
  issuer: string;
}
