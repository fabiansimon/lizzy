import { inferAsyncReturnType, initTRPC, TRPCError } from '@trpc/server';
import { createContext } from './app';

type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();
const router = t.router;
const publicProcedure = t.procedure;
const mergeRouters = t.mergeRouters;

const protectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  if (!ctx.req.session.siwe?.address) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx });
});

export {
  Context,
  t,
  router,
  publicProcedure,
  protectedProcedure,
  mergeRouters,
};
