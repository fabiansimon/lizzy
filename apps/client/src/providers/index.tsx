import WagmiProvider from './wagmi';
import QueryProvider from './query';
import TRPCProvider from './trpc';

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <WagmiProvider>
        <QueryProvider>
          <TRPCProvider>{children}</TRPCProvider>
        </QueryProvider>
      </WagmiProvider>
    </div>
  );
}
