import express from 'express';
import commentController from '../controllers/commentController.js';
import { authenticateUser } from '../utilities.js';

const router = express.Router();

router.post('/', authenticateUser, commentController.createComment);
router.get('/project/:projectId', commentController.getCommentsByProject);

export default router;
