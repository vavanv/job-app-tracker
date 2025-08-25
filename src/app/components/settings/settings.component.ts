import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="settings-container">
      <h1>Settings</h1>
      
      <div class="settings-sections">
        <!-- Profile Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>person</mat-icon>
              Profile Settings
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput [(ngModel)]="settings.profile.fullName" placeholder="Enter your full name">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Email</mat-label>
                <input matInput type="email" [(ngModel)]="settings.profile.email" placeholder="Enter your email">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Phone</mat-label>
                <input matInput [(ngModel)]="settings.profile.phone" placeholder="Enter your phone number">
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>LinkedIn Profile</mat-label>
                <input matInput [(ngModel)]="settings.profile.linkedin" placeholder="https://linkedin.com/in/yourprofile">
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
        
        <!-- Application Preferences -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>work</mat-icon>
              Application Preferences
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Preferred Job Type</mat-label>
                <mat-select [(ngModel)]="settings.preferences.jobType" multiple>
                  <mat-option value="full-time">Full-time</mat-option>
                  <mat-option value="part-time">Part-time</mat-option>
                  <mat-option value="contract">Contract</mat-option>
                  <mat-option value="internship">Internship</mat-option>
                  <mat-option value="freelance">Freelance</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Minimum Salary</mat-label>
                <input matInput type="number" [(ngModel)]="settings.preferences.minSalary" placeholder="0">
                <span matSuffix>USD</span>
              </mat-form-field>
              
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Maximum Salary</mat-label>
                <input matInput type="number" [(ngModel)]="settings.preferences.maxSalary" placeholder="0">
                <span matSuffix>USD</span>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Preferred Locations</mat-label>
                <mat-select [(ngModel)]="settings.preferences.locations" multiple>
                  <mat-option value="remote">Remote</mat-option>
                  <mat-option value="new-york">New York, NY</mat-option>
                  <mat-option value="san-francisco">San Francisco, CA</mat-option>
                  <mat-option value="seattle">Seattle, WA</mat-option>
                  <mat-option value="austin">Austin, TX</mat-option>
                  <mat-option value="chicago">Chicago, IL</mat-option>
                  <mat-option value="boston">Boston, MA</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Skills/Technologies</mat-label>
                <input matInput [(ngModel)]="settings.preferences.skills" 
                       placeholder="Angular, React, Node.js, Python (comma-separated)">
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
        
        <!-- Notification Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>notifications</mat-icon>
              Notification Settings
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="toggle-row">
              <div class="toggle-info">
                <strong>Email Notifications</strong>
                <p>Receive email updates about your applications</p>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.notifications.email"></mat-slide-toggle>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="toggle-row">
              <div class="toggle-info">
                <strong>Follow-up Reminders</strong>
                <p>Get reminded to follow up on applications</p>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.notifications.followUpReminders"></mat-slide-toggle>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="toggle-row">
              <div class="toggle-info">
                <strong>Interview Reminders</strong>
                <p>Receive reminders before scheduled interviews</p>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.notifications.interviewReminders"></mat-slide-toggle>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="toggle-row">
              <div class="toggle-info">
                <strong>Weekly Summary</strong>
                <p>Get a weekly summary of your job search progress</p>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.notifications.weeklySummary"></mat-slide-toggle>
            </div>
            
            <div class="form-row" *ngIf="settings.notifications.followUpReminders">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Follow-up Reminder Days</mat-label>
                <mat-select [(ngModel)]="settings.notifications.followUpDays">
                  <mat-option value="3">3 days</mat-option>
                  <mat-option value="7">1 week</mat-option>
                  <mat-option value="14">2 weeks</mat-option>
                  <mat-option value="30">1 month</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </mat-card-content>
        </mat-card>
        
        <!-- Display Settings -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>display_settings</mat-icon>
              Display Settings
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Theme</mat-label>
                <mat-select [(ngModel)]="settings.display.theme">
                  <mat-option value="light">Light</mat-option>
                  <mat-option value="dark">Dark</mat-option>
                  <mat-option value="auto">Auto (System)</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Items per Page</mat-label>
                <mat-select [(ngModel)]="settings.display.itemsPerPage">
                  <mat-option value="10">10</mat-option>
                  <mat-option value="25">25</mat-option>
                  <mat-option value="50">50</mat-option>
                  <mat-option value="100">100</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
            
            <div class="toggle-row">
              <div class="toggle-info">
                <strong>Compact View</strong>
                <p>Show more items in less space</p>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.display.compactView"></mat-slide-toggle>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="toggle-row">
              <div class="toggle-info">
                <strong>Show Salary Information</strong>
                <p>Display salary ranges in job listings</p>
              </div>
              <mat-slide-toggle [(ngModel)]="settings.display.showSalary"></mat-slide-toggle>
            </div>
          </mat-card-content>
        </mat-card>
        
        <!-- Data Management -->
        <mat-card class="settings-card">
          <mat-card-header>
            <mat-card-title>
              <mat-icon>storage</mat-icon>
              Data Management
            </mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="data-actions">
              <div class="action-item">
                <div class="action-info">
                  <strong>Export Data</strong>
                  <p>Download all your job application data as JSON</p>
                </div>
                <button mat-raised-button color="primary" (click)="exportData()">
                  <mat-icon>download</mat-icon>
                  Export
                </button>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="action-item">
                <div class="action-info">
                  <strong>Import Data</strong>
                  <p>Import job application data from a JSON file</p>
                </div>
                <button mat-raised-button (click)="importData()">
                  <mat-icon>upload</mat-icon>
                  Import
                </button>
              </div>
              
              <mat-divider></mat-divider>
              
              <div class="action-item">
                <div class="action-info">
                  <strong>Clear All Data</strong>
                  <p class="warning-text">Permanently delete all job applications and settings</p>
                </div>
                <button mat-raised-button color="warn" (click)="clearAllData()">
                  <mat-icon>delete_forever</mat-icon>
                  Clear All
                </button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
      
      <!-- Save Button -->
      <div class="save-section">
        <button mat-raised-button color="primary" size="large" (click)="saveSettings()">
          <mat-icon>save</mat-icon>
          Save Settings
        </button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 12px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    h1 {
      margin-bottom: 20px;
      color: #333;
    }
    
    .settings-sections {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 20px;
    }
    
    .settings-card {
      padding: 12px;
    }
    
    .settings-card mat-card-title {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #333;
    }
    
    .form-row {
      display: flex;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .form-row:last-child {
      margin-bottom: 0;
    }
    
    .full-width {
      width: 100%;
    }
    
    .half-width {
      width: calc(50% - 6px);
    }
    
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
    }
    
    .toggle-info {
      flex: 1;
    }
    
    .toggle-info strong {
      display: block;
      margin-bottom: 4px;
      color: #333;
    }
    
    .toggle-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.4;
    }
    
    .warning-text {
      color: #f44336 !important;
    }
    
    .data-actions {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    
    .action-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
    }
    
    .action-info {
      flex: 1;
    }
    
    .action-info strong {
      display: block;
      margin-bottom: 3px;
      color: #333;
    }
    
    .action-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
      line-height: 1.3;
    }
    
    .save-section {
      display: flex;
      justify-content: center;
      padding: 16px 0;
    }
    
    .save-section button {
      padding: 10px 24px;
      font-size: 1rem;
    }
    
    mat-divider {
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .settings-container {
        padding: 8px;
      }
      
      .form-row {
        flex-direction: column;
        gap: 0;
        margin-bottom: 8px;
      }
      
      .half-width {
        width: 100%;
      }
      
      .toggle-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 0;
      }
      
      .action-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        padding: 8px 0;
      }
    }
  `]
})
export class SettingsComponent {
  settings = {
    profile: {
      fullName: '',
      email: '',
      phone: '',
      linkedin: ''
    },
    preferences: {
      jobType: ['full-time'],
      minSalary: 0,
      maxSalary: 0,
      locations: ['remote'],
      skills: ''
    },
    notifications: {
      email: true,
      followUpReminders: true,
      interviewReminders: true,
      weeklySummary: false,
      followUpDays: '7'
    },
    display: {
      theme: 'light',
      itemsPerPage: '25',
      compactView: false,
      showSalary: true
    }
  };
  
  constructor(
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loadSettings();
  }
  
  private loadSettings(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // TODO: Load settings from IndexedDB
      const savedSettings = localStorage.getItem('jobTrackerSettings');
      if (savedSettings) {
        try {
          this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
    }
  }
  
  saveSettings(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      try {
        // TODO: Save to IndexedDB instead of localStorage
        localStorage.setItem('jobTrackerSettings', JSON.stringify(this.settings));
        this.snackBar.open('Settings saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      } catch (error) {
        console.error('Error saving settings:', error);
        this.snackBar.open('Error saving settings. Please try again.', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
      }
    } else {
      console.log('Settings save skipped during SSR');
    }
  }
  
  exportData(): void {
    try {
      // TODO: Export data from IndexedDB
      const data = {
        settings: this.settings,
        jobs: [], // TODO: Get jobs from IndexedDB
        exportDate: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      this.snackBar.open('Data exported successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      this.snackBar.open('Error exporting data. Please try again.', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }
  
  importData(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          try {
            const data = JSON.parse(e.target.result);
            // TODO: Import data to IndexedDB
            if (data.settings) {
              this.settings = { ...this.settings, ...data.settings };
              this.saveSettings();
            }
            this.snackBar.open('Data imported successfully!', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          } catch (error) {
            console.error('Error importing data:', error);
            this.snackBar.open('Error importing data. Please check the file format.', 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
  
  clearAllData(): void {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      // Only access localStorage in browser environment
      if (isPlatformBrowser(this.platformId)) {
        try {
          // TODO: Clear IndexedDB data
          localStorage.removeItem('jobTrackerSettings');
          this.settings = {
            profile: { fullName: '', email: '', phone: '', linkedin: '' },
            preferences: { jobType: ['full-time'], minSalary: 0, maxSalary: 0, locations: ['remote'], skills: '' },
            notifications: { email: true, followUpReminders: true, interviewReminders: true, weeklySummary: false, followUpDays: '7' },
            display: { theme: 'light', itemsPerPage: '25', compactView: false, showSalary: true }
          };
          
          this.snackBar.open('All data cleared successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        } catch (error) {
          console.error('Error clearing data:', error);
          this.snackBar.open('Error clearing data. Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }
      }
    }
  }
}