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
