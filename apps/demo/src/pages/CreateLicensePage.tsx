import type React from 'react';
import { useMemo, useState } from 'react';
import { useUser } from '../providers/user';
import { useToast } from '../components/ui/use-toast';
import { ethers } from 'ethers';
import { lizzyABI } from '../../../contracts/lizzyRegistry/lizzyABI.js';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { HelpCircle, FileText, Link, DollarSign, Clock } from 'lucide-react';
import { Label } from '../components/ui/label';
import { useNavigate, Navigate } from 'react-router-dom';
import { parseContractError } from '../lib/utils';

const INIT_FORM = {
  title: '',
  metaURI: '',
  price: '',
  duration: '',
};

export default function CreateLicensePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<typeof INIT_FORM>(INIT_FORM);

  const navigate = useNavigate();
  const { user } = useUser();
  const { toast } = useToast();

  const validateForm = useMemo(() => {
    return formData.title.trim() && formData.price.trim();
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user.isSignedIn || user.role !== 'vendor') {
      toast({
        title: 'Error',
        description: 'You must be signed in as a vendor to create a license',
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
      const { title, metaURI, price, duration } = formData;
      setIsLoading(true);
      // Convert price to Wei (assuming price is in ETH)
      const priceInWei = ethers.utils.parseEther(price);
      // Convert duration to seconds (assuming duration is in days)
      const durationInSeconds = duration
        ? Number.parseInt(duration) * 24 * 60 * 60
        : 0;
      // Create contract instance
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        import.meta.env.VITE_LIZZY_REGISTRY_CONTRACT_ADDRESS,
        lizzyABI,
        signer
      );

      // Create license
      const tx = await contract.createLicense(
        formData.title.trim(),
        formData.metaURI.trim(),
        priceInWei,
        durationInSeconds
      );
      await tx.wait();

      toast({
        title: 'Success',
        description: 'License created successfully!',
      });

      navigate('/vendor-licenses');
      setFormData(INIT_FORM);
    } catch (error) {
      const errorMessage = parseContractError(error);
      console.error(error);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData(INIT_FORM);
  };

  if (!user.isSignedIn || user.role !== 'vendor') {
    return <Navigate to="/shop" />;
  }

  return (
    <div className="container mx-auto py-8 px-4 -mt-20">
      <Card className="max-w-2xl mx-auto bg-slate-950/20 border-slate-800 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Create New License</CardTitle>
          <CardDescription className="text-slate-400">
            Fill out the form below to create a new blockchain license
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-400" />
                <Label htmlFor="title">License Title</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80">
                        The name of your license that will be displayed to users
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Premium Software License"
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4 text-slate-400" />
                <Label htmlFor="metaURI">Metadata URI</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-80">
                        A link to the metadata for this license (IPFS, HTTP,
                        etc.)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id="metaURI"
                name="metaURI"
                value={formData.metaURI}
                onChange={handleChange}
                placeholder="ipfs://... or https://..."
                required
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="price">Price (ETH)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>The cost in ETH to purchase this license</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.000000000000000001"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0.05"
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <Label htmlFor="duration">Duration (days)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>How long the license will be valid after purchase</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="365"
                  required
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-end">
          <Button
            variant="outline"
            disabled={isLoading}
            onClick={handleReset}
            className="bg-transparent"
          >
            {'Reset'}
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading || !validateForm}
          >
            {isLoading ? 'Creating...' : 'Create License'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
