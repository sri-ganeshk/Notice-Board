import { Router } from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  registerForEvent,
  deleteEvent,
} from '../controllers/event.controller';
import authMiddleware from '../middleware/auth.middleware';
import roleMiddleware from '../middleware/role.middleware';

export const eventRouter = Router();

eventRouter.get('/', getEvents);
eventRouter.get('/:id', getEventById);
eventRouter.post('/', authMiddleware, roleMiddleware('admin'), createEvent);
eventRouter.post('/:id/register', authMiddleware, registerForEvent);
eventRouter.delete('/:id', authMiddleware, roleMiddleware('admin'), deleteEvent);

export default eventRouter;
