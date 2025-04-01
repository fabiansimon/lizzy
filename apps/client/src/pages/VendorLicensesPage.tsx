import { trpc } from '../providers/trpc';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '../components/ui/card';
import { AlertCircle, Search, Filter } from 'lucide-react';
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
import LicenseCard from '../components/ui/LicenseCard';
import { Button } from '../components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
export default function VendorLicensesPage() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');

  const navigate = useNavigate();

  const { data, isLoading } = trpc.license.fetchVendorLicenses.useQuery();

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

  return (
    <div className="mx-auto py-8 px-4 flex-col w-full flex flex-grow min-h-screen max-w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {'Your Licenses'}
        </h1>
        <p className="text-slate-400">{'View your licenses'}</p>
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
              key={license.id}
              license={license}
            >
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white w-full"
                disabled={license.revoked}
                onClick={() => navigate(`/manage-license/${license.id}`)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </LicenseCard>
          ))}
        </div>
      )}
    </div>
  );
}
