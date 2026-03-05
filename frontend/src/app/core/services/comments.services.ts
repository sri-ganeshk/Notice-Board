import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  fullName: string;
  email: string;
}

export interface Comment {
  _id: string;
  postType: 'notice' | 'event';
  postId: string;
  text: string;
  author: User;
  createdAt: string;
}

export interface AddCommentRequest {
  postType: 'notice' | 'event';
  text: string;
}

export interface CommentResponse {
  success: boolean;
  data: Comment;
}

export interface CommentsResponse {
  success: boolean;
  data: Comment[];
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient) {}

  // Get comments for a post (notice or event)
  getComments(postId: string, postType: 'notice' | 'event'): Observable<CommentsResponse> {
    return this.http.get<CommentsResponse>(`${this.apiUrl}/${postId}?postType=${postType}`);
  }

  // Add comment to a post (notice or event) - token automatically added by auth interceptor
  addComment(postId: string, postType: 'notice' | 'event', text: string): Observable<CommentResponse> {
    const commentData: AddCommentRequest = { postType, text };
    return this.http.post<CommentResponse>(`${this.apiUrl}/${postId}`, commentData);
  }
}