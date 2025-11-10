import express from 'express';
import { createSupportTier, getSupportTiersByProject } from '../controllers/supportTierController.js';

const router = express.Router();

router.post('/', createSupportTier);

router.get('/project/:projectId', getSupportTiersByProject);

export default router;
