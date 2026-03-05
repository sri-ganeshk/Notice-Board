import { Request, Response } from 'express';
import { EventService } from '../services/event.service';
import ApiError from '../utils/ApiError';

export const getEvents = async (req : Request, res :Response) => {
  try {
    const events = await EventService.getUpcoming();
    res.json({ 
      success: true,
      data: events 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await EventService.getById(req.params.id);
    if (!event) throw new ApiError(404, 'Event not found');
    res.json({ 
      success: true,
      data: event 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, eventDate, location } = req.body;
    if (!title || !description || !eventDate || !location) {
      throw new ApiError(400, 'Title, description, eventDate, and location are required');
    }
    
    const userId = req.user!.sub || req.user!.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }
    
    const event = await EventService.create(req.body, userId);
    res.status(201).json({ 
      success: true,
      data: event 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const registerForEvent = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.sub || req.user!.userId;
    if (!userId) {
        throw new ApiError(401, 'User not authenticated');
    }
    
    const updated = await EventService.registerUser(
      req.params.id,
      userId
    );
    if (!updated) throw new ApiError(404, 'Event not found');
    res.json({ 
      success: true,
      data: updated 
    });
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};

export const deleteEvent = async (req :Request, res: Response) => {
  try {
    const deleted = await EventService.delete(req.params.id);
    if (!deleted) throw new ApiError(404, 'Event not found');
    res.status(204).send();
  } catch (error: any) {
    throw new ApiError(400, error.message);
  }
};
