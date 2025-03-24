import { mergeRouters, router } from '../trpc';
import { authRouter } from './auth/authRouter';
import { licensesRouter } from './licence/licenseRouter';

type AppRouter = typeof appRouter;

export const appRouter = router({
  auth: authRouter,
  license: licensesRouter,
});

export default appRouter;
export type { AppRouter };
