import  jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User, IUser } from '../models/user.model';
import config from '../config/config';

export class AuthService {
  static async register(userData: Partial<IUser> & { password: string }) {
    const existing = await User.findOne({ email: userData.email });
    if (existing) throw new Error('Email already in use');

    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user = new User({
      fullName: userData.fullName,
      email: userData.email,
      passwordHash,
      role: 'student',
    });
    return user.save();
  }

  static async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new Error('Invalid credentials');

    const token = jwt.sign
    (
      { 
        sub: user.id, role: user.role 
      },
        config.JWT_SECRET,
      { 
        expiresIn: '1h' 
      }
    );
    return { user, token };
  }

  static async verify(token: string) {
    return jwt.verify(token, config.JWT_SECRET) as { sub: string; role: string };
  }
}