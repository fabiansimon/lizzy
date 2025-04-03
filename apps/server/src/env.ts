import z from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5001),
  IRON_SESSION_PASSWORD: z.string(),
  LIZZY_REGISTRY_CONTRACT_ADDRESS: z.string(),
  RPC_URL: z.string(),
  OWNER_WALLET_ADDRESS: z.string(),
});

const envSafeParse = envSchema.safeParse(process.env);
if (!envSafeParse.success) {
  console.error('Invalid environment variables:', envSafeParse.error);
  console.error('Please check your .env file. Shutting down.');
  process.exit(1);
}

export const env = envSchema.parse(process.env);

export type env = z.infer<typeof envSchema>;

console.log('\n┌─────────────────────────────┐');
console.log('│   ENVIRONMENT VARIABLES    │');
console.log('└─────────────────────────────┘\n');
for (const [key, value] of Object.entries(env)) {
  const safeValue = JSON.stringify(value);
  console.log(`\t${key}: ${safeValue}`);
}
console.log('\n');
