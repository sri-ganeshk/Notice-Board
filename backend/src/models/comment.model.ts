import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';

export interface IComment extends Document {
  postType: 'notice' | 'event';
  postId: mongoose.Types.ObjectId;
  text: string;
  author: IUser['_id'];
  createdAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    postType: { type: String, enum: ['notice', 'event'], required: true },
    postId:   { type: Schema.Types.ObjectId, required: true },
    text:     { type: String, required: true },
    author:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Comment = mongoose.model<IComment>('Comment', commentSchema);
