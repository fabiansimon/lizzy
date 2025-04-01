import { Router } from 'express';
import healthRoutes from './health';
import licenseCheckRoutes from './licenseCheck';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/license', licenseCheckRoutes);

export default router;
