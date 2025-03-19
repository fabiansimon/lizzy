import { mergeRouters } from '../trpc';
import AuthRouter from './auth';

type AppRouter = typeof appRouter;

const appRouter = mergeRouters(AuthRouter);

export default appRouter;
export { AppRouter };
