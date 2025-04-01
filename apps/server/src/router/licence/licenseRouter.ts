import { TRPCError } from '@trpc/server';
import { protectedProcedure, publicProcedure, router } from '../../trpc';
import * as RegistryService from './licenseService';
import { License } from './licenseTypes';
import { z } from 'zod';

const fetchAll = publicProcedure.output(z.array(License)).query(async () => {
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

const fetchUserLicenses = protectedProcedure
  .output(z.array(License))
  .query(async ({ ctx }) => {
    try {
      const licenses = await RegistryService.fetchUserLicenses(
        ctx.req.session.siwe?.address!
      );
      return licenses;
    } catch (error) {
      console.error('❌ License fetch error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch user licenses',
      });
    }
  });

const fetchVendorLicenses = protectedProcedure
  .output(z.array(License))
  .query(async ({ ctx }) => {
    try {
      const licenses = await RegistryService.fetchVendorLicenses(
        ctx.req.session.siwe?.address!
      );
      return licenses;
    } catch (error) {
      console.error('❌ License fetch error:', error);
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to fetch vendor licenses',
      });
    }
  });

export const licensesRouter = router({
  fetchAll,
  fetchUserLicenses,
  fetchVendorLicenses,
});
