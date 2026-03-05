import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  fullName: string;
  email: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  registeredUsers: User[];
  createdBy: User;
  createdAt: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  eventDate: Date | string;
  location: string;
}

export interface EventResponse {
  success: boolean;
  data: Event;
}

export interface EventsResponse {
  success: boolean;
  data: Event[];
}

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  getUpcomingEvents(): Observable<EventsResponse> {
    return this.http.get<EventsResponse>(this.apiUrl);
  }

  getEventById(id: string): Observable<EventResponse> {
    return this.http.get<EventResponse>(`${this.apiUrl}/${id}`);
  }

  createEvent(eventData: CreateEventRequest): Observable<EventResponse> {
    return this.http.post<EventResponse>(this.apiUrl, eventData);
  }

  registerForEvent(eventId: string): Observable<EventResponse> {
    return this.http.post<EventResponse>(`${this.apiUrl}/${eventId}/register`, {});
  }

  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Helper methods
  isUserRegistered(event: Event, userId: string): boolean {
    return event.registeredUsers.some(user => user._id === userId);
  }

  getRegisteredUserCount(event: Event): number {
    return event.registeredUsers.length;
  }

  isEventUpcoming(event: Event): boolean {
    return new Date(event.eventDate) >= new Date();
  }

  isEventPast(event: Event): boolean {
    return new Date(event.eventDate) < new Date();
  }
}