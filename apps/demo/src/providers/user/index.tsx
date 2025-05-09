import { createContext, useContext, useEffect, useState } from 'react';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { SiweMessage } from 'siwe';

import {
  useSignMessage,
  useNetwork,
  useAccount,
  useConnect,
  useDisconnect,
} from 'wagmi';
import { trpc } from '../trpc';

type User = {
  isLoading?: boolean;
  isSignedIn?: boolean;
  nonce?: {
    expirationTime?: string;
    issuedAt?: string;
    nonce?: string;
  };
  address?: string;
  role?: 'vendor' | 'customer' | 'admin';
  error?: Error | string;
};

type UserContextType = {
  user: User;
  signIn: (role: 'vendor' | 'customer') => void;
  signOut: () => void;
  fetch: () => void;
};

const UserContext = createContext<UserContextType | null>(null);

export default function UserProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<User>({});

  const { address, isConnected } = useAccount();
  const { connectAsync, error: errorConnect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect, error: errorDisconnect } = useDisconnect();
  const { chain } = useNetwork();
  const { signMessageAsync } = useSignMessage();

  const authNonce = trpc.auth.nonce.useQuery(undefined, {
    enabled: false,
  });
  const authMe = trpc.auth.me.useQuery(undefined, {
    enabled: false,
  });
  const authLogout = trpc.auth.logout.useQuery(undefined, {
    enabled: false,
  });
  const authVerify = trpc.auth.verify.useMutation();

  const signIn = async (role: 'vendor' | 'customer') => {
    try {
      if (!isConnected) {
        await connectAsync();
      }
      const chainId = chain?.id;
      const nonce = await authNonce.refetch();
      if (!address || !chainId) return;
      setState((prev) => ({
        ...prev,
        nonce: nonce?.data,
        isLoading: true,
        address,
        role,
      }));

      // Create SIWE message with pre-fetched nonce and sign with wallet
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: window.location.origin,
        version: '1',
        chainId,
        expirationTime: nonce?.data?.expirationTime,
        issuedAt: nonce?.data?.issuedAt,
        nonce: nonce?.data?.nonce,
      });

      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      const res = await authVerify.mutateAsync({
        message,
        signature,
      });

      if (res?.isAdmin) {
        setState((x) => ({ ...x, role: 'admin' }));
      }
    } catch (error) {
      console.log(error);
      setState((x) => ({
        ...x,
        isLoading: false,
        nonce: undefined,
        error: error as Error,
      }));
    }
  };

  const signOut = async () => {
    await authLogout.refetch();
    setState((x) => ({ ...x, address: undefined, isSignedIn: false }));
  };

  const fetch = async () => {
    const address = await authMe.refetch();
    setState((x) => ({ ...x, address: address.data?.address }));
  };

  useEffect(() => {
    if (!isConnected || !authVerify.data) return;

    if (authVerify?.data?.ok) {
      setState((x) => ({ ...x, isSignedIn: true, isLoading: false }));
    } else {
      setState((x) => ({
        ...x,
        isSignedIn: false,
        isLoading: false,
        error: 'error' in authVerify.data ? authVerify.data.error : undefined,
      }));
    }
  }, [isConnected, authVerify?.data]);

  const value = {
    user: state,
    signIn,
    signOut,
    fetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
