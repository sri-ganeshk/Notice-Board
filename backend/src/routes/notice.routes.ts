import { Router } from 'express';
import {getAllNotices,getNoticeById,createNotice,updateNotice,deleteNotice} from '../controllers/notice.controller';
import auth from '../middleware/auth.middleware';
import role from '../middleware/role.middleware';

export const noticeRouter = Router()


noticeRouter.get('/', getAllNotices)
noticeRouter.get('/:id',getNoticeById)
noticeRouter.post('/', auth, role('admin'),createNotice)
noticeRouter.put('/:id', auth, role('admin'), updateNotice)
noticeRouter.delete('/:id', auth, role('admin'), deleteNotice);
