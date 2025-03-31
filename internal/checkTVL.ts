import fs from "node:fs";
import path from "node:path";
import { BlockFrostAPI } from "@blockfrost/blockfrost-js";
import * as SDK from "@minswap/sdk";
import { dump, load } from "js-yaml";

import type { TokenMetadata } from "../src/types";

const MINIMUM_TVL = 1000_000000n; // 1000 ADA
const LIMIT_PAGINATION = 100;
const __dirname = import.meta.dirname;
const TOKEN_DIR = path.join(__dirname, "../src/tokens");

const WHITELIST_POLICIES = new Set([
  "8db269c3ec630e06ae29f74bc39edd1f87c819f1056206e879a1cd61", // DJED
  "f66d78b4a3cb3d37afa0ec36461e51ecbde00f26c8f0a68f94b69880", // Indigo
  "25c5de5f5b286073c593edfd77b48abc7a48e5a4f3d4cd9d428ff935", // USDC
  "c48cbb3d5e57ed56e276bc45f99ab39abe94e6cd7ac39fb402da47ad", // USDM
  "92776616f1f32c65a173392e4410a3d8c39dcf6ef768c73af164779c", // MyUSD
  "fe7c786ab321f41c654ef6c1af7b3250a613c24e4213e0425a7ae456", // USDA
  "af65a4734e8a22f43128913567566d2dde30d3b3298306d6317570f6", // Minswap Intern
  "c0ee29a85b13209423b10447d3c2e6a50641a15c57770e27cb9d5073", // WingRiders
  "e52964af4fffdb54504859875b1827b60ba679074996156461143dc1", // Optim
  "ececc92aeaaac1f5b665f567b01baec8bc2771804b4c21716a87a4e3", // Splash
  "f6099832f9563e4cf59602b3351c3c5a8a7dda2d44575ef69b82cf8d", // OADA
  "25c5de5f5b286073c593edfd77b48abc7a48e5a4f3d4cd9d428ff935", // WanChain
]);

const blockfrostAPI = new BlockFrostAPI({
  projectId: process.env["BLOCKFROST_PROJECT_ID"],
  network: "mainnet",
});

const blockfrostAdapter = new SDK.BlockfrostAdapter({
  networkId: SDK.NetworkId.MAINNET,
  blockFrost: blockfrostAPI,
});

async function verifyTVL() {
  const [v1Pools, { pools: v2Pools }] = await Promise.all([getAllV1Pools(), blockfrostAdapter.getAllV2Pools()]);

  fs.readdir(TOKEN_DIR, async (error, files) => {
    if (error) {
      throw error;
    }
    for (const file of files) {
      const filePath = path.join(TOKEN_DIR, file);
      const tokenData = <TokenMetadata>load(fs.readFileSync(filePath, "utf8"));
      const tokenId = file.split(".")[0];
      const newVerified = await checkTVL(v1Pools, v2Pools, tokenId);
      if (newVerified === tokenData.verified) {
        continue;
      }
      console.log(
        `TVL check failed, changing ${file} verification information from ${tokenData.verified} to ${newVerified}...`,
      );
      const tokenInfo = {
        ...tokenData,
        verified: newVerified,
      };

      let yamlString = "";
      for (const [key, value] of Object.entries(tokenInfo)) {
        yamlString += `${dump({ [key]: value }, { lineWidth: -1 })}\n`;
      }
      fs.writeFileSync(filePath, yamlString, "utf8");
    }
  });
}

async function checkTVL(v1Pools: SDK.PoolV1.State[], v2Pools: SDK.PoolV2.State[], tokenId: string): Promise<boolean> {
  if (WHITELIST_POLICIES.has(tokenId.substring(0, 56))) {
    return true;
  }

  let maxTVL = 0n;

  const poolV1 = v1Pools.find((pool) => pool.assetA === SDK.Asset.toString(SDK.ADA) && pool.assetB === tokenId);

  maxTVL = (poolV1?.reserveA ?? 0n) * 2n;

  const poolV2 = v2Pools.find((pool) => pool.assetA === SDK.Asset.toString(SDK.ADA) && pool.assetB === tokenId);

  const tvlV2 = (poolV2?.reserveA ?? 0n) * 2n;
  if (maxTVL < tvlV2) {
    maxTVL = tvlV2;
  }

  return maxTVL >= MINIMUM_TVL;
}

async function getAllV1Pools() {
  const v1Pools: SDK.PoolV1.State[] = [];

  let page = 1;
  while (true) {
    console.log(`Fetching V1 Pools on page: ${page}...`);
    const paginatedPools = await blockfrostAdapter.getV1Pools({
      page,
      count: LIMIT_PAGINATION,
    });
    if (paginatedPools.length === 0) {
      break;
    }
    v1Pools.push(...paginatedPools);
    page++;
  }
  return v1Pools;
}

verifyTVL();
