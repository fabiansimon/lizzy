import 'dotenv/config';
import {
  JsonRpcProvider,
  Wallet,
  Contract,
  formatEther,
  parseEther,
} from 'ethers';
import abi from './lizzyABI.json' assert { type: 'json' };

const provider = new JsonRpcProvider(process.env.RPC_URL);
const signer = new Wallet(process.env.PRIVATE_KEY, provider);
const contract = new Contract(
  process.env.LIZZY_REGISTRY_CONTRACT_ADDRESS,
  abi,
  signer
);

async function main() {
  const userAddress = await signer.getAddress();
  console.log('📡 Using account:', userAddress);

  console.log('🎫 Creating license...');
  const createTx = await contract.createLicense(
    'Test License',
    'https://example.com/license-meta.json',
    parseEther('0.01'),
    60 * 60 * 24 * 30
  );
  await createTx.wait();
  console.log('✅ License created.');

  const licenseId = (await contract.licenseCounter()) - 1n;

  console.log('💸 Buying license...');
  const buyTx = await contract.buyLicense(licenseId, {
    value: parseEther('0.01'),
  });
  await buyTx.wait();
  console.log('✅ License purchased.');

  const hasValid = await contract.hasValidLicense(userAddress, licenseId);
  console.log(`🔍 Has valid license: ${hasValid}`);

  console.log('🚫 Revoking license...');
  const revokeTx = await contract.revokeLicense(userAddress, licenseId);
  await revokeTx.wait();
  console.log('✅ License revoked.');

  const catalog = await contract.getCatalog();
  console.log('📋 Catalog:');
  catalog.forEach((l) => {
    console.log({
      id: Number(l.id),
      title: l.title,
      price: formatEther(l.price),
      vendor: l.vendor,
    });
  });

  const userLicenses = await contract.getUserLicenses(userAddress);
  console.log('📦 User Licenses:');
  userLicenses.forEach((ul) => {
    console.log({
      licenseId: Number(ul.licenseId),
      issuedAt: new Date(Number(ul.issuedAt) * 1000).toISOString(),
      expiresAt:
        ul.expiresAt > 0n
          ? new Date(Number(ul.expiresAt) * 1000).toISOString()
          : 'never',
      revoked: ul.revoked,
    });
  });
}

main().catch((err) => {
  console.error('❌ Error:', err);
  process.exit(1);
});
