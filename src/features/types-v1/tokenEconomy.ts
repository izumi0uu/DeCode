// tokenEconomy.ts
interface TokenBalance {
  symbol: string;
  balance: string;
  decimals: number;
  address: string;
}

interface TokenTransaction {
  txHash: string;
  amount: string;
  type: "reward" | "spend" | "transfer";
  timestamp: number;
  reason: string;
  status: "pending" | "confirmed" | "failed";
}

interface RewardActivity {
  id: string;
  userId: string;
  activityType:
    | "course_completion"
    | "quiz_pass"
    | "code_contribution"
    | "community_help";
  tokenAmount: string;
  timestamp: number;
  sourceId: string; // 关联的课程/测验/贡献ID
}
