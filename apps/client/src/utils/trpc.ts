import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../server/src/router';

const trpc = createTRPCReact<AppRouter>();

export default trpc;
