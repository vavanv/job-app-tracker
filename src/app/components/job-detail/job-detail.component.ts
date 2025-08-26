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
  templateUrl: './job-detail.component.html',
  styleUrls: ['./job-detail.component.css']
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