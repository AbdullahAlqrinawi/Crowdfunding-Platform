import express from 'express';
import { createProject, getAllProjects, getProjectById, getProjectsByUser, updateAmountRaised, updateProject } from '../controllers/projectController.js';
import { upload, authenticateUser } from '../utilities.js';  // استيراد authenticateUser

const router = express.Router();

router.post('/', authenticateUser, upload.single('image'), createProject);

router.get('/', getAllProjects);

router.get('/:id', getProjectById);
router.put('/:id', authenticateUser, upload.single('image'), updateProject);
router.get('/user/:userId', getProjectsByUser);
router.patch('/:id/amount', updateAmountRaised);


export default router;
