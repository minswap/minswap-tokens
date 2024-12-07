# 😽 Minswap Tokens

## Overview

This repository is a merge of now deprecated verified-tokens and market-cap repositories, it contains a list of tokens and exposes APIs for transparent access to circulating supply and total supply.

As of the latest update, we consider `circulating = maxSupply - treasury - burn` and `total = maxSupply - burn` as standard formulas for calculating marketcap information.

In cases where `circulatingOnChain` is provided directly according to the asset's quantity on-chain or through external APIs, the `circulating` is the value of `circulatingOnChain`.

For tokens providing `treasuryOnChain`, `total = maxSupply - treasuryOnChain` and `circulating = maxSupply - treasuryOnChain` formulas will be applied.

## How to add my token

### Requirements

As token verification prerequisites, ensure your token has:

- A pool with at least **1000 ADA TVL**,
- A post of your policy ID on Twitter (can also be in bio) or your policy ID displayed on your website's landing page,
- A logo added in the [Cardano Token Registry](https://github.com/cardano-foundation/cardano-token-registry) or CIP-68 metadata.

For tokens to be verified:

1. Create a transaction transfer **100 ADA** to Minswap wallet receiving token verification fee below. This fee appears as the cost for lifetime maintain this repository.
2. Transaction metadata includes: **the last 4 numbers of asset's policyId and asset's ticker** (for example, Verify 70c6 MIN).
3. Attach the transaction hash to a comment in the yaml file pull request (instructions below).

Why is there a one-time fee?
The one time fee is collected for maintaining the token verification repository and plays a crucial role in ensuring the repository remains a trusted and reliable resource for verifying tokens.
The fee also helps fund contributors, who carefully review and verify tokens, to ensure that only legitimate projects are verified, preventing scams and protecting users from malicious actors.

Minswap wallet receiving token verification fee: `addr1q85g6fkwzr2cf984qdmntqthl3yxnw4pst4mpgeyygdlnehqlcgwvr6c9vmajz96vnmmset3earqt5wl0keg0kw60eysdgwnej`

Any token that has been verified and does **not** meet the requirements in the future will be unverified.

### Creating a pull request

Create a pull request adding yaml file according to the following structure in the `src/tokens`:

```yaml
# 1 token = 1 yaml file
# filename/assetId: policyId + hex-coded token name

project: Minswap
# among DeFi, RealFi, GameFi, Meme, Bridge, Metaverse, Wallet, NFT, Oracle, AI, Launchpad, DAO, Stablecoin, Social, Media, Risk Ratings, Index Vaults, DePIN, Other
categories:
  - DeFi
  - DAO

decimals: 0
# not required, among website, twitter, discord, telegram, coinMarketCap, coinGecko, only endpoints with SSL (HTTPs) are approved
socialLinks:
  website: https://
  discord: ...

verified: true # default true, if a token violate verification policy then switch to false

# the following fields are not required
# for `big number`, it's a big number with no decimals. For example, if your token has a max supply of 50,000,000 tokens with 6 decimals, the value needs to be 50000000 × 10^6 = 50000000000000
# for `URIs`, currently only URI which returns a big number (no decimals) are supported
maxSupply: big number
# or
maxSupply: https://...

treasury:
  - big number
  - addr...
  - stake...
  - https://...
  - assetId

burn:
  - big number
  - addr...
  - stake...
  - https://...
  - assetId

circulatingOnChain:
  - big number
  - addr...
  - stake...
  - https://...
  - assetId

treasuryOnChain: addr...
```

Alternatively, create an issue with above information and our team will update accordingly. However, please note that the pull requests will be processed much faster.
Our team will verify and approve on first-in-first-out basis.

## Usage

```ts
import {
  BlockFrostAdapter,
  MarketCapAPI,
  TokenAPI,
} from "@minswap/minswap-tokens";

const MIN_TOKEN =
  "29d222ce763455e3d7a09a665ce554f00ac89d2e99a1a83d267170c64d494e";

// getting token info
const tokenApi = new TokenAPI();

const minTokenInfo = await tokenApi.getToken(MIN_TOKEN);

console.log(minTokenInfo);

// getting Market Cap info
const blockFrostAdapter = new BlockFrostAdapter({
  projectId: "<your_project_id_here>",
  requestTimeout: 20_000,
});

const marketCapApi = new MarketCapAPI(blockFrostAdapter);

const minMarketCapInfo = await marketCapApi.getMarketCapInfo(minTokenInfo);
console.log(minMarketCapInfo);
// { circulating: '240813714.66121483', total: '5000000000' }
```
