import hre from "hardhat";

async function main() {
  await hre.run("compile");

  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");

  const simpleStorage = await SimpleStorage.deploy();

  console.log("SimpleStorage deployed to:", simpleStorage.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
