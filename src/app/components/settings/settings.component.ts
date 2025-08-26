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
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
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