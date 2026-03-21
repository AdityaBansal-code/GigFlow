import express from 'express';
import authRoutes from './authRoutes.js';
import gigRoutes from './gigRoutes.js';
import bidRoutes from './bidRoutes.js';
import hiringRoutes from './hiringRoutes.js';
import profileRoutes from './profileRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/gigs', gigRoutes);
router.use('/bids', bidRoutes);
router.use('/bids', hiringRoutes);
router.use('/profile', profileRoutes);
router.use('/reviews', reviewRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
