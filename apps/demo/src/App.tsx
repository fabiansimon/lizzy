'use client';

import { useEffect, useState } from 'react';
import { useUser } from './providers/user';
import { ChevronRight, Info, Play } from 'lucide-react';

export default function App() {
  return (
    <main className="min-h-screen w-full bg-black text-white">
      <Home />
    </main>
  );
}

function Home() {
  const [licenseStatus, setLicenseStatus] = useState<{
    valid: boolean;
    reason: string | null;
  } | null>(null);
  const { user, signIn } = useUser();
  const [showContent, setShowContent] = useState(false);

  const requestVerification = async () => {
    if (!user?.address) return;

    try {
      const res = await fetch(
        `http://localhost:5001/api/v1/license/validity?wallet=${user?.address}&deviceId=device123&licenseId=6`,
        {
          method: 'GET',
        }
      );
      const data = await res.json();
      console.log('✅ Response: ', data);

      if (data.status === 'ok' && data.data.license.valid) {
        setLicenseStatus({
          valid: true,
          reason: null,
        });
        setShowContent(true);
      } else {
        setLicenseStatus({
          valid: false,
          reason: data.data.license.reason || 'License is invalid',
        });
      }
    } catch (error) {
      console.error('Error checking license:', error);
      setLicenseStatus({
        valid: false,
        reason: 'Error checking license',
      });
    }
  };

  useEffect(() => {
    if (user?.isSignedIn) {
      console.log('Requesting verification for: ', user.address);
      requestVerification();
    }
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Netflix Header */}
      <header className="flex items-center justify-between px-4 py-4 md:px-12 bg-gradient-to-b from-black to-transparent absolute w-full z-10">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="34"
            viewBox="0 0 1024 276.742"
            className="text-red-600 fill-current"
          >
            <path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 74.59 30.27-74.59h47.295z" />
          </svg>
        </div>
        {!user?.isSignedIn && (
          <button
            onClick={() => signIn('customer')}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-4 rounded"
          >
            Sign In
          </button>
        )}
      </header>

      {/* Hero Section */}
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80"></div>
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=1080&width=1920')] bg-cover bg-center"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 md:items-start md:px-16 text-center md:text-left">
          {!user?.isSignedIn ? (
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Unlimited movies, TV shows, and more
              </h1>
              <p className="text-xl md:text-2xl mb-6">
                Watch anywhere. Cancel anytime.
              </p>
              <p className="text-lg mb-6">
                Ready to watch? Sign in to continue.
              </p>
              <button
                onClick={() => signIn('customer')}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded flex items-center justify-center gap-2 mx-auto md:mx-0"
              >
                <span>Sign In Now</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="max-w-3xl">
              {licenseStatus === null ? (
                <div className="flex flex-col items-center justify-center h-32">
                  <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="mt-4">Verifying your license...</p>
                </div>
              ) : licenseStatus.valid ? (
                <div className="text-left">
                  <h1 className="text-5xl font-bold mb-4">Stranger Things</h1>
                  <p className="text-lg mb-6 max-w-xl">
                    When a young boy vanishes, a small town uncovers a mystery
                    involving secret experiments, terrifying supernatural forces
                    and one strange little girl.
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-white text-black hover:bg-gray-200 py-2 px-6 rounded flex items-center gap-2 font-bold">
                      <Play className="w-5 h-5" />
                      Play
                    </button>
                    <button className="bg-gray-600/70 hover:bg-gray-500/70 text-white py-2 px-6 rounded flex items-center gap-2 font-bold">
                      <Info className="w-5 h-5" />
                      More Info
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-black/80 p-6 rounded border border-gray-700 max-w-md">
                  <h2 className="text-2xl font-bold mb-4 text-red-600">
                    License Invalid
                  </h2>
                  <p className="mb-4">{licenseStatus.reason}</p>
                  <p className="text-gray-400 text-sm">
                    Please contact support to resolve this issue or try again
                    later.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content Section - Only shown when license is valid */}
      {showContent && (
        <div className="px-4 md:px-12 py-8 bg-black">
          <h2 className="text-xl font-bold mb-4">Popular on Netflix</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="relative rounded overflow-hidden group cursor-pointer"
              >
                <img
                  src={`/placeholder.svg?height=400&width=300`}
                  alt="Movie thumbnail"
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-2">
                    <h3 className="text-sm font-medium">Movie Title {item}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
