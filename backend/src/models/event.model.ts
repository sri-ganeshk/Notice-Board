import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IEvent extends Document {
  title: string;
  description: string;
  eventDate: Date;
  location: string;
  registeredUsers: IUser['_id'][];
  createdBy: IUser['_id'];
  createdAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title:           { type: String, required: true },
    description:     { type: String, required: true },
    eventDate:       { type: Date, required: true },
    location:        { type: String, required: true },
    registeredUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    createdBy:       { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);
