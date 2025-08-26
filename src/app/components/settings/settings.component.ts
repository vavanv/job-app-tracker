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
import { IndexedDBService } from '../../services/indexeddb.service';

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
    private dbService: IndexedDBService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.initializeForm();
    this.loadSettings();
  }
  
  async ngOnInit(): Promise<void> {
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
  
  private async loadSettings(): Promise<void> {
    try {
      // Load settings from IndexedDB
      await this.loadSettingsFromDB();
    } catch (error) {
      console.error('Error loading settings:', error);
      // Fallback to localStorage if IndexedDB fails
      if (isPlatformBrowser(this.platformId)) {
        const savedSettings = localStorage.getItem('jobTrackerSettings');
        if (savedSettings) {
          try {
            this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            this.updateFormWithSettings();
          } catch (error) {
            console.error('Error loading settings from localStorage:', error);
          }
        }
      }
    }
  }
  
  async saveSettings(): Promise<void> {
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
      
      // Save to IndexedDB
      await this.dbService.saveSettings(this.settings);
      
      // Also save to localStorage as backup
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('jobTrackerSettings', JSON.stringify(this.settings));
      }
      
      this.snackBar.open('Settings saved successfully!', 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } catch (error) {
       console.error('Error saving settings:', error);
       this.snackBar.open('Error saving settings. Please try again.', 'Close', {
         duration: 3000,
         horizontalPosition: 'center',
         verticalPosition: 'top'
       });
     }
  }
  
  async exportData(): Promise<void> {
    try {
      // Export all data from IndexedDB
      const exportData = await this.dbService.exportAllData();
      
      if (!exportData) {
        throw new Error('Failed to export data from database');
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `job-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      this.snackBar.open(`Data exported successfully! (${exportData.jobs?.length || 0} jobs, settings included)`, 'Close', {
        duration: 4000,
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
        reader.onload = async (e: any) => {
          try {
            const data = JSON.parse(e.target.result);
            
            // Validate imported data structure
            if (!this.validateImportData(data)) {
              throw new Error('Invalid data format. Please check the file structure.');
            }
            
            let importedJobsCount = 0;
            let importedSettingsCount = 0;
            
            // Import jobs if present
            if (data.jobs && Array.isArray(data.jobs)) {
              for (const job of data.jobs) {
                // Remove id to avoid conflicts and let IndexedDB assign new ones
                const { id, ...jobData } = job;
                await this.dbService.addJob(jobData);
                importedJobsCount++;
              }
            }
            
            // Import settings if present
            if (data.settings) {
              await this.dbService.saveSettings(data.settings);
              importedSettingsCount = 1;
              // Reload settings in the form
              await this.loadSettingsFromDB();
            }
            
            this.snackBar.open(
              `Data imported successfully! (${importedJobsCount} jobs, ${importedSettingsCount > 0 ? 'settings included' : 'no settings'})`,
              'Close',
              {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              }
            );
          } catch (error) {
            console.error('Error importing data:', error);
            this.snackBar.open(
              error instanceof Error ? error.message : 'Error importing data. Please check the file format.',
              'Close',
              {
                duration: 4000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
              }
            );
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
  
  async clearAllData(): Promise<void> {
    if (confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      try {
        // Clear all jobs from IndexedDB
        const allJobs = await this.dbService.getAllJobs();
        for (const job of allJobs) {
          if (job.id) {
            await this.dbService.deleteJob(job.id.toString());
          }
        }
        
        // Clear settings from IndexedDB and localStorage
        if (isPlatformBrowser(this.platformId)) {
          localStorage.removeItem('jobTrackerSettings');
        }
        
        // Reset settings to default
        this.settings = {
          profile: { fullName: '', email: '', phone: '', linkedin: '' },
          preferences: { jobType: ['full-time'], minSalary: 0, maxSalary: 0, locations: ['remote'], skills: '' },
          notifications: { email: true, followUpReminders: true, interviewReminders: true, weeklySummary: false, followUpDays: '7' },
          display: { theme: 'light', itemsPerPage: '25', compactView: false, showSalary: true }
        };
        
        // Reset form
        this.settingsForm.reset();
        this.initializeForm();
        
        this.snackBar.open(`All data cleared successfully! (${allJobs.length} jobs deleted)`, 'Close', {
          duration: 4000,
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
  
  private validateImportData(data: any): boolean {
    // Check if data has the expected structure
    if (!data || typeof data !== 'object') {
      return false;
    }
    
    // Check if it has either jobs or settings
    const hasJobs = data.jobs && Array.isArray(data.jobs);
    const hasSettings = data.settings && typeof data.settings === 'object';
    
    if (!hasJobs && !hasSettings) {
      return false;
    }
    
    // Validate jobs structure if present
    if (hasJobs) {
      for (const job of data.jobs) {
        if (!job.company || !job.position || !job.status || !job.dateApplied) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  private async loadSettingsFromDB(): Promise<void> {
    try {
      const dbSettings = await this.dbService.getSettings();
      if (dbSettings) {
        this.settings = { ...this.settings, ...dbSettings };
        this.updateFormWithSettings();
      }
    } catch (error) {
      console.error('Error loading settings from DB:', error);
    }
  }

  private updateFormWithSettings(): void {
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
  }
}