import { httpBatchLink } from '@trpc/client';
import { queryClient } from '../query';
import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../../../../server/src/router';

export const trpc = createTRPCReact<AppRouter>();

export default function TRPCProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const trpcClient = trpc.createClient({
    links: [
      httpBatchLink({
        url: import.meta.env.VITE_TRPC_SERVER_URL,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          });
        },
      }),
    ],
  });

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      {children}
    </trpc.Provider>
  );
}
