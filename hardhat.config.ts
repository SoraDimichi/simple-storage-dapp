import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-ethers";
import { config as dec } from "dotenv";

dec();
const { TRANSPORT, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${TRANSPORT}`,
      accounts: [`0x${PRIVATE_KEY}`],
    },
  },
};

export default config;
