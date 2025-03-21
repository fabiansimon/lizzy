import AppSidebar from './components/sidebar/app-sidebar';
import { SidebarTrigger } from './components/ui/sidebar';
import { SidebarProvider } from './components/ui/sidebar';

export default function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex flex-grow h-screen w-full bg-slate-900">
        <SidebarTrigger />
        <div className="p-6">
          {/* <h1 className="text-2xl text-white font-medium mb-4 border-b border-zinc-800 pb-4">
            tRPC SIWE Monorepo
          </h1>

          {!is, { AppSidebar }Connected ? (
            <Button>Connect Wallet</Button>
          ) : (
            // <button
            //   onClick={() => connect()}
            //   className="h-10 mb-4 block rounded-full px-6 text-white bg-blue-600 hover:bg-blue-700 transition-colors ease-in-out duration-200"
            // >
            //   Connect Wallet
            // </button>
            <button
              onClick={() => disconnect()}
              className="h-10 mb-4 block rounded-full px-6 text-white bg-red-600 hover:bg-red-700 transition-colors ease-in-out duration-200"
            >
              Disconnect
            </button>
          )}

          {errorConnect || errorDisconnect ? (
            <code className="bg-zinc-800 text-white p-4 mb-10 block">
              {JSON.stringify(
                {
                  error:
                    errorConnect?.message ||
                    errorDisconnect?.message ||
                    'Unknown wallet error.',
                },
                null,
                ' '
              )}
            </code>
          ) : null}

          {isConnected ? (
            <div className="border-t border-zinc-800 pt-4">
              <label className="text-sm text-zinc-400 block mb-2">
                Wallet Connected
              </label>
              <code className="bg-zinc-800 text-white p-4 mb-10 block">
                {address}
              </code>

              <button
                onClick={signIn}
                className="h-10 mb-4 rounded-full px-6 text-white bg-blue-600 hover:bg-blue-700 transition-colors ease-in-out duration-200"
              >
                Sign-In With Ethereum
              </button>
              <label className="text-sm text-zinc-400 block mb-2">
                Message & Signature
              </label>
              <code className="bg-zinc-800 text-white p-4 mb-10 block">
                <pre>{JSON.stringify(state, null, ' ')}</pre>
              </code>

              <button
                onClick={getMe}
                className="h-10 mb-4 rounded-full px-6 text-white bg-blue-600 hover:bg-blue-700 transition-colors ease-in-out duration-200"
              >
                Retrive User Session Info
              </button>
              <label className="text-sm text-zinc-400 block mb-2">
                Session Information (/trpc/authMe)
              </label>
              <code className="bg-zinc-800 text-white p-4 mb-10 block">
                <pre>{JSON.stringify(state?.address ?? null, null, ' ')}</pre>
              </code>

              <button
                onClick={signOut}
                className="h-10 mb-4 rounded-full px-6 text-white bg-red-600 hover:bg-red-700 transition-colors ease-in-out duration-200"
              >
                Log Out
              </button>
              <label className="text-sm text-zinc-400 block mb-2">
                Log Out Result
              </label>
              <code className="bg-zinc-800 text-white p-4 block">
                <pre>
                  {JSON.stringify(
                    {
                      isSignedIn: state.isSignedIn ? true : false,
                    },
                    null,
                    ' '
                  )}
                </pre>
              </code>
            </div>
          ) : null} */}
        </div>
      </main>
    </SidebarProvider>
  );
}
