import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import ApiError from '../utils/ApiError';

export const getComments = async (req: Request, res: Response) => {
  try {
    const { postType } = req.query;
    if (!postType || (postType !== 'notice' && postType !== 'event')) {
        throw new ApiError(400, 'Valid postType (notice or event) required in query');
    }
    
    const comments = await CommentService.getComments(
        postType as 'notice' | 'event',
        req.params.postId
    );
    res.json({ 
        success: true,
        data: comments 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const addComment = async (req: Request, res: Response) => {
  try {
    const { postType, text } = req.body;
    
    if (!text) throw new ApiError(400, 'Text required');
    if (!postType || (postType !== 'notice' && postType !== 'event')) {
        throw new ApiError(400, 'Valid postType (notice or event) required');
    }
    
    const userId = req.user!.sub || req.user!.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }
    
    const comment = await CommentService.addComment(
        {
            postType: postType as 'notice' | 'event',
            postId: req.params.postId,
            text,
        },
        userId
    );
    res.status(201).json({ 
        success: true,
        data: comment 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};
