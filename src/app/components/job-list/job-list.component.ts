import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { SimpleInputComponent } from '../simple-input/simple-input.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { IndexedDBService, JobApplication } from '../../services/indexeddb.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    RouterModule,
    SimpleInputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: JobApplication[] = [];
  filteredJobs: JobApplication[] = [];
  filterForm: FormGroup;
  private navigationSubscription: Subscription = new Subscription();
  
  constructor(
    private router: Router,
    private dbService: IndexedDBService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      searchTerm: [''],
      statusFilter: ['All']
    });
  }
  
  ngOnInit() {
    this.loadJobs();
    
    // Subscribe to form changes
    this.filterForm.valueChanges.subscribe(() => {
      this.filterJobs();
    });
    
    // Subscribe to navigation events to refresh data when returning to this route
    this.navigationSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url === '/jobs') {
          this.loadJobs();
        }
      });
  }
  
  ngOnDestroy() {
    this.navigationSubscription.unsubscribe();
  }
  
  async loadJobs(): Promise<void> {
    try {
      this.jobs = await this.dbService.getAllJobs();
      this.filterJobs();
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  }
  
  filterJobs(): void {
    const { searchTerm, statusFilter } = this.filterForm.value;
    
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch = !searchTerm || 
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || job.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }
  
  async deleteJob(job: JobApplication): Promise<void> {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Job Application',
        message: `Are you sure you want to delete the application for "${job.position}" at "${job.company}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    const result = await dialogRef.afterClosed().toPromise();
    if (result) {
      try {
        await this.dbService.deleteJob(job.id!.toString());
        await this.loadJobs(); // Refresh the job list
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Error deleting job application. Please try again.');
      }
    }
  }

  openAttachment(attachment: any) {
    if (attachment && attachment.data) {
      // Convert base64 to binary data
      const byteCharacters = atob(attachment.data.split(',')[1] || attachment.data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      
      const blob = new Blob([byteArray], { type: attachment.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = attachment.name;
      link.click();
      URL.revokeObjectURL(url);
    }
  }
  
  viewJob(jobId: string): void {
    this.router.navigate(['/job-detail', jobId]);
  }
  
  editJob(jobId: string): void {
    this.router.navigate(['/job-form', jobId]);
  }
}