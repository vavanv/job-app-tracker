import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { IndexedDBService, JobApplication, FileAttachment } from '../../services/indexeddb.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
    MatDialogModule,
    RouterModule
  ],
  template: `
    <div class="job-detail-container" *ngIf="job; else notFound">
      <div class="header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Job Application Details</h1>
        <div class="actions">
          <button mat-button [routerLink]="['/job-form', job?.id]" [disabled]="!job">
            <mat-icon>edit</mat-icon>
            Edit
          </button>
          <button mat-button color="warn" (click)="deleteJob()" [disabled]="!job">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
        </div>
      </div>
      
      <mat-card class="job-card">
        <mat-card-header>
          <mat-card-title>{{ job.position }}</mat-card-title>
          <mat-card-subtitle>{{ job.company }}</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content>
          <div class="job-info">
            <div class="info-section">
              <h3>Basic Information</h3>
              <div class="info-grid">
                <div class="info-item">
                  <mat-icon>location_on</mat-icon>
                  <div>
                    <strong>Location</strong>
                    <p>{{ job.location || 'Not specified' }}</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <mat-icon>calendar_today</mat-icon>
                  <div>
                    <strong>Date Applied</strong>
                    <p>{{ job.dateApplied | date:'fullDate' }}</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <mat-icon>work</mat-icon>
                  <div>
                    <strong>Job Type</strong>
                    <p>{{ job.jobType || 'Not specified' }}</p>
                  </div>
                </div>
                
                <div class="info-item">
                  <mat-icon>attach_money</mat-icon>
                  <div>
                    <strong>Salary Range</strong>
                    <p>{{ job.salaryRange || 'Not specified' }}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="info-section">
              <h3>Application Status</h3>
              <mat-chip-set>
                <mat-chip [class]="'status-' + job.status.toLowerCase()">{{ job.status }}</mat-chip>
              </mat-chip-set>
            </div>
            
            <mat-divider *ngIf="job.url"></mat-divider>
            
            <div class="info-section" *ngIf="job.url">
              <h3>Job Posting</h3>
              <a [href]="job.url" target="_blank" mat-button color="primary">
                <mat-icon>open_in_new</mat-icon>
                View Original Posting
              </a>
            </div>
            
            <mat-divider *ngIf="job.notes"></mat-divider>
            
            <div class="info-section" *ngIf="job.notes">
              <h3>Notes</h3>
              <p class="notes">{{ job.notes }}</p>
            </div>
            
            <mat-divider *ngIf="job.resume || job.coverLetter"></mat-divider>
            
            <div class="info-section" *ngIf="job.resume || job.coverLetter">
              <h3>Attachments</h3>
              <div class="attachments">
                <div class="attachment-item" *ngIf="job.resume">
                  <mat-icon>description</mat-icon>
                  <div class="attachment-info">
                    <strong>Resume</strong>
                    <p>{{ job.resume.name }} ({{ formatFileSize(job.resume.size) }})</p>
                  </div>
                  <button mat-icon-button (click)="downloadFile(job.resume, 'resume')" title="Download Resume">
                    <mat-icon>download</mat-icon>
                  </button>
                </div>
                
                <div class="attachment-item" *ngIf="job.coverLetter">
                  <mat-icon>article</mat-icon>
                  <div class="attachment-info">
                    <strong>Cover Letter</strong>
                    <p>{{ job.coverLetter.name }} ({{ formatFileSize(job.coverLetter.size) }})</p>
                  </div>
                  <button mat-icon-button (click)="downloadFile(job.coverLetter, 'cover-letter')" title="Download Cover Letter">
                    <mat-icon>download</mat-icon>
                  </button>
                </div>
              </div>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="info-section">
              <h3>Timeline</h3>
              <div class="timeline">
                <div class="timeline-item">
                  <mat-icon>add_circle</mat-icon>
                  <div>
                    <strong>Application Created</strong>
                    <p>{{ job.createdAt | date:'medium' }}</p>
                  </div>
                </div>
                <div class="timeline-item" *ngIf="job.updatedAt && job.updatedAt !== job.createdAt">
                  <mat-icon>update</mat-icon>
                  <div>
                    <strong>Last Updated</strong>
                    <p>{{ job.updatedAt | date:'medium' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
    
    <ng-template #notFound>
      <div class="not-found">
        <mat-icon class="large-icon">error_outline</mat-icon>
        <h2>Job Application Not Found</h2>
        <p>The job application you're looking for doesn't exist or has been deleted.</p>
        <button mat-raised-button color="primary" (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Go Back
        </button>
      </div>
    </ng-template>
  `,
  styles: [`
    .job-detail-container {
      padding: 8px;
      max-width: 700px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }
    
    .header h1 {
      flex: 1;
      margin: 0;
      color: #333;
      font-size: 1.3rem;
    }
    
    .actions {
      display: flex;
      gap: 4px;
    }
    
    .actions button {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 13px;
    }
    
    .job-card {
      padding: 12px;
    }
    
    .job-info {
      margin-top: 8px;
    }
    
    .info-section {
      margin: 12px 0;
    }
    
    .info-section h3 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 0.95rem;
    }
    
    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 8px;
    }
    
    .info-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
    }
    
    .info-item mat-icon {
      color: #666;
      margin-top: 2px;
    }
    
    .info-item strong {
      display: block;
      margin-bottom: 3px;
      color: #333;
    }
    
    .info-item p {
      margin: 0;
      color: #666;
    }
    
    .status-applied {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    
    .status-interview {
      background-color: #fff3e0;
      color: #f57c00;
    }
    
    .status-offer {
      background-color: #e8f5e8;
      color: #388e3c;
    }
    
    .status-rejected {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    .notes {
      white-space: pre-wrap;
      line-height: 1.3;
      color: #666;
      margin: 0;
      background: #f8f9fa;
      border-radius: 4px;
      padding: 8px;
      font-size: 14px;
    }
    
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      padding: 8px;
      background: #f8f9fa;
      border-radius: 4px;
    }
    
    .timeline-item mat-icon {
      color: #666;
      margin-top: 2px;
    }
    
    .timeline-item strong {
      display: block;
      margin-bottom: 3px;
      color: #333;
    }
    
    .timeline-item p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .attachments {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .attachment-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: #fafafa;
    }
    
    .attachment-item mat-icon:first-child {
      color: #666;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .attachment-info {
      flex: 1;
    }
    
    .attachment-info strong {
      display: block;
      margin-bottom: 2px;
      color: #333;
      font-size: 14px;
    }
    
    .attachment-info p {
      margin: 0;
      color: #666;
      font-size: 12px;
    }
    
    .attachment-item button {
      color: #1976d2;
    }
    
    .attachment-item button:hover {
      background-color: rgba(25, 118, 210, 0.1);
    }
    
    .not-found {
      text-align: center;
      padding: 24px 12px;
      color: #666;
    }
    
    .large-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      margin-bottom: 8px;
      color: #ccc;
    }
    
    .not-found h2 {
      margin: 8px 0 4px 0;
      color: #333;
      font-size: 1.2rem;
    }
    
    .not-found p {
      margin-bottom: 12px;
      font-size: 13px;
    }
    
    .not-found button {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    
    @media (max-width: 768px) {
      .job-detail-container {
        padding: 6px;
      }
      
      .header {
        flex-wrap: wrap;
        gap: 6px;
      }
      
      .actions {
        width: 100%;
        justify-content: flex-end;
        gap: 3px;
      }
      
      .job-card {
        padding: 8px;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
        gap: 6px;
      }
      
      .info-section {
        margin: 8px 0;
      }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  job: JobApplication | null = null;
  jobId: string | null = null;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dbService: IndexedDBService,
    private dialog: MatDialog
  ) {}
  
  ngOnInit(): void {
    this.jobId = this.route.snapshot.paramMap.get('id');
    if (this.jobId) {
      this.loadJob();
    }
  }
  
  private async loadJob(): Promise<void> {
    if (!this.jobId) return;
    
    try {
      this.job = await this.dbService.getJob(this.jobId);
    } catch (error) {
      console.error('Error loading job:', error);
    }
  }
  
  goBack(): void {
    this.router.navigate(['/jobs']);
  }
  
  async deleteJob(): Promise<void> {
    if (!this.jobId || !this.job) return;
    
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Job Application',
        message: `Are you sure you want to delete the application for "${this.job.position}" at "${this.job.company}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      try {
        await this.dbService.deleteJob(this.jobId);
        this.router.navigate(['/jobs']);
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job application. Please try again.');
      }
    }
  }
  
  downloadFile(fileAttachment: FileAttachment, type: string): void {
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
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}