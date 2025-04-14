import type { JSONSchemaType } from "ajv";

import { ADDRESS_REGEX, ASSET_ID_REGEX, URL_REGEX } from "./consts";
import type { TokenMetadata } from "./types";

export const tokenSchema: JSONSchemaType<TokenMetadata> = {
  type: "object",
  properties: {
    tokenId: { type: "string" },
    project: { type: "string" },
    categories: {
      type: "array",
      items: {
        type: "string",
        enum: [
          "DeFi",
          "RealFi",
          "GameFi",
          "Meme",
          "Bridge",
          "Metaverse",
          "Wallet",
          "NFT",
          "Oracle",
          "AI",
          "Launchpad",
          "DAO",
          "Stablecoin",
          "Social",
          "Media",
          "Risk Ratings",
          "Index Vaults",
          "DePIN",
          "RWA",
          "Other",
        ],
      },
      minItems: 1,
      uniqueItems: true,
    },
    decimals: { type: "number" },
    socialLinks: {
      type: "object",
      properties: {
        website: { type: "string", nullable: true, pattern: URL_REGEX },
        twitter: { type: "string", nullable: true, pattern: URL_REGEX },
        discord: { type: "string", nullable: true, pattern: URL_REGEX },
        telegram: { type: "string", nullable: true, pattern: URL_REGEX },
        coinMarketCap: { type: "string", nullable: true, pattern: URL_REGEX },
        coinGecko: { type: "string", nullable: true, pattern: URL_REGEX },
      },
      nullable: true,
      additionalProperties: false,
    },
    verified: { type: "boolean", default: true },
    maxSupply: {
      type: ["number", "string"],
      items: {
        type: ["string", "number"],
      },
      nullable: true,
    },
    treasury: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "string",
            pattern: ADDRESS_REGEX,
          },
          {
            type: "string",
            pattern: URL_REGEX,
          },
          {
            type: "string",
            pattern: ASSET_ID_REGEX,
          },
          {
            type: "number",
          },
        ],
      },
      nullable: true,
    },
    burn: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "string",
            pattern: ADDRESS_REGEX,
          },
          {
            type: "string",
            pattern: URL_REGEX,
          },
          {
            type: "string",
            pattern: ASSET_ID_REGEX,
          },
          {
            type: "number",
          },
        ],
      },
      nullable: true,
    },
    circulatingOnChain: {
      type: "array",
      items: {
        oneOf: [
          {
            type: "string",
            pattern: ADDRESS_REGEX,
          },
          {
            type: "string",
            pattern: URL_REGEX,
          },
          {
            type: "string",
            pattern: ASSET_ID_REGEX,
          },
          {
            type: "number",
          },
        ],
      },
      nullable: true,
    },
    treasuryOnChain: {
      type: "string",
      nullable: true,
    },
  },
  additionalProperties: false,
  required: ["tokenId", "project", "categories", "decimals", "verified"],
};
