# 😽 Minswap Tokens

## Overview

This repository is a merge of now deprecated verified-tokens and market-cap repositories, it contains a list of tokens and exposes NPM package for transparent access to circulating supply and total supply.

Each token is an YAML file in `src/tokens` and the file name is token currencySymbol + assetName. The file contains basic information about token like project name, categories, social links and information about max supply, treasury addresses and burn addresses. We calculate total supply and circulating supply using these formulas:

```
total = maxSupply - burn
circulating = maxSupply - burn - treasury
```

In special cases where you want to get circulating supply from API or you consider all minted tokens are circulating supply, you can use `circulatingOnChain` (example: Indigo, Butane).

## How to add my token

### Prerequisites

As token verification prerequisites, ensure your token has:

- A pool with at least **1000 ADA TVL**,
- A post of your policy ID on Twitter (can also be in bio) or your policy ID displayed on your website's landing page,
- A logo added in the [Cardano Token Registry](https://github.com/cardano-foundation/cardano-token-registry) or CIP-68 metadata.

### Process

#### Pay one-time verification fee

1. Create a transaction transfer **100 ADA** lifetime fee to Minswap address: `addr1q85g6fkwzr2cf984qdmntqthl3yxnw4pst4mpgeyygdlnehqlcgwvr6c9vmajz96vnmmset3earqt5wl0keg0kw60eysdgwnej`. If your token is minted from [Minswap Mint Token](https://minswap.org/launch-bowl/mint-token) service, you won't be charged fee.
2. Transaction metadata includes: **the last 4 characters of asset's policyId and asset's ticker** (for example, Verify 70c6 MIN).
3. Attach the transaction hash to the pull request.

_Why is there a one-time fee?_

The one time fee is collected for maintaining the token verification repository and plays a crucial role in ensuring the repository remains a trusted and reliable resource for verifying tokens.
The fee also helps fund contributors, who carefully review and verify tokens, to ensure that only legitimate projects are verified, preventing scams and protecting users from malicious actors.

Any token that has been verified and fail to meet the requirements in the future will be **unverified**.

#### Create a pull request

Create a pull request adding YAML file according to the following structure in the `src/tokens`:

```yaml
# 1 token = 1 yaml file
# assetId: policyId + hex-coded token name
# file name: assetId of the token that want to be verified
# all URL needs to be HTTPS

project: Minswap

# among: DeFi, RealFi, GameFi, Meme, Bridge, Metaverse, Wallet, NFT, Oracle, AI, Launchpad, DAO, Stablecoin, Social, Media, Risk Ratings, Index Vaults, DePIN, Other
categories:
  - DeFi
  - DAO

# needs to be the same as decimals in Cardano Token Registry or CIP-68
decimals: 0

# optional, among: website, twitter, discord, telegram, coinMarketCap, coinGecko
socialLinks:
  website: https://
  discord: ...

verified: true # default true, if a token violate verification policy then switch to false

# the following fields are not required
# for `number`, it's token number with no decimals. For example, if your token has a max supply of 50,000,000 tokens with 6 decimals, the value needs to be 50000000 × 10^6 = 50000000000000
# for URL, it must also return the token number without decimals
maxSupply: number
# or
maxSupply: https://...
# or
maxSupply: assetName

treasury:
  - number
  - addr...
  - stake...
  - https://...
  - assetId

burn:
  - number
  - addr...
  - stake...
  - https://...
  - assetId

circulatingOnChain:
  - number
  - addr...
  - stake...
  - https://...
  - assetId
```

Alternatively, create an issue with above information and our team will update accordingly. However, please note that the pull requests will be processed much faster.
Our team will verify and approve on a first-come-first-serve basis.

## Usage

- Option 1: Clone the repository, parse YAML files and use your favorite tools to query (eg. Ogmios, Kupo,...)
- Option 2: Use the NPM package:

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

## Suspicious Tokens
There are lots of fake tokens on Cardano, and sometimes it's too late for those tokens to be taken down from Cardano Token Registry. That's why Minswap Labs will add those tokens in here as soon as possible to prevent abuses.

We keep a list of suspecious tokens policy IDs in suspicious-tokens/tokens.txt file, one policy ID is one line.

Cardano applications and DEXes are free to use this list to warn or block users from interacting with suspicious tokens.