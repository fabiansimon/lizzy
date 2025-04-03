// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ILicenseNFT {
    function mintLicense(
        address to,
        string memory title,
        address vendor,
        uint256 duration,
        uint256 issuedAt
    ) external returns (uint256);
}

contract LizzyRegistry {
    address public owner;
    uint256 public licenseCounter = 0; 
    ILicenseNFT public licenseNFT;

    struct LicenseMeta {
        uint256 id;
        address vendor;
        string title;
        string metaURI;
        uint256 price;
        uint256 issuedAt; 
        uint256 duration;
        bool revoked;
    }

    struct UserLicense {
        uint256 licenseId;
        uint256 issuedAt; 
        uint256 expiresAt;
        bool revoked;
    }

    mapping(uint256 => LicenseMeta) public catalog;
    mapping(address => mapping(uint256 => UserLicense)) public licensesByUser;

    event LicenseUploaded(uint256 indexed id, address indexed vendor);
    event LicensePurchased(uint256 indexed id, address indexed buyer);
    event LicenseRevoked(address indexed user, uint256 indexed licenseId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    function setLicenseNFT(address _nft) external onlyOwner {
        licenseNFT = ILicenseNFT(_nft);
    }

    function createLicense(
        string memory title,
        string memory metaURI,
        uint256 price,
        uint256 duration
    ) external {
        catalog[licenseCounter] = LicenseMeta({
            id: licenseCounter,
            vendor: msg.sender,
            title: title,
            metaURI: metaURI,
            price: price,
            duration: duration,
            issuedAt: block.timestamp,
            revoked: false
        });

        emit LicenseUploaded(licenseCounter, msg.sender);
        licenseCounter++;
    }

    function buyLicense(uint256 licenseId) external payable {
        LicenseMeta storage meta = catalog[licenseId];
        require(!meta.revoked, "License is revoked.");
        require(msg.value >= meta.price, "Insufficient funds.");

        UserLicense storage existing = licensesByUser[msg.sender][licenseId];
        require(existing.issuedAt == 0, "License already owned.");

        uint256 issuedAt = block.timestamp;
        uint256 expiresAt = meta.duration > 0 ? issuedAt + meta.duration : 0;

        licensesByUser[msg.sender][licenseId] = UserLicense({
            licenseId: licenseId,
            issuedAt: issuedAt,
            expiresAt: expiresAt,
            revoked: false
        });

        // Mint NFT through external LicenseNFT contract
        licenseNFT.mintLicense(
            msg.sender,
            meta.title,
            meta.vendor,
            meta.duration,
            issuedAt
        );

        // Transfer payment to vendor
        payable(meta.vendor).transfer(meta.price);

        // Refund extra if any
        uint256 refund = msg.value - meta.price;
        if (refund > 0) {
            payable(msg.sender).transfer(refund);
        }

        emit LicensePurchased(licenseId, msg.sender);
    }

    function hasValidLicense(address user, uint256 licenseId) external view returns (bool) {
        LicenseMeta storage licenseMeta = catalog[licenseId];
        require(licenseMeta.issuedAt != 0, "License not found.");

        UserLicense storage userLicense = licensesByUser[user][licenseId];

        if (userLicense.issuedAt == 0) return false;
        if (userLicense.revoked) return false;
        if (userLicense.expiresAt != 0 && block.timestamp > userLicense.expiresAt) return false;

        return true;
    }

    function getUserLicenses(address user) external view returns (UserLicense[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < licenseCounter; i++) {
            if (licensesByUser[user][i].issuedAt != 0) {
                count++;
            }
        }

        UserLicense[] memory userLicenses = new UserLicense[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < licenseCounter; i++) {
            if (licensesByUser[user][i].issuedAt != 0) {
                userLicenses[index] = licensesByUser[user][i];
                index++;
            }
        }

        return userLicenses;
    }

    function revokeLicense(address user, uint256 licenseId) external onlyOwner {
        UserLicense storage license = licensesByUser[user][licenseId];
        require(license.issuedAt != 0, "License not found.");
        require(!license.revoked, "Already revoked.");
        license.revoked = true;

        emit LicenseRevoked(user, licenseId);
    }

    function getCatalog() external view returns (LicenseMeta[] memory) {
        LicenseMeta[] memory licenses = new LicenseMeta[](licenseCounter);
        for (uint256 i = 0; i < licenseCounter; i++) {
            licenses[i] = catalog[i];
        }

        return licenses;
    }
}

