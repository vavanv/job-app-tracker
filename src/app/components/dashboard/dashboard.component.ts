import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    RouterModule
  ],
  template: `
    <div class="dashboard-container">
      <h1>Job Application Dashboard</h1>
      
      <div class="stats-grid">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Total Applications</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">0</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Pending</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">0</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Interviews</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">0</div>
          </mat-card-content>
        </mat-card>
        
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Offers</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">0</div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <button mat-raised-button color="primary" routerLink="/jobs">
            <mat-icon class="material-icons">list</mat-icon>
            <span>View All Jobs</span>
          </button>
          <button mat-raised-button routerLink="/jobs/new">
            <mat-icon class="material-icons">add</mat-icon>
            <span>Add New Job</span>
          </button>
          <button mat-raised-button routerLink="/analytics">
            <mat-icon class="material-icons">analytics</mat-icon>
            <span>View Analytics</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    h1 {
      margin-bottom: 32px;
      color: #333;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .stat-card {
      text-align: center;
    }
    
    .stat-number {
      font-size: 2.5rem;
      font-weight: bold;
      color: #3f51b5;
      margin-top: 8px;
    }
    
    .quick-actions h2 {
      margin-bottom: 16px;
      color: #333;
    }
    
    .action-buttons {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }
    
    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    @media (max-width: 768px) {
      .dashboard-container {
        padding: 16px;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .action-buttons {
        flex-direction: column;
      }
      
      .action-buttons button {
        width: 100%;
        justify-content: center;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Dashboard component loaded successfully
  }
}