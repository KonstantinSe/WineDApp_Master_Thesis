// deploy/00_deploy_your_contract.js

const { ethers } = require("hardhat");

const localChainId = "31337";

// const sleep = (ms) =>
//   new Promise((r) =>
//     setTimeout(() => {
//       console.log(`waited for ${(ms / 1000).toFixed(3)} seconds`);
//       r();
//     }, ms)
//   );

module.exports = async ({ getNamedAccounts, deployments, getChainId }) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  await deploy("WineSupplyChain", {
    // Learn more about args here: https://www.npmjs.com/package/hardhat-deploy#deploymentsdeploy
    from: deployer,
    // args: [ "Hello", ethers.utils.parseEther("1.5") ],
    log: true,
    // waitConfirmations: 5,
  });

  // Getting a previously deployed contract
const WineSupplyChain = await ethers.getContract("WineSupplyChain", deployer);
  



// Hier Ethereum Adresse aus Wallet oben rechts eintragen


    await WineSupplyChain.transferOwnership(
      "0x4832980a9368422444C1fe1d2e62870BE911741F"
    );



  /*
  //If you want to send value to an address from the deployer
  const deployerWallet = ethers.provider.getSigner()
  await deployerWallet.sendTransaction({
    to: "0x34aA3F359A9D614239015126635CE7732c18fDF3",
    value: ethers.utils.parseEther("0.001")
  })
  */

  /*
  //If you want to send some ETH to a contract on deploy (make your constructor payable!)
  const WineSupplyChain = await deploy("WineSupplyChain", [], {
  value: ethers.utils.parseEther("0.05")
  });
  */

  /*
  //If you want to link a library into your contract:
  // reference: https://github.com/austintgriffith/scaffold-eth/blob/using-libraries-example/packages/hardhat/scripts/deploy.js#L19
  const WineSupplyChain = await deploy("WineSupplyChain", [], {}, {
   LibraryName: **LibraryAddress**
  });
  */

  // Verify from the command line by running `yarn verify`

  // You can also Verify your contracts with Etherscan here during the deployment process
  try {
    if (chainId !== localChainId) {
      // await run("verify:verify", {
      //   address: WineSupplyChain.address,
      //   contract: "contracts/WineSupplyChain.sol:WineSupplyChain",
      //   constructorArguments: [],
      // });
    }
  } catch (error) {
    console.error("Verification Error =>", error);
  }
};
module.exports.tags = ["WineSupplyChain"];
