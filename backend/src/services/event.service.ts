import { Event } from '../models/event.model';

export class EventService {
  static async getUpcoming() {
    return Event.find({ eventDate: { $gte: new Date() } })
      .populate('createdBy', 'fullName email')
      .populate('registeredUsers', 'fullName email')
      .sort({ eventDate: 1 });
  }

  static async getById(id: string) {
    return Event.findById(id)
      .populate('createdBy', 'fullName email')
      .populate('registeredUsers', 'fullName email');
  }

  static async create(data: {
    title: string;
    description: string;
    eventDate: Date;
    location: string;
  }, userId: string) {
    return Event.create({ ...data, createdBy: userId });
  }

  static async registerUser(eventId: string, userId: string) {
    return Event.findByIdAndUpdate(
      eventId,
      { $addToSet: { registeredUsers: userId } },
      { new: true }
    )
    .populate('createdBy', 'fullName email')
    .populate('registeredUsers', 'fullName email');
  }

  static async delete(id: string) {
    return Event.findByIdAndDelete(id);
  }
}
