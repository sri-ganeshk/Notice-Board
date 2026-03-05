import { Comment } from '../models/comment.model';

export class CommentService {
  static async getComments(
    postType: 'notice' | 'event',
    postId: string
  ) {
    return Comment.find({ postType, postId })
      .populate('author', 'fullName email')
      .sort({ createdAt: 1 });
  }

  static async addComment(
    data: { postType: 'notice' | 'event'; postId: string; text: string },
    userId: string
  ) {
    const comment = await Comment.create({ ...data, author: userId });
    return Comment.findById(comment._id).populate('author', 'fullName email');
  }
}
