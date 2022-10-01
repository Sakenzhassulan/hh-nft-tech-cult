//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MountainNFT is ERC721URIStorage, Ownable {
    string internal s_tokenUri;
    uint256 public s_tokenCounter;

    event NftMinted(uint256 indexed tokenId, address indexed owner);

    constructor(string memory _tokenUri) ERC721("Mountain IPFS NFT", "MIN") {
        s_tokenUri = _tokenUri;
    }

    function mintNFT() public {
        _safeMint(msg.sender, s_tokenCounter);
        _setTokenURI(s_tokenCounter, s_tokenUri);
        emit NftMinted(s_tokenCounter, msg.sender);
        s_tokenCounter = s_tokenCounter + 1;
    }

    function getDogTokenUri() public view returns (string memory) {
        return s_tokenUri;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}
