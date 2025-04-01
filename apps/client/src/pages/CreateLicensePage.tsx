'use client';

import type React from 'react';

import { useState } from 'react';
import { useUser } from '../providers/user';
import { useToast } from '../components/ui/use-toast';
import { ethers } from 'ethers';
import { lizzyABI } from '../../../contracts/lizzyRegistry/lizzyABI';
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
import {
  AlertCircle,
  HelpCircle,
  FileText,
  Link,
  DollarSign,
  Clock,
} from 'lucide-react';
import { Label } from '../components/ui/label';

const INIT_FORM = {
  title: '',
  metaURI: '',
  price: '',
  duration: '',
};

export default function CreateLicensePage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<typeof INIT_FORM>(INIT_FORM);

  const { user } = useUser();
  const { toast } = useToast();

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

    try {
      setIsLoading(true);
      // Convert price to Wei (assuming price is in ETH)
      const priceInWei = ethers.utils.parseEther(formData.price);
      // Convert duration to seconds (assuming duration is in days)
      const durationInSeconds =
        Number.parseInt(formData.duration) * 24 * 60 * 60;

      // Create contract instance
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_LIZZY_REGISTRY_CONTRACT_ADDRESS || '',
        lizzyABI,
        signer
      );

      // Create license
      const tx = await contract.createLicense(
        formData.title,
        formData.metaURI,
        priceInWei,
        durationInSeconds
      );
      await tx.wait();

      toast({
        title: 'Success',
        description: 'License created successfully!',
      });

      // Reset form
      setFormData({
        title: '',
        metaURI: '',
        price: '',
        duration: '',
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'Failed to create license. Please try again.',
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
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription className="text-slate-400">
              You need vendor privileges to create licenses
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertCircle className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto bg-slate-950/30 border-slate-800 text-white">
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
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create License'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
