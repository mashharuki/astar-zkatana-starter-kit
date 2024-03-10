import { HardhatUserConfig } from "hardhat/config";

// PLUGINS
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";
import "hardhat-deploy";

// Process Env Variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const PK = process.env.PK;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  // hardhat-deploy
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
  // デフォルトのチェーンを指定する。
  defaultNetwork: "zKatana",

  networks: {
    hardhat: {
      forking: {
        url: `https://rpc.zkatana.gelato.digital`,
        blockNumber: 92,
      },
    },

    zKatana: {
      accounts: PK ? [PK] : [],
      chainId: 1261120,
      url: `https://rpc.zkatana.gelato.digital`,
    },
  },

  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
      {
        version: "0.8.18",
        settings: {
          optimizer: { enabled: true, runs: 200 },
        },
      },
    ],
  },

  typechain: {
    outDir: "typechain",
    target: "ethers-v5",
  },

  // hardhat-deploy
  verify: {
    etherscan: {
      apiKey: ETHERSCAN_API_KEY ? ETHERSCAN_API_KEY : "",
    },
  },
};

export default config;
