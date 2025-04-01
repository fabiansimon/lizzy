import express from 'express';
import cors from 'cors';
import * as trpcExpress from '@trpc/server/adapters/express';
import { ironSession } from 'iron-session/express';
import appRouter from './router';
import apiRoutes from './api/routes';

const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({ req, res });

const app = express();

app.use(express.json());
app.use(
  cors({
    credentials: true,
    // Modify this to whitelist certain requests
    origin: (origin, callback) => {
      callback(null, true);
    },
  })
);
app.use(
  ironSession({
    cookieName: 'siwe',
    // Has to be 32 characters
    password:
      process.env.IRON_SESSION_PASSWORD || 'UNKNOWN_IRON_SESSION_PASSWORD_32',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

/**
 * route for external API request
 */
app.use('/api/v1', apiRoutes);

/**
 * Support for a dedicated tRPC route
 */
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

export default app;
export { createContext };
