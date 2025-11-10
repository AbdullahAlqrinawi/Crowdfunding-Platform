import express from 'express';
import {
  createDonation,
  getDonationsByProject,
  getDonationsByUser,
  getProjectDonors,
  getUserDonatedProjects,
  getUserDonations, 
  getUserDonationsWithRewards
} from '../controllers/donationController.js';
import { authenticateUser } from '../utilities.js';

const router = express.Router();
router.get("/project/:projectId/donors", getProjectDonors);
router.post('/', authenticateUser, createDonation);
router.get('/project/:projectId', getDonationsByProject);
router.get('/user/:userId', getDonationsByUser);
router.get('/user/donations/:userId', authenticateUser, getUserDonations); 
router.get('/user/projects/:userId', authenticateUser, getUserDonatedProjects);
router.get('/user/rewards/:userId', authenticateUser, getUserDonationsWithRewards);

export default router;