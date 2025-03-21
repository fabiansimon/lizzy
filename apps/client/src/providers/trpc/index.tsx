import { httpBatchLink } from '@trpc/client';
import trpc from '../../lib/trpc';
import { queryClient } from '../query';

const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_TRPC_SERVER_URL}`,
      // Needed to support session cookies
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: 'include',
        });
      },
    }),
  ],
});

const TRPCProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      {children}
    </trpc.Provider>
  );
};

export default TRPCProvider;
