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
  template: `
    <div class="job-form-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>{{ isEditMode ? 'Edit Job Application' : 'Add New Job Application' }}</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="jobForm" (ngSubmit)="onSubmit()">
            <div class="form-row">
              <app-simple-input
                label="Job Title"
                placeholder="e.g. Software Engineer"
                formControlName="position"
                [required]="true"
                [hasError]="!!(jobForm.get('position')?.invalid && jobForm.get('position')?.touched)"
                errorMessage="Job title is required"
                class="full-width">
              </app-simple-input>
            </div>
            
            <div class="form-row">
              <app-simple-input
                label="Company"
                placeholder="e.g. Google"
                formControlName="company"
                [required]="true"
                [hasError]="!!(jobForm.get('company')?.invalid && jobForm.get('company')?.touched)"
                errorMessage="Company is required"
                class="full-width">
              </app-simple-input>
            </div>
            
            <div class="form-row">
              <app-simple-input
                label="Location"
                placeholder="e.g. San Francisco, CA"
                formControlName="location"
                class="full-width">
              </app-simple-input>
            </div>
            
            <div class="form-row">
              <app-simple-input
                label="Application Status"
                placeholder="Select status"
                type="select"
                formControlName="status"
                [options]="[
                  {value: 'Applied', label: 'Applied'},
                  {value: 'Interview', label: 'Interview'},
                  {value: 'Offer', label: 'Offer'},
                  {value: 'Rejected', label: 'Rejected'}
                ]"
                class="half-width">
              </app-simple-input>
              
              <app-simple-input
                label="Date Applied"
                type="date"
                formControlName="dateApplied"
                class="half-width">
              </app-simple-input>
            </div>
            
            <div class="form-row">
              <app-simple-input
                label="Job URL"
                placeholder="https://..."
                type="url"
                formControlName="url"
                class="full-width">
              </app-simple-input>
            </div>
            
            <div class="form-row">
              <app-simple-input
                label="Salary Range"
                placeholder="e.g. $80k - $120k"
                formControlName="salaryRange"
                class="half-width">
              </app-simple-input>
              
              <app-simple-input
                label="Job Type"
                placeholder="Select job type"
                type="select"
                formControlName="jobType"
                [options]="[
                  {value: 'Full-time', label: 'Full-time'},
                  {value: 'Part-time', label: 'Part-time'},
                  {value: 'Contract', label: 'Contract'},
                  {value: 'Internship', label: 'Internship'}
                ]"
                class="half-width">
              </app-simple-input>
            </div>
            
            <div class="form-row">
              <app-simple-input
                label="Notes"
                placeholder="Additional notes about this job application..."
                type="textarea"
                formControlName="notes"
                class="full-width">
              </app-simple-input>
            </div>
            
            <div class="form-row">
              <div class="file-upload-section">
                <h3>Documents</h3>
                
                <div class="file-upload-field">
                  <label for="resume-upload" class="file-upload-label">
                    <mat-icon>description</mat-icon>
                    Resume (PDF, DOC, DOCX)
                  </label>
                  
                  <!-- Show existing resume if available -->
                  <div *ngIf="existingResume && !selectedResume" class="existing-file-info">
                    <mat-icon>attach_file</mat-icon>
                    <span>{{ existingResume.name }} ({{ formatFileSize(existingResume.size) }})</span>
                    <button mat-icon-button type="button" (click)="downloadExistingFile(existingResume, 'resume')" color="primary" title="Download">
                      <mat-icon>download</mat-icon>
                    </button>
                    <button mat-icon-button type="button" (click)="removeExistingResume()" color="warn" title="Remove">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                  
                  <input 
                    id="resume-upload" 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    (change)="onResumeSelected($event)"
                    #resumeInput
                    class="file-input"
                  >
                  <button mat-stroked-button type="button" (click)="resumeInput.click()" class="upload-button">
                    <mat-icon>upload_file</mat-icon>
                    {{ existingResume && !selectedResume ? 'Replace Resume' : 'Choose Resume' }}
                  </button>
                  <div *ngIf="selectedResume" class="file-info">
                    <mat-icon>check_circle</mat-icon>
                    <span>{{ selectedResume.name }} ({{ formatFileSize(selectedResume.size) }})</span>
                    <button mat-icon-button type="button" (click)="removeResume()" color="warn">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                </div>
                
                <div class="file-upload-field">
                  <label for="cover-letter-upload" class="file-upload-label">
                    <mat-icon>article</mat-icon>
                    Cover Letter (PDF, DOC, DOCX)
                  </label>
                  
                  <!-- Show existing cover letter if available -->
                  <div *ngIf="existingCoverLetter && !selectedCoverLetter" class="existing-file-info">
                    <mat-icon>attach_file</mat-icon>
                    <span>{{ existingCoverLetter.name }} ({{ formatFileSize(existingCoverLetter.size) }})</span>
                    <button mat-icon-button type="button" (click)="downloadExistingFile(existingCoverLetter, 'coverLetter')" color="primary" title="Download">
                      <mat-icon>download</mat-icon>
                    </button>
                    <button mat-icon-button type="button" (click)="removeExistingCoverLetter()" color="warn" title="Remove">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                  
                  <input 
                    id="cover-letter-upload" 
                    type="file" 
                    accept=".pdf,.doc,.docx" 
                    (change)="onCoverLetterSelected($event)"
                    #coverLetterInput
                    class="file-input"
                  >
                  <button mat-stroked-button type="button" (click)="coverLetterInput.click()" class="upload-button">
                    <mat-icon>upload_file</mat-icon>
                    {{ existingCoverLetter && !selectedCoverLetter ? 'Replace Cover Letter' : 'Choose Cover Letter' }}
                  </button>
                  <div *ngIf="selectedCoverLetter" class="file-info">
                    <mat-icon>check_circle</mat-icon>
                    <span>{{ selectedCoverLetter.name }} ({{ formatFileSize(selectedCoverLetter.size) }})</span>
                    <button mat-icon-button type="button" (click)="removeCoverLetter()" color="warn">
                      <mat-icon>close</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <button mat-button type="button" (click)="onCancel()">
            <mat-icon>cancel</mat-icon>
            Cancel
          </button>
          <button mat-raised-button color="primary" type="submit" (click)="onSubmit()" [disabled]="jobForm.invalid">
            <mat-icon>save</mat-icon>
            {{ isEditMode ? 'Update' : 'Save' }}
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .job-form-container {
      padding: 4px;
      max-width: 650px;
      margin: 0 auto;
    }
    
    mat-card {
      padding: 8px;
    }
    
    .form-row {
      display: flex;
      gap: 6px;
      margin-bottom: 6px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .half-width {
      width: calc(50% - 4px);
    }
    
    mat-card-actions {
      display: flex;
      gap: 6px;
      justify-content: flex-end;
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid #e0e0e0;
    }
    
    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    
    .file-upload-section {
      width: 100%;
      margin-top: 6px;
    }
    
    .file-upload-section h3 {
      margin: 0 0 6px 0;
      color: #333;
      font-size: 13px;
      font-weight: 500;
    }
    
    .file-upload-field {
      margin-bottom: 6px;
      padding: 6px;
      border: 1px dashed #ddd;
      border-radius: 4px;
      background-color: #fafafa;
    }
    
    .file-upload-label {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-bottom: 6px;
      font-weight: 500;
      color: #666;
      font-size: 13px;
    }
    
    .file-input {
      display: none;
    }
    
    .upload-button {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
    }
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 6px;
      padding: 4px 8px;
      background-color: #e8f5e8;
      border-radius: 3px;
      color: #2e7d32;
      font-size: 12px;
    }
    
    .file-info mat-icon {
      color: #4caf50;
    }
    
    .existing-file-info {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      padding: 6px 10px;
      background-color: #e3f2fd;
      border-radius: 4px;
      color: #1565c0;
    }
    
    .existing-file-info mat-icon {
      color: #1976d2;
    }
    
    @media (max-width: 768px) {
      .job-form-container {
        padding: 4px;
      }
      
      mat-card {
        padding: 6px;
      }
      
      .form-row {
        flex-direction: column;
        gap: 4px;
        margin-bottom: 4px;
      }
      
      .half-width {
        width: 100%;
      }
      
      mat-card-actions {
        flex-direction: column;
        gap: 4px;
        margin-top: 6px;
      }
      
      mat-card-actions button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
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