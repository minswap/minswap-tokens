import * as fs from "node:fs";
import path from "node:path";
import Ajv from "ajv";
import { load } from "js-yaml";

import { ASSET_ID_REGEX, TOKENS_DIR } from "../src/consts";
import { tokenSchema } from "../src/tokenSchema";
import type { TokenMetadata } from "../src/types";

const ajv = new Ajv();
const __dirname = import.meta.dirname;
const TOKEN_DIR = path.join(__dirname, `../src/${TOKENS_DIR}`);

async function validateTokenFiles() {
  fs.readdir(TOKEN_DIR, (error, files) => {
    if (error) {
      console.error(error);
      throw error;
    }
    for (const file of files) {
      const fileName = file.split(".")[0];
      if (!fileName.match(ASSET_ID_REGEX)) {
        throw new Error(`Invalid filename: ${fileName}`);
      }
      const filePath = path.join(TOKEN_DIR, file);
      const tokenFileData = fs.readFileSync(filePath, "utf-8");
      const tokenData: TokenMetadata = {
        tokenId: file.split(".")[0],
        ...(load(tokenFileData) as Omit<TokenMetadata, "tokenId">),
      };
      const validate = ajv.validate(tokenSchema, tokenData);
      if (!validate) {
        throw new Error(`Validating failed token file: ${file}`);
      }
    }
  });
}

validateTokenFiles();
