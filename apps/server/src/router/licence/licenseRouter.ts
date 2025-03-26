import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../../trpc';
import { CreateLicenseInput } from './licenseTypes';
import * as RegistryService from './licenseService';

const fetchAll = protectedProcedure.query(async ({ ctx }) => {
  try {
    const licenses = await RegistryService.fetchAllLicenses();
    return licenses;
  } catch (error) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Failed to fetch all licenses',
    });
  }
});

const create = protectedProcedure
  .input(CreateLicenseInput)
  .mutation(async ({ ctx, input }) => {
    try {
      const tx = await RegistryService.createLicense(input);
      return tx;
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to create license',
      });
    }
  });

export const licensesRouter = router({
  fetchAll,
  create,
});
