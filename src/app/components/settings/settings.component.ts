import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SimpleInputComponent } from '../simple-input/simple-input.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSnackBarModule,
    SimpleInputComponent
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
            <form [formGroup]="settingsForm">
              <div class="form-row">
                <app-simple-input
                  label="Full Name"
                  type="text"
                  placeholder="Enter your full name"
                  formControlName="fullName"
                  class="full-width">
                </app-simple-input>
              </div>
              
              <div class="form-row">
                <app-simple-input
                  label="Email"
                  type="email"
                  placeholder="Enter your email"
                  formControlName="email"
                  class="full-width">
                </app-simple-input>
              </div>
              
              <div class="form-row">
                <app-simple-input
                  label="Phone"
                  type="text"
                  placeholder="Enter your phone number"
                  formControlName="phone"
                  class="full-width">
                </app-simple-input>
              </div>
              
              <div class="form-row">
                <app-simple-input
                  label="LinkedIn Profile"
                  type="text"
                  placeholder="https://linkedin.com/in/yourprofile"
                  formControlName="linkedin"
                  class="full-width">
                </app-simple-input>
              </div>
            </form>
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
            <form [formGroup]="settingsForm">
              <div class="form-row">
                <app-simple-input
                  label="Preferred Job Type"
                  type="select"
                  formControlName="jobType"
                  [options]="jobTypeOptions"
                  class="full-width">
                </app-simple-input>
              </div>
              
              <div class="form-row">
                <app-simple-input
                  label="Minimum Salary (USD)"
                  type="number"
                  placeholder="0"
                  formControlName="minSalary"
                  class="half-width">
                </app-simple-input>
                
                <app-simple-input
                  label="Maximum Salary (USD)"
                  type="number"
                  placeholder="0"
                  formControlName="maxSalary"
                  class="half-width">
                </app-simple-input>
              </div>
              
              <div class="form-row">
                <app-simple-input
                  label="Preferred Locations"
                  type="select"
                  formControlName="locations"
                  [options]="locationOptions"
                  class="full-width">
                </app-simple-input>
              </div>
              
              <div class="form-row">
                <app-simple-input
                  label="Skills/Technologies"
                  type="text"
                  placeholder="Angular, React, Node.js, Python (comma-separated)"
                  formControlName="skills"
                  class="full-width">
                </app-simple-input>
              </div>
            </form>
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
            
            <form [formGroup]="settingsForm">
              <div class="form-row" *ngIf="settingsForm.get('followUpReminders')?.value">
                <app-simple-input
                  label="Follow-up Reminder Days"
                  type="select"
                  formControlName="followUpDays"
                  [options]="followUpDaysOptions"
                  class="full-width">
                </app-simple-input>
              </div>
            </form>
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
            <form [formGroup]="settingsForm">
              <div class="form-row">
                <app-simple-input
                  label="Theme"
                  type="select"
                  formControlName="theme"
                  [options]="themeOptions"
                  class="full-width">
                </app-simple-input>
              </div>
              
              <div class="form-row">
                <app-simple-input
                  label="Items per Page"
                  type="select"
                  formControlName="itemsPerPage"
                  [options]="itemsPerPageOptions"
                  class="full-width">
                </app-simple-input>
              </div>
            </form>
            
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
export class SettingsComponent implements OnInit {
  settingsForm!: FormGroup;
  
  jobTypeOptions = [
    { value: 'full-time', label: 'Full Time' },
    { value: 'part-time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'internship', label: 'Internship' }
  ];
  
  locationOptions = [
    { value: 'remote', label: 'Remote' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'on-site', label: 'On-site' },
    { value: 'new-york', label: 'New York' },
    { value: 'san-francisco', label: 'San Francisco' },
    { value: 'los-angeles', label: 'Los Angeles' },
    { value: 'chicago', label: 'Chicago' },
    { value: 'boston', label: 'Boston' },
    { value: 'seattle', label: 'Seattle' },
    { value: 'austin', label: 'Austin' }
  ];
  
  followUpDaysOptions = [
    { value: '3', label: '3 days' },
    { value: '7', label: '1 week' },
    { value: '14', label: '2 weeks' },
    { value: '21', label: '3 weeks' },
    { value: '30', label: '1 month' }
  ];
  
  themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'auto', label: 'Auto (System)' }
  ];
  
  itemsPerPageOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
    { value: '100', label: '100' }
  ];
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
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeForm();
    this.loadSettings();
  }
  
  ngOnInit(): void {
    // Component initialization
  }
  
  private initializeForm(): void {
    this.settingsForm = this.fb.group({
      fullName: [''],
      email: [''],
      phone: [''],
      linkedin: [''],
      jobType: ['full-time'],
      minSalary: [0],
      maxSalary: [0],
      locations: ['remote'],
      skills: [''],
      followUpReminders: [true],
      followUpDays: ['7'],
      theme: ['light'],
      itemsPerPage: ['25']
    });
  }
  
  private loadSettings(): void {
    // Only access localStorage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      // TODO: Load settings from IndexedDB
      const savedSettings = localStorage.getItem('jobTrackerSettings');
      if (savedSettings) {
        try {
          this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
          // Update form with loaded settings
        this.settingsForm.patchValue({
          fullName: this.settings.profile.fullName,
          email: this.settings.profile.email,
          phone: this.settings.profile.phone,
          linkedin: this.settings.profile.linkedin,
          jobType: this.settings.preferences.jobType,
          minSalary: this.settings.preferences.minSalary,
          maxSalary: this.settings.preferences.maxSalary,
          locations: this.settings.preferences.locations,
          skills: this.settings.preferences.skills,
          followUpReminders: this.settings.notifications.followUpReminders,
          followUpDays: this.settings.notifications.followUpDays,
          theme: this.settings.display.theme,
          itemsPerPage: this.settings.display.itemsPerPage
        });
        } catch (error) {
          console.error('Error loading settings:', error);
        }
      }
    }
  }
  
  saveSettings(): void {
    try {
      // Update settings object with form values
      const formValues = this.settingsForm.value;
      this.settings.profile.fullName = formValues.fullName;
      this.settings.profile.email = formValues.email;
      this.settings.profile.phone = formValues.phone;
      this.settings.profile.linkedin = formValues.linkedin;
      this.settings.preferences.jobType = formValues.jobType;
      this.settings.preferences.minSalary = formValues.minSalary;
      this.settings.preferences.maxSalary = formValues.maxSalary;
      this.settings.preferences.locations = formValues.locations;
      this.settings.preferences.skills = formValues.skills;
      this.settings.notifications.followUpReminders = formValues.followUpReminders;
      this.settings.notifications.followUpDays = formValues.followUpDays;
      this.settings.display.theme = formValues.theme;
      this.settings.display.itemsPerPage = formValues.itemsPerPage;
      
      // Only access localStorage in browser environment
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('jobTrackerSettings', JSON.stringify(this.settings));
        this.snackBar.open('Settings saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    } catch (error) {
       console.error('Error saving settings:', error);
       this.snackBar.open('Error saving settings. Please try again.', 'Close', {
         duration: 3000,
         horizontalPosition: 'center',
         verticalPosition: 'top'
       });
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