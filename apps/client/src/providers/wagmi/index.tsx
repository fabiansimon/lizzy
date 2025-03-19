import { createClient, WagmiConfig } from 'wagmi';
import { getDefaultProvider } from 'ethers';

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
});

export default function WagmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}
