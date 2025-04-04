import { WagmiConfig, configureChains, createClient } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains([sepolia], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
});

export default function WagmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WagmiConfig client={client}>{children}</WagmiConfig>;
}
