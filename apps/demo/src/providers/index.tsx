import WagmiProvider from './wagmi';
import QueryProvider from './query';
import TRPCProvider from './trpc';
import UserProvider from './user';

export default function RootProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <WagmiProvider>
        <QueryProvider>
          <TRPCProvider>
            <UserProvider>{children}</UserProvider>
          </TRPCProvider>
        </QueryProvider>
      </WagmiProvider>
    </div>
  );
}
