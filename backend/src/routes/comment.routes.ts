import { Router } from 'express';
import { addComment, getComments } from '../controllers/comment.controller';
import authMiddleware from '../middleware/auth.middleware';

export const commentRouter = Router();

commentRouter.post('/:postId', authMiddleware, addComment);
commentRouter.get('/:postId', getComments); 

export default commentRouter;
