import { env } from '../../env';
import { ethers } from 'ethers';
import lizzyABI from '../../../../contracts/lizzyRegistry/lizzyABI.json';

const provider = new ethers.providers.JsonRpcProvider(env.RPC_URL);

const contract = new ethers.Contract(
  env.LIZZY_REGISTRY_CONTRACT_ADDRESS,
  lizzyABI,
  provider
);

export async function fetchAllLicenses() {
  const licenses = await contract.getCatalog();
  return licenses.map((license: any) => ({
    id: Number(license.id),
    title: license.title,
    vendor: license.vendor,
    metaURI: license.metaURI,
    price: ethers.utils.formatEther(license.price),
    issuedAt: new Date(Number(license.issuedAt) * 1000).toISOString(),
    duration: Number(license.duration),
    revoked: license.revoked,
  }));
}

export async function fetchUserLicenses(userAddress: string) {
  const rawLicenses = await contract.getUserLicenses(userAddress);

  const licenses = await Promise.all(
    rawLicenses.map(async (userLicense: any) => {
      const meta = await contract.catalog(userLicense.licenseId);

      return {
        id: Number(meta.id),
        title: meta.title,
        vendor: meta.vendor,
        metaURI: meta.metaURI,
        price: ethers.utils.formatEther(meta.price),
        issuedAt: new Date(Number(meta.issuedAt) * 1000).toISOString(),
        duration: Number(meta.duration),
        revoked: meta.revoked,
      };
    })
  );

  return licenses;
}
