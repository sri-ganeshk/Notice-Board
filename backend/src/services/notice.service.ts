import { Notice } from '../models/notice.model';

export class NoticeService {
  static async getAll(category?: string) {
    const filter = category ? { category } : {};
    return Notice.find(filter)
      .populate('postedBy', 'fullName email')
      .sort({ createdAt: -1 });
  }

  static async getById(id: string) {
    return Notice.findById(id).populate('postedBy', 'fullName email');
  }

  static async create(data: {
    title: string;
    content: string;
    category: 'academic' | 'sports' | 'cultural';
  }, userId: string) {
    return Notice.create({ ...data, postedBy: userId });
  }

  static async update(id: string, data: Partial<{
    title: string;
    content: string;
    category: 'academic' | 'sports' | 'cultural';
  }>) {
    return Notice.findByIdAndUpdate(id, data, { new: true });
  }

  static async delete(id: string) {
    return Notice.findByIdAndDelete(id);
  }
}
