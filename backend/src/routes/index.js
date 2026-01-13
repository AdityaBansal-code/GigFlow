import express from 'express';
import authRoutes from './authRoutes.js';
import gigRoutes from './gigRoutes.js';
import bidRoutes from './bidRoutes.js';
import hiringRoutes from './hiringRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/gigs', gigRoutes);
router.use('/bids', bidRoutes);
router.use('/bids', hiringRoutes);

export default router;
