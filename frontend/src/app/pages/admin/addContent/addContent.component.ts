import { Component, signal } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NoticeService, CreateNoticeRequest, NoticeResponse } from '../../../core/services/notice.service';
import { EventService, CreateEventRequest, EventResponse } from '../../../core/services/event.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-content',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './addContent.component.html',
  styleUrls: ['./addContent.component.css']
})
export class AddContentComponent {
  noticeForm = signal(new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    content: new FormControl('', [Validators.required, Validators.minLength(10)]),
    category: new FormControl('', [Validators.required])
  }));
  
  eventForm = signal(new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    eventDate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required, Validators.minLength(3)])
  }));
  
  isSubmittingNotice = signal<boolean>(false);
  isSubmittingEvent = signal<boolean>(false);
  activeTab = signal<number>(0);

  categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' }
  ];

  constructor(
    private noticeService: NoticeService,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}

  onSubmitNotice(): void {
    if (this.noticeForm().valid) {
      this.isSubmittingNotice.set(true);
      
      const noticeData: CreateNoticeRequest = {
        title: this.noticeForm().value.title!,
        content: this.noticeForm().value.content!,
        category: this.noticeForm().value.category! as 'academic' | 'sports' | 'cultural'
      };

      this.noticeService.createNotice(noticeData).subscribe({
        next: (response: NoticeResponse) => {

          this.noticeForm().reset();
          this.isSubmittingNotice.set(false);
        },
        error: (error: any) => {
          console.error('Error creating notice:', error);

          this.isSubmittingNotice.set(false);
        }
      });
    } else {
      this.markFormGroupTouched(this.noticeForm());
    }
  }

  onSubmitEvent(): void {
    if (this.eventForm().valid) {
      this.isSubmittingEvent.set(true);
      
      const eventData: CreateEventRequest = {
        title: this.eventForm().value.title!,
        description: this.eventForm().value.description!,
        eventDate: this.eventForm().value.eventDate!,
        location: this.eventForm().value.location!
      };

      this.eventService.createEvent(eventData).subscribe({
        next: (response: EventResponse) => {
          this.snackBar.open('Event created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.eventForm().reset();
          this.isSubmittingEvent.set(false);
        },
        error: (error: any) => {
          console.error('Error creating event:', error);
          this.snackBar.open('Error creating event. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          this.isSubmittingEvent.set(false);
        }
      });
    } else {
      this.markFormGroupTouched(this.eventForm());
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(fieldName: string, formGroup: FormGroup): string {
    const control = formGroup.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const requiredLength = control.errors?.['minlength']?.requiredLength;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${requiredLength} characters`;
    }
    return '';
  }

  // Helper methods to get form instances for template binding
  getNoticeForm(): FormGroup {
    return this.noticeForm();
  }

  getEventForm(): FormGroup {
    return this.eventForm();
  }

  getIsSubmittingNotice(): boolean {
    return this.isSubmittingNotice();
  }

  getIsSubmittingEvent(): boolean {
    return this.isSubmittingEvent();
  }

  onTabChange(index: number): void {
    this.activeTab.set(index);
  }
}
