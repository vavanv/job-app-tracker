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
import { RouterModule } from '@angular/router';
import { SimpleInputComponent } from '../simple-input/simple-input.component';
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
    RouterModule,
    SimpleInputComponent,
    ReactiveFormsModule
  ],
  template: `
    <div class="job-list-container">
      <div class="header">
        <h1>Job Applications</h1>
        <button mat-raised-button color="primary" routerLink="/jobs/new">
          <mat-icon>add</mat-icon>
          Add New Job
        </button>
      </div>
      
      <div class="filters">
        <form [formGroup]="filterForm">
          <div class="filter-row">
            <app-simple-input
              label="Search jobs..."
              placeholder="Search by position or company"
              formControlName="searchTerm"
              class="search-field">
            </app-simple-input>
            
            <app-simple-input
              label="Filter by Status"
              placeholder="Select status"
              type="select"
              formControlName="statusFilter"
              [options]="[
                {value: 'All', label: 'All'},
                {value: 'Applied', label: 'Applied'},
                {value: 'Interview', label: 'Interview'},
                {value: 'Offer', label: 'Offer'},
                {value: 'Rejected', label: 'Rejected'}
              ]"
              class="status-filter">
            </app-simple-input>
          </div>
        </form>
      </div>
      
      <div class="job-cards" *ngIf="filteredJobs.length > 0; else noJobs">
        <mat-card class="job-card" *ngFor="let job of filteredJobs">
          <mat-card-header>
            <mat-card-title>{{ job.position }}</mat-card-title>
            <mat-card-subtitle>{{ job.company }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="job-details">
              <p><strong>Location:</strong> {{ job.location }}</p>
              <p><strong>Applied:</strong> {{ job.dateApplied | date }}</p>
              <div class="attachments-info" *ngIf="job.resume || job.coverLetter">
                <div class="attachment-indicators">
                  <mat-chip class="attachment-chip clickable" *ngIf="job.resume" (click)="openAttachment(job.resume!)">
                    <mat-icon>description</mat-icon>
                    Resume
                  </mat-chip>
                  <mat-chip class="attachment-chip clickable" *ngIf="job.coverLetter" (click)="openAttachment(job.coverLetter!)">
                    <mat-icon>article</mat-icon>
                    Cover Letter
                  </mat-chip>
                </div>
              </div>
              <mat-chip-set>
                <mat-chip [class]="'status-' + job.status.toLowerCase()">{{ job.status }}</mat-chip>
              </mat-chip-set>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button [routerLink]="['/jobs', job.id]">
              <mat-icon>visibility</mat-icon>
              View
            </button>
            <button mat-button [routerLink]="['/jobs', job.id, 'edit']">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
      
      <ng-template #noJobs>
        <div class="no-jobs">
          <mat-icon class="large-icon">work_off</mat-icon>
          <h2>No job applications yet</h2>
          <p>Start tracking your job applications by adding your first one!</p>
          <button mat-raised-button color="primary" routerLink="/jobs/new">
            <mat-icon>add</mat-icon>
            Add Your First Job
          </button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .job-list-container {
      padding: 4px;
      max-width: 1000px;
      margin: 0 auto;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .filters {
      margin-bottom: 8px;
    }

    .filter-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .search-field {
      flex: 1;
      min-width: 200px;
    }

    .status-filter {
      min-width: 150px;
    }
    
    .header h1 {
      margin: 0;
      color: #333;
      font-size: 1.4rem;
    }
    
    .header button {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
    }
    
    .job-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 6px;
    }
    
    .job-card {
      transition: transform 0.2s ease-in-out;
    }
    
    .job-card:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 6px rgba(0,0,0,0.1);
    }
    
    .job-details {
      margin: 6px 0;
    }
    
    .job-details p {
      margin: 2px 0;
      color: #666;
      font-size: 14px;
    }
    
    .attachments-info {
      margin: 4px 0;
    }
    
    .attachment-indicators {
      display: flex;
      gap: 3px;
      flex-wrap: wrap;
    }
    
    .attachment-chip {
      background-color: #f5f5f5;
      height: 22px;
      font-size: 11px;
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .attachment-chip.clickable {
      cursor: pointer;
      transition: background-color 0.2s ease;
    }

    .attachment-chip.clickable:hover {
      background-color: #e0e0e0;
    }
    
    .attachment-chip mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    mat-chip-set {
      margin-top: 4px;
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
    
    mat-card-actions {
      display: flex;
      gap: 3px;
      padding: 6px 12px;
    }
    
    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 2px;
      font-size: 13px;
    }
    
    .no-jobs {
      text-align: center;
      padding: 16px 8px;
      color: #666;
    }
    
    .large-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-bottom: 6px;
      color: #ccc;
    }
    
    .no-jobs h2 {
      margin: 6px 0;
      color: #333;
      font-size: 1.2rem;
    }
    
    .no-jobs p {
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .no-jobs button {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    
    @media (max-width: 768px) {
      .job-list-container {
        padding: 4px;
      }
      
      .header {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
        margin-bottom: 6px;
      }
      
      .filter-row {
        flex-direction: column;
        gap: 4px;
        width: 100%;
      }
      
      .search-field,
      .status-filter {
        width: 100%;
        min-width: unset;
      }
      
      .job-cards {
        grid-template-columns: 1fr;
        gap: 6px;
      }
      
      mat-card-actions {
        padding: 4px 8px;
      }
    }
  `]
})
export class JobListComponent implements OnInit, OnDestroy {
  jobs: JobApplication[] = [];
  filteredJobs: JobApplication[] = [];
  filterForm: FormGroup;
  private navigationSubscription: Subscription = new Subscription();
  
  constructor(
    private dbService: IndexedDBService,
    private router: Router,
    private fb: FormBuilder
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
  
  async deleteJob(jobId: string): Promise<void> {
    try {
      await this.dbService.deleteJob(jobId);
      await this.loadJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
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