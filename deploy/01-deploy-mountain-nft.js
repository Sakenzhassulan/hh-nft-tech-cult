const { network, ethers } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages, storeTokenUriMetadata } = require("../utils/uploadToPinata")

const imagesLocation = "./images"

const metadataTemplate = {
    name: "",
    description: "",
    image: "",
    attributes: [
        {
            trait_type: "Mountain",
            value: 100,
        },
    ],
}

let tokenUri = "ipfs://QmWaShBADWnRvctsBZhpCXm2Dwa2nMMUrWHHeuPKdd6QtT"

module.exports = async function ({ getNamedAccounts, deployments }) {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUri = await handleTokenUri()
    }
    log("--------------------------------------------")
    const args = [tokenUri]
    const mountainNFT = await deploy("MountainNFT", {
        from: deployer,
        log: true,
        args: args,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log("--------------------------------------------")
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(mountainNFT.address, args)
    }
}

async function handleTokenUri() {
    const { responses: imageUploadResponses, files } = await storeImages(imagesLocation)
    for (imageUploadResponseIndex in imageUploadResponses) {
        let tokenUriMetadata = { ...metadataTemplate }
        tokenUriMetadata.name = files[imageUploadResponseIndex].replace(".png", "")
        tokenUriMetadata.description = `Description for ${tokenUriMetadata.name}!`
        tokenUriMetadata.image = `ipfs://${imageUploadResponses[imageUploadResponseIndex].IpfsHash}`
        console.log(`Uploading ${tokenUriMetadata.name}...`)
        // store the JSON to pinata
        const metadataUploadResponse = await storeTokenUriMetadata(tokenUriMetadata)
        tokenUri = `ipfs://${metadataUploadResponse.IpfsHash}`.toString()
    }
    console.log("Token URI Uploaded! It is:")
    console.log(tokenUri)
    return tokenUri
}

module.exports.tags = ["all", "mountainNft"]
