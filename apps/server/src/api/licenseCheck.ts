import { Router } from 'express';

const router = Router();

router.get('/validity', (req, res) => {
  const { wallet, deviceId } = req.query;

  if (!wallet) {
    return res.status(400).json({
      status: 'error',
      message: 'Wallet address is required',
    });
  }

  res.json({
    status: 'ok',
    data: {
      wallet,
      deviceId: deviceId || null,
      license: {
        valid: true,
        reason: null,
      },
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
