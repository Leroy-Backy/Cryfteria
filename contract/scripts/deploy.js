const hre = require("hardhat");

async function main() {
  const cryfteria = await hre.ethers.deployContract("Cryfteria");

  await cryfteria.waitForDeployment();

  console.log("Contract deployed  to: ", cryfteria);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
