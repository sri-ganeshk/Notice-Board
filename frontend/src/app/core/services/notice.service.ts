import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Notice {
  _id: string;
  title: string;
  content: string;
  category: 'academic' | 'sports' | 'cultural';
  postedBy: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateNoticeRequest {
  title: string;
  content: string;
  category: 'academic' | 'sports' | 'cultural';
}

export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  category?: 'academic' | 'sports' | 'cultural';
}

export interface NoticeResponse {
  success: boolean;
  data: Notice;
}

export interface NoticesResponse {
  success: boolean;
  data: Notice[];
}

@Injectable({
  providedIn: 'root'
})
export class NoticeService {
  private apiUrl = `${environment.apiUrl}/notices`;

  constructor(private http: HttpClient) {}

  getAllNotices(category?: string): Observable<NoticesResponse> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category);
    }
    return this.http.get<NoticesResponse>(this.apiUrl, { params });
  }

  getNoticeById(id: string): Observable<NoticeResponse> {
    return this.http.get<NoticeResponse>(`${this.apiUrl}/${id}`);
  }

  createNotice(noticeData: CreateNoticeRequest): Observable<NoticeResponse> {
    return this.http.post<NoticeResponse>(this.apiUrl, noticeData);
  }

  updateNotice(id: string, noticeData: UpdateNoticeRequest): Observable<NoticeResponse> {
    return this.http.put<NoticeResponse>(`${this.apiUrl}/${id}`, noticeData);
  }

  deleteNotice(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}