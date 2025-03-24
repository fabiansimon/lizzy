import { protectedProcedure, router } from '../../trpc';

const fetchAll = protectedProcedure.query(async ({ ctx }) => {
  return 'Hello World';
});

export const licensesRouter = router({
  fetchAll,
});
