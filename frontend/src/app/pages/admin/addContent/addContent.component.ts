import { Component, signal, inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { NoticeService, CreateNoticeRequest, NoticeResponse } from '../../../core/services/notice.service';
import { EventService, CreateEventRequest, EventResponse } from '../../../core/services/event.service';
import { ToastService } from '../../../core/services/toast.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatIconModule,
    MatTabsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './addContent.component.html',
  styleUrls: ['./addContent.component.css']
})
export class AddContentComponent {
  private noticeService = inject(NoticeService);
  private eventService = inject(EventService);
  private toast = inject(ToastService);

  // Plain FormGroup properties — not wrapped in signal() (that's an anti-pattern)
  noticeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    content: new FormControl('', [Validators.required, Validators.minLength(10)]),
    category: new FormControl('', [Validators.required])
  });

  eventForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    eventDate: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required, Validators.minLength(3)])
  });

  isSubmittingNotice = signal<boolean>(false);
  isSubmittingEvent = signal<boolean>(false);

  categories = [
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' }
  ];

  onSubmitNotice(): void {
    if (this.noticeForm.valid) {
      this.isSubmittingNotice.set(true);

      const noticeData: CreateNoticeRequest = {
        title: this.noticeForm.value.title!,
        content: this.noticeForm.value.content!,
        category: this.noticeForm.value.category! as 'academic' | 'sports' | 'cultural'
      };

      this.noticeService.createNotice(noticeData).subscribe({
        next: (_response: NoticeResponse) => {
          this.noticeForm.reset();
          this.isSubmittingNotice.set(false);
          this.toast.success('Notice created successfully!');
        },
        error: (error: any) => {
          const msg = error.error?.message || 'Failed to create notice';
          this.toast.error(msg);
          this.isSubmittingNotice.set(false);
        }
      });
    } else {
      this.markFormGroupTouched(this.noticeForm);
    }
  }

  onSubmitEvent(): void {
    if (this.eventForm.valid) {
      this.isSubmittingEvent.set(true);

      const eventData: CreateEventRequest = {
        title: this.eventForm.value.title!,
        description: this.eventForm.value.description!,
        eventDate: this.eventForm.value.eventDate!,
        location: this.eventForm.value.location!
      };

      this.eventService.createEvent(eventData).subscribe({
        next: (_response: EventResponse) => {
          this.toast.success('Event created successfully!');
          this.eventForm.reset();
          this.isSubmittingEvent.set(false);
        },
        error: (error: any) => {
          const msg = error.error?.message || 'Failed to create event';
          this.toast.error(msg);
          this.isSubmittingEvent.set(false);
        }
      });
    } else {
      this.markFormGroupTouched(this.eventForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
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
}
