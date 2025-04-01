import { env } from '../../env';
import { ethers } from 'ethers';
import { lizzyABI } from '../../../../contracts/lizzyRegistry/lizzyABI';
import { CreateLicenseInput } from './licenseTypes';

const provider = new ethers.providers.JsonRpcProvider(
  env.LIZZY_REGISTRY_CONTRACT_RPC_URL
);
const contract = new ethers.Contract(
  env.LIZZY_REGISTRY_CONTRACT_ADDRESS,
  lizzyABI,
  provider
);

export async function fetchAllLicenses() {
  const licenses = await contract.getLicenses();
  return licenses;
}

export async function createLicense({
  title,
  price,
  duration,
  metaURI,
}: CreateLicenseInput) {
  const tx = await contract.createLicense(title, price, duration, metaURI);
  return tx;
}
