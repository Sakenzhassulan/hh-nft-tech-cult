const { network, ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deployer } = await getNamedAccounts()

    // Random IPFS NFT
    const mountainNft = await ethers.getContract("MountainNFT", deployer)
    const mountainIpfsNftMintTx = await mountainNft.mintNFT()
    await mountainIpfsNftMintTx.wait(1)
    console.log(`Mountain IPFS NFT index 0 tokenURI: ${await mountainNft.tokenURI(0)}`)
}
module.exports.tags = ["all", "mint"]
