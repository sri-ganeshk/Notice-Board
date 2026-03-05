import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'student';
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role:     { type: String, enum: ['admin', 'student'], default: 'student' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
