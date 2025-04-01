import * as RegistryService from '../../router/licence/licenseService';
import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /license/validity:
 *   get:
 *     summary: Check license validity for a given wallet and optional device ID.
 *     tags:
 *       - License
 *     parameters:
 *       - in: query
 *         name: wallet
 *         required: true
 *         schema:
 *           type: string
 *         description: The wallet address to check.
 *       - in: query
 *         name: deviceId
 *         required: false
 *         schema:
 *           type: string
 *         description: Optional device identifier.
 *       - in: query
 *         name: licenseId
 *         required: true
 *         schema:
 *           type: string
 *         description: The license ID to check.
 *     responses:
 *       200:
 *         description: License validity response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   type: object
 *                   properties:
 *                     wallet:
 *                       type: string
 *                       example: "0x1234...abcd"
 *                     deviceId:
 *                       type: string
 *                       nullable: true
 *                       example: "device-001"
 *                     license:
 *                       type: object
 *                       properties:
 *                         valid:
 *                           type: boolean
 *                           example: true
 *                         reason:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-28T14:53:00Z"
 *       400:
 *         description: Missing wallet address
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: Wallet address is required
 */
router.get('/validity', async (req, res) => {
  const { wallet, deviceId, licenseId } = req.query;

  if (!wallet || !licenseId) {
    return res.status(400).json({
      status: 'error',
      message: 'Wallet address and license ID are required',
    });
  }

  const isValid = await RegistryService.checkValidLicense(
    wallet as string,
    Number(licenseId)
  );

  if (!isValid) {
    return res.json({
      status: 'invalid',
      data: {
        wallet,
        deviceId: deviceId || null,
        license: {
          valid: false,
          reason: 'Invalid license',
        },
        timestamp: new Date().toISOString(),
      },
    });
  }

  return res.json({
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
