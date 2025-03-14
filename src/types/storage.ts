interface IPFSContent {
  cid: string;
  size: number;
  mimeType: string;
  filename: string;
  uploadedAt: string;
  pinStatus: "pinned" | "pinning" | "failed";
}

interface TheGraphQuery {
  entity: string;
  filters: Record<string, any>;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  first?: number;
  skip?: number;
}

interface TheGraphResponse<T> {
  data: T;
  error?: string;
}
