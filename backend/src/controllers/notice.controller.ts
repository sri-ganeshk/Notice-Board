import { Request, Response } from 'express';
import { NoticeService } from '../services/notice.service';
import ApiError from '../utils/ApiError';

export const getAllNotices = async (req: Request, res: Response) => {
  try {
    const notices = await NoticeService.getAll(
      req.query.category as string
    );
    res.json({ 
      success: true,
      data: notices 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const getNoticeById = async (req: Request, res: Response) => {
  try {
    const notice = await NoticeService.getById(req.params.id);
    if (!notice) throw new ApiError(404, 'Notice not found');
    res.json({ 
      success: true,
      data: notice 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      throw new ApiError(400, 'Title, content, and category are required');
    }
    
    const userId = req.user!.sub || req.user!.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }
    
    const notice = await NoticeService.create(req.body, userId);
    res.status(201).json({ 
      success: true,
      data: notice 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const updateNotice = async (req: Request, res: Response) => {
  try {
    const updated = await NoticeService.update(req.params.id, req.body);
    if (!updated) throw new ApiError(404, 'Notice not found');
    res.json({ 
      success: true,
      data: updated 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const deleted = await NoticeService.delete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Notice not found');
    res.status(204).send();
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};
