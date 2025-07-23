export type FetcherOptions = {
  /**
   * Fetch timeout in milliseconds. Default to 20 seconds.
   */
  timeout?: number;
};

export type Category =
  | "DeFi"
  | "RealFi"
  | "GameFi"
  | "Meme"
  | "Bridge"
  | "Metaverse"
  | "Wallet"
  | "NFT"
  | "Oracle"
  | "AI"
  | "Launchpad"
  | "DAO"
  | "Stablecoin"
  | "Social"
  | "Media"
  | "Risk Ratings"
  | "Index Vaults"
  | "DePIN"
  | "RWA"
  | "Other";

export type TokenMetadata = {
  tokenId: string;
  project: string;
  categories: Category[];
  socialLinks?: {
    website?: string;
    twitter?: string;
    discord?: string;
    telegram?: string;
    coinMarketCap?: string;
    coinGecko?: string;
  };
  verified: boolean;
  decimals: number;
  maxSupply?: number | string | (number | string)[];
  treasury?: (string | number)[];
  burn?: (string | number)[];
  circulatingOnChain?: (string | number)[];
  treasuryOnChain?: string;
};

export type GetTokenOptions = {
  verifiedOnly?: boolean;
  hasMarketCapOnly?: boolean;
};

export type MarketCapInfoResponse = {
  total?: string | null;
  circulating?: string | null;
};
