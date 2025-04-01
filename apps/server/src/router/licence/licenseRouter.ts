// licensesRouter.ts
import { TRPCError } from '@trpc/server';
import { protectedProcedure, router } from '../../trpc';
import * as RegistryService from './licenseService';
import { License } from './licenseTypes';
import { z } from 'zod';

const fetchAll = protectedProcedure
  .output(z.array(License))
  .query(async ({ ctx }) => {
    try {
      const licenses = await RegistryService.fetchAllLicenses();
      return licenses;
    } catch (error) {
      console.error('❌ License fetch error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch all licenses',
      });
    }
  });

export const licensesRouter = router({
  fetchAll,
});
