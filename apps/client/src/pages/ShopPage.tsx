import { trpc } from '../providers/trpc';
import user, { useUser } from '../providers/user';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from '../components/ui/card';
import { AlertCircle, Search, Filter, ShoppingCart } from 'lucide-react';
import { Input } from '../components/ui/input';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { Navigate, useNavigate } from 'react-router-dom';
import LicenseCard from '../components/ui/LicenseCard';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { ethers } from 'ethers';
import { lizzyABI } from '../../../contracts/lizzyRegistry/lizzyABI';

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [loadingID, setLoadingID] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useUser();
  const { data, isLoading } = trpc.license.fetchAll.useQuery();
  const {
    user: { role },
  } = useUser();

  const licenses = data ?? [];

  const filteredLicenses = licenses.filter(
    (license) =>
      license.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedLicenses = filteredLicenses.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime();
      case 'oldest':
        return new Date(a.issuedAt).getTime() - new Date(b.issuedAt).getTime();
      case 'price-low':
        return Number.parseFloat(a.price) - Number.parseFloat(b.price);
      case 'price-high':
        return Number.parseFloat(b.price) - Number.parseFloat(a.price);
      case 'duration':
        return b.duration - a.duration;
      default:
        return 0;
    }
  });

  const handlePurchase = async (licenseId: string, price: string) => {
    if (!user.isSignedIn || user.role !== 'customer') {
      toast({
        title: 'Error',
        description: 'You must be signed in to purchase a license.',
        variant: 'destructive',
      });
      return;
    }

    if (!window.ethereum) {
      toast({
        title: 'Wallet not found',
        description: 'Please install MetaMask or another Web3 wallet.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoadingID(licenseId);

      const priceInWei = ethers.utils.parseEther(price); // assuming price is in ETH
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        import.meta.env.VITE_LIZZY_REGISTRY_CONTRACT_ADDRESS,
        lizzyABI,
        signer
      );

      const tx = await contract.buyLicense(licenseId, {
        value: priceInWei, // send ETH with the transaction
      });
      await tx.wait();

      toast({
        title: 'Success',
        description: 'License purchased successfully!',
      });
      navigate(`/user-licenses`);
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to purchase license. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoadingID(null);
    }
  };

  if (role === 'vendor') {
    return <Navigate to="/vendor-licenses" />;
  }

  return (
    <div className="mx-auto py-8 px-4 flex-col w-full flex flex-grow min-h-screen max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {'Available Licenses'}
        </h1>
        <p className="text-slate-400">{'Browse and purchase licenses'}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search licenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
          />
        </div>
        <div className="w-full md:w-64">
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
              <SelectItem value="newest">{'Newest first'}</SelectItem>
              <SelectItem value="oldest">{'Oldest first'}</SelectItem>
              <SelectItem value="price-low">{'Price: Low to High'}</SelectItem>
              <SelectItem value="price-high">{'Price: High to Low'}</SelectItem>
              <SelectItem value="duration">{'Duration'}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="bg-slate-900 border-slate-800 text-white"
            >
              <CardHeader>
                <Skeleton className="h-6 w-3/4 bg-slate-800" />
                <Skeleton className="h-4 w-1/2 bg-slate-800 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full bg-slate-800" />
                  <Skeleton className="h-4 w-full bg-slate-800" />
                  <Skeleton className="h-4 w-3/4 bg-slate-800" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full bg-slate-800" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : sortedLicenses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-slate-800 p-6 mb-4">
            <AlertCircle className="h-10 w-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No Licenses Found
          </h3>
          <p className="text-slate-400 max-w-md">
            {searchTerm
              ? `No licenses match your search for "${searchTerm}"`
              : 'There are no licenses available at the moment. Please check back later.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedLicenses.map((license) => (
            <LicenseCard
              license={license}
              key={license.id}
            >
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() =>
                  handlePurchase(license.id.toString(), license.price)
                }
                disabled={loadingID === license.id.toString()}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Purchase License
              </Button>
            </LicenseCard>
          ))}
        </div>
      )}
    </div>
  );
}
