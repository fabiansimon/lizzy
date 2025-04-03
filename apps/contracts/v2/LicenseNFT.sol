// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract LicenseNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    address public registry;

    constructor(address initialOwner) ERC721("Lizzy License", "LZLIC") Ownable(initialOwner) {}

    modifier onlyRegistry() {
        require(msg.sender == registry, "Only registry can mint");
        _;
    }

    function setRegistry(address _registry) external onlyOwner {
        registry = _registry;
    }

    function mintLicense(
        address to,
        string memory title,
        address vendor,
        uint256 duration,
        uint256 issuedAt
    ) external onlyRegistry returns (uint256) {
        uint256 tokenId = nextTokenId++;

        string memory metadata = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name":"', title,
                        '","description":"Lizzy Software License",',
                        '"attributes":[{"trait_type":"Vendor","value":"', toAsciiString(vendor),
                        '"},{"trait_type":"Duration","value":"', Strings.toString(duration),
                        '"},{"trait_type":"IssuedAt","value":"', Strings.toString(issuedAt),
                        '"}]}'
                    )
                )
            )
        );

        string memory tokenURI = string(abi.encodePacked("data:application/json;base64,", metadata));
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        return tokenId;
    }

    function toAsciiString(address x) internal pure returns (string memory) {
        bytes memory s = new bytes(42);
        s[0] = '0';
        s[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            bytes1 b = bytes1(uint8(uint(uint160(x)) / (2 ** (8 * (19 - i)))));
            uint8 hi = uint8(b) / 16;
            uint8 lo = uint8(b) - 16 * hi;
            s[2 * i + 2] = char(hi);
            s[2 * i + 3] = char(lo);
        }
        return string(s);
    }

    function char(uint8 b) internal pure returns (bytes1 c) {
        return b < 10 ? bytes1(b + 48) : bytes1(b + 87);
    }
}

