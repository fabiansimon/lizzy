import { Router } from 'express';
import healthRoutes from './routes/health';
import licenseCheckRoutes from './routes/licenseCheck';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/license', licenseCheckRoutes);

export default router;
