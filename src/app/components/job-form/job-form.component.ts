import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IndexedDBService, FileAttachment } from '../../services/indexeddb.service';
import { SimpleInputComponent } from '../simple-input/simple-input.component';

@Component({
  selector: 'app-job-form',
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
    MatDatepickerModule,
    MatNativeDateModule,
    SimpleInputComponent
  ],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent {
  jobForm: FormGroup;
  isEditMode = false;
  jobId: string | null = null;
  selectedResume: File | null = null;
  selectedCoverLetter: File | null = null;
  existingResume: FileAttachment | null = null;
  existingCoverLetter: FileAttachment | null = null;
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private dbService: IndexedDBService
  ) {
    this.jobForm = this.createForm();
    this.checkEditMode();
  }
  
  private createForm(): FormGroup {
    return this.fb.group({
      position: ['', Validators.required],
      company: ['', Validators.required],
      location: [''],
      status: ['Applied', Validators.required],
      dateApplied: [new Date(), Validators.required],
      url: [''],
      salaryRange: [''],
      jobType: ['Full-time'],
      notes: ['']
    });
  }
  
  private checkEditMode(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.jobId;
    
    if (this.isEditMode) {
      // TODO: Load job data from IndexedDB service
      this.loadJobData();
    }
  }
  
  private async loadJobData(): Promise<void> {
    if (this.jobId) {
      try {
        const job = await this.dbService.getJob(this.jobId);
        if (job) {
          this.jobForm.patchValue({
            position: job.position,
            company: job.company,
            location: job.location,
            status: job.status,
            dateApplied: new Date(job.dateApplied),
            url: job.url,
            salaryRange: job.salaryRange,
            jobType: job.jobType,
            notes: job.notes
          });
          
          // Load existing attachments
          this.existingResume = job.resume || null;
          this.existingCoverLetter = job.coverLetter || null;
        }
      } catch (error) {
        console.error('Error loading job data:', error);
      }
    }
  }
  
  async onSubmit(): Promise<void> {
    if (this.jobForm.valid) {
      const dateApplied = this.jobForm.value.dateApplied;
      const jobData = {
        ...this.jobForm.value,
        dateApplied: dateApplied instanceof Date ? dateApplied.toISOString() : new Date(dateApplied).toISOString()
      };
      
      // Handle file uploads
      // For resume: use new file if selected, otherwise keep existing if not removed
      if (this.selectedResume) {
        const resumeBase64 = await this.fileToBase64(this.selectedResume);
        jobData.resume = {
          name: this.selectedResume.name,
          type: this.selectedResume.type,
          size: this.selectedResume.size,
          data: resumeBase64,
          uploadedAt: new Date()
        };
      } else if (this.existingResume) {
        jobData.resume = this.existingResume;
      }
      
      // For cover letter: use new file if selected, otherwise keep existing if not removed
      if (this.selectedCoverLetter) {
        const coverLetterBase64 = await this.fileToBase64(this.selectedCoverLetter);
        jobData.coverLetter = {
          name: this.selectedCoverLetter.name,
          type: this.selectedCoverLetter.type,
          size: this.selectedCoverLetter.size,
          data: coverLetterBase64,
          uploadedAt: new Date()
        };
      } else if (this.existingCoverLetter) {
        jobData.coverLetter = this.existingCoverLetter;
      }
      
      try {
        if (this.isEditMode && this.jobId) {
          await this.dbService.updateJob(this.jobId, jobData);
          console.log('Job updated successfully');
        } else {
          await this.dbService.addJob(jobData);
          console.log('Job created successfully');
        }
        
        this.router.navigate(['/jobs']);
      } catch (error) {
        console.error('Error saving job:', error);
        // You could add a snackbar or error message here
      }
    }
  }
  
  onCancel(): void {
    this.router.navigate(['/jobs']);
  }
  
  onResumeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidFileType(file)) {
        this.selectedResume = file;
      } else {
        alert('Please select a valid file type (PDF, DOC, DOCX)');
        input.value = '';
      }
    }
  }
  
  onCoverLetterSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (this.isValidFileType(file)) {
        this.selectedCoverLetter = file;
      } else {
        alert('Please select a valid file type (PDF, DOC, DOCX)');
        input.value = '';
      }
    }
  }
  
  removeResume(): void {
    this.selectedResume = null;
  }
  
  removeCoverLetter(): void {
    this.selectedCoverLetter = null;
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadExistingFile(fileAttachment: FileAttachment, type: string): void {
    try {
      // Convert base64 to blob
      const byteCharacters = atob(fileAttachment.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: fileAttachment.type });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileAttachment.name;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  }

  removeExistingResume(): void {
    this.existingResume = null;
  }

  removeExistingCoverLetter(): void {
    this.existingCoverLetter = null;
  }
  
  private isValidFileType(file: File): boolean {
    const validTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return validTypes.includes(file.type);
  }
  
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
}