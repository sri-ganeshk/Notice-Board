import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface INotice extends Document {
  title: string;
  content: string;
  category: 'academic' | 'sports' | 'cultural';
  postedBy: IUser['_id'];
  createdAt: Date;
}

const noticeSchema = new Schema<INotice>(
  {
    title:    { type: String, required: true },
    content:  { type: String, required: true },
    category: { type: String, enum: ['academic', 'sports', 'cultural'], required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Notice = mongoose.model<INotice>('Notice', noticeSchema);
