import express from 'express';
import { 
  createLike, 
  deleteLike, 
  getLikesByProject, 
  getUserLikedProjects, 
  checkUserLike 
} from '../controllers/likeController.js';
import { authenticateToken } from '../utilities.js';

const router = express.Router();

router.post('/', authenticateToken, createLike);
router.delete('/', authenticateToken, deleteLike);
router.get('/project/:projectId', getLikesByProject);
router.get('/user/:userId', authenticateToken, getUserLikedProjects); // إضافة التوثيق هنا
router.post('/check', authenticateToken, checkUserLike);

export default router;