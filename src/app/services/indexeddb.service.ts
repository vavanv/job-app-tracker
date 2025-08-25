import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  data: string; // base64 encoded file data
  uploadedAt: Date;
}

export interface JobApplication {
  id?: number;
  company: string;
  position: string;
  location: string;
  jobType?: 'Full-time' | 'Part-time' | 'Contract' | 'Internship' | 'Freelance';
  status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
  dateApplied: Date;
  url?: string;
  salaryRange?: string;
  notes?: string;
  resume?: FileAttachment;
  coverLetter?: FileAttachment;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSettings {
  id?: number;
  profile: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
  };
  preferences: {
    jobType: string[];
    minSalary: number;
    maxSalary: number;
    locations: string[];
    skills: string;
  };
  notifications: {
    email: boolean;
    followUpReminders: boolean;
    interviewReminders: boolean;
    weeklySummary: boolean;
    followUpDays: string;
  };
  display: {
    theme: string;
    itemsPerPage: string;
    compactView: boolean;
    showSalary: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface JobTrackerDB extends DBSchema {
  jobs: {
    key: number;
    value: JobApplication;
    indexes: {
      'by-company': string;
      'by-status': string;
      'by-date': string;
      'by-priority': string;
    };
  };
  settings: {
    key: number;
    value: UserSettings;
  };
}

@Injectable({
  providedIn: 'root'
})
export class IndexedDBService {
  private db: IDBPDatabase<JobTrackerDB> | null = null;
  private readonly DB_NAME = 'JobTrackerDB';
  private readonly DB_VERSION = 1;
  
  // Observable streams for reactive updates
  private jobsSubject = new BehaviorSubject<JobApplication[]>([]);
  private settingsSubject = new BehaviorSubject<UserSettings | null>(null);
  
  public jobs$ = this.jobsSubject.asObservable();
  public settings$ = this.settingsSubject.asObservable();
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initDB().catch(error => {
        console.error('Failed to initialize IndexedDB:', error);
      });
    }
  }
  
  private async initDB(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('IndexedDB not available in server environment');
      return;
    }
    
    try {
      this.db = await openDB<JobTrackerDB>(this.DB_NAME, this.DB_VERSION, {
        upgrade(db) {
          // Create jobs store
          if (!db.objectStoreNames.contains('jobs')) {
            const jobStore = db.createObjectStore('jobs', {
              keyPath: 'id',
              autoIncrement: true
            });
            
            // Create indexes for efficient querying
            jobStore.createIndex('by-company', 'company');
            jobStore.createIndex('by-status', 'status');
            jobStore.createIndex('by-date', 'dateApplied');
            jobStore.createIndex('by-priority', 'priority');
          }
          
          // Create settings store
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', {
              keyPath: 'id',
              autoIncrement: true
            });
          }
        }
      });
      
      // Load initial data
      await this.loadJobs();
      await this.loadSettings();
      await this.seedSampleData();
      
      console.log('IndexedDB initialized successfully');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }

  private async seedSampleData(): Promise<void> {
    try {
      const existingJobs = await this.getAllJobs();
      if (existingJobs.length === 0) {
        // Add sample jobs for demonstration
        const sampleJobs = [
          {
            position: 'Frontend Developer',
            company: 'TechCorp Inc.',
            location: 'San Francisco, CA',
            jobType: 'Full-time' as const,
            status: 'Applied' as const,
            dateApplied: new Date('2024-01-15'),
            url: 'https://techcorp.com/careers/frontend-developer',
            salaryRange: '$80,000 - $120,000',
            notes: 'Applied through company career page. Waiting for response.'
          },
          {
            position: 'Full Stack Engineer',
            company: 'StartupXYZ',
            location: 'Remote',
            jobType: 'Full-time' as const,
            status: 'Interview' as const,
            dateApplied: new Date('2024-01-10'),
            url: 'https://linkedin.com/jobs/startupxyz-fullstack',
            salaryRange: '$90,000 - $130,000',
            notes: 'First interview scheduled for next week.'
          },
          {
            position: 'Software Developer',
            company: 'BigTech Solutions',
            location: 'New York, NY',
            jobType: 'Full-time' as const,
            status: 'Rejected' as const,
            dateApplied: new Date('2024-01-05'),
            url: 'https://bigtech.com/careers/software-developer',
            salaryRange: '$100,000 - $140,000',
            notes: 'Position filled by internal candidate.'
          }
        ];

        for (const job of sampleJobs) {
          await this.addJob(job);
        }
        console.log('Sample job data added successfully');
      }
    } catch (error) {
      console.error('Error seeding sample data:', error);
    }
  }
  
  // Job Application Methods
  async addJob(job: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>): Promise<JobApplication | null> {
    if (!isPlatformBrowser(this.platformId) || !this.db) {
      console.error('Database not initialized or not in browser');
      return null;
    }
    
    try {
      const now = new Date();
      const newJob: JobApplication = {
        ...job,
        createdAt: now,
        updatedAt: now
      };
      
      const id = await this.db.add('jobs', newJob);
      const savedJob = { ...newJob, id };
      
      await this.loadJobs(); // Refresh the jobs list
      return savedJob;
    } catch (error) {
      console.error('Error adding job:', error);
      return null;
    }
  }
  
  async updateJob(id: string, updates: Partial<JobApplication>): Promise<JobApplication | null> {
    const numericId = parseInt(id, 10);
    if (!isPlatformBrowser(this.platformId) || !this.db) {
      console.error('Database not initialized or not in browser');
      return null;
    }
    
    try {
      const existingJob = await this.db.get('jobs', numericId);
      if (!existingJob) {
        console.error('Job not found');
        return null;
      }
      
      const updatedJob: JobApplication = {
        ...existingJob,
        ...updates,
        id: numericId,
        updatedAt: new Date()
      };
      
      await this.db.put('jobs', updatedJob);
      await this.loadJobs(); // Refresh the jobs list
      return updatedJob;
    } catch (error) {
      console.error('Error updating job:', error);
      return null;
    }
  }
  
  async deleteJob(id: string): Promise<boolean> {
    const numericId = parseInt(id, 10);
    if (!isPlatformBrowser(this.platformId) || !this.db) {
      console.error('Database not initialized or not in browser');
      return false;
    }
    
    try {
      await this.db.delete('jobs', numericId);
      await this.loadJobs(); // Refresh the jobs list
      return true;
    } catch (error) {
      console.error('Error deleting job:', error);
      return false;
    }
  }
  
  async getJob(id: string): Promise<JobApplication | null> {
    const numericId = parseInt(id, 10);
    if (!isPlatformBrowser(this.platformId) || !this.db) {
      console.error('Database not initialized or not in browser');
      return null;
    }
    
    try {
      const job = await this.db.get('jobs', numericId);
      return job || null;
    } catch (error) {
      console.error('Error getting job:', error);
      return null;
    }
  }
  
  async getAllJobs(): Promise<JobApplication[]> {
    if (!isPlatformBrowser(this.platformId) || !this.db) {
      console.error('Database not initialized or not in browser');
      return [];
    }
    
    try {
      return await this.db.getAll('jobs');
    } catch (error) {
      console.error('Error getting all jobs:', error);
      return [];
    }
  }
  
  async getJobsByStatus(status: JobApplication['status']): Promise<JobApplication[]> {
    if (!this.db) {
      console.error('Database not initialized');
      return [];
    }
    
    try {
      return await this.db.getAllFromIndex('jobs', 'by-status', status);
    } catch (error) {
      console.error('Error getting jobs by status:', error);
      return [];
    }
  }
  
  async getJobsByCompany(company: string): Promise<JobApplication[]> {
    if (!this.db) {
      console.error('Database not initialized');
      return [];
    }
    
    try {
      return await this.db.getAllFromIndex('jobs', 'by-company', company);
    } catch (error) {
      console.error('Error getting jobs by company:', error);
      return [];
    }
  }
  
  async searchJobs(query: string): Promise<JobApplication[]> {
    if (!this.db) {
      console.error('Database not initialized');
      return [];
    }
    
    try {
      const allJobs = await this.getAllJobs();
      const lowercaseQuery = query.toLowerCase();
      
      return allJobs.filter(job => 
        job.company.toLowerCase().includes(lowercaseQuery) ||
        job.position.toLowerCase().includes(lowercaseQuery) ||
        job.location.toLowerCase().includes(lowercaseQuery) ||
        (job.notes && job.notes.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Error searching jobs:', error);
      return [];
    }
  }
  
  private async loadJobs(): Promise<void> {
    try {
      const jobs = await this.getAllJobs();
      this.jobsSubject.next(jobs);
    } catch (error) {
      console.error('Error loading jobs:', error);
    }
  }
  
  // Settings Methods
  async saveSettings(settings: Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserSettings | null> {
    if (!this.db) {
      console.error('Database not initialized');
      return null;
    }
    
    try {
      const now = new Date().toISOString();
      
      // Check if settings already exist
      const existingSettings = await this.db.getAll('settings');
      
      if (existingSettings.length > 0) {
        // Update existing settings
        const updatedSettings: UserSettings = {
          ...existingSettings[0],
          ...settings,
          updatedAt: now
        };
        
        await this.db.put('settings', updatedSettings);
        this.settingsSubject.next(updatedSettings);
        return updatedSettings;
      } else {
        // Create new settings
        const newSettings: UserSettings = {
          ...settings,
          createdAt: now,
          updatedAt: now
        };
        
        const id = await this.db.add('settings', newSettings);
        const savedSettings = { ...newSettings, id };
        this.settingsSubject.next(savedSettings);
        return savedSettings;
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      return null;
    }
  }
  
  async getSettings(): Promise<UserSettings | null> {
    if (!this.db) {
      console.error('Database not initialized');
      return null;
    }
    
    try {
      const settings = await this.db.getAll('settings');
      return settings.length > 0 ? settings[0] : null;
    } catch (error) {
      console.error('Error getting settings:', error);
      return null;
    }
  }
  
  private async loadSettings(): Promise<void> {
    try {
      const settings = await this.getSettings();
      this.settingsSubject.next(settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }
  
  // Analytics Methods
  async getAnalytics(): Promise<any> {
    if (!this.db) {
      console.error('Database not initialized');
      return null;
    }
    
    try {
      const jobs = await this.getAllJobs();
      const totalApplications = jobs.length;
      
      if (totalApplications === 0) {
        return {
          totalApplications: 0,
          thisMonthApplications: 0,
          responseRate: 0,
          interviewRate: 0,
          offerRate: 0,
          statusBreakdown: [],
          monthlyData: [],
          topCompanies: [],
          jobTypes: [],
          insights: []
        };
      }
      
      // Calculate status breakdown
      const statusCounts = jobs.reduce((acc, job) => {
        acc[job.status] = (acc[job.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const statusBreakdown = Object.entries(statusCounts).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        count,
        percentage: Math.round((count / totalApplications) * 100)
      }));
      
      // Calculate rates
      const responseRate = Math.round(((statusCounts['interview'] || 0) + (statusCounts['offer'] || 0)) / totalApplications * 100);
      const interviewRate = Math.round((statusCounts['interview'] || 0) / totalApplications * 100);
      const offerRate = Math.round((statusCounts['offer'] || 0) / totalApplications * 100);
      
      // Calculate this month's applications
       const currentDate = new Date();
       const currentYear = currentDate.getFullYear();
       const currentMonth = currentDate.getMonth();
       const thisMonthJobs = jobs.filter(job => {
         const jobDate = new Date(job.dateApplied);
         return jobDate.getFullYear() === currentYear && jobDate.getMonth() === currentMonth;
       }).length;
      
      // Calculate monthly data (last 6 months)
      const monthlyData = [];
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthStr = date.toISOString().slice(0, 7);
        const monthName = date.toLocaleDateString('en-US', { month: 'short' });
        const monthJobs = jobs.filter(job => {
           const jobDate = new Date(job.dateApplied);
           return jobDate.toISOString().startsWith(monthStr);
         }).length;
         monthlyData.push({ month: monthName, count: monthJobs });
      }
      
      // Calculate top companies
      const companyCounts = jobs.reduce((acc, job) => {
        acc[job.company] = (acc[job.company] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      const topCompanies = Object.entries(companyCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, count]) => ({
           name,
           count: count as number,
           percentage: Math.round(((count as number) / totalApplications) * 100)
         }));
      
      // Calculate job types
      const jobTypeStats = jobs.reduce((acc: any, job) => {
         const jobType = job.jobType || 'Full-time';
         acc[jobType] = (acc[jobType] || 0) + 1;
         return acc;
       }, {} as Record<string, number>);
       
       const jobTypes = Object.entries(jobTypeStats).map(([name, count]) => ({
         name: name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' '),
         count: count as number,
         percentage: Math.round(((count as number) / totalApplications) * 100)
        }));
      
      // Generate insights
      const insights = [];
      
      if (responseRate < 20) {
        insights.push({
          type: 'warning',
          icon: 'warning',
          title: 'Low Response Rate',
          description: 'Consider improving your resume or targeting more relevant positions.'
        });
      }
      
      if (totalApplications > 50 && offerRate > 10) {
        insights.push({
          type: 'positive',
          icon: 'trending_up',
          title: 'Great Offer Rate',
          description: 'You\'re doing well! Your offer rate is above average.'
        });
      }
      
      if (thisMonthJobs > 10) {
        insights.push({
          type: 'info',
          icon: 'info',
          title: 'Active Job Search',
          description: `You've applied to ${thisMonthJobs} positions this month. Keep up the momentum!`
        });
      }
      
      return {
        totalApplications,
        thisMonthApplications: thisMonthJobs,
        responseRate,
        interviewRate,
        offerRate,
        statusBreakdown,
        monthlyData,
        topCompanies,
        jobTypes,
        insights
      };
    } catch (error) {
      console.error('Error calculating analytics:', error);
      return null;
    }
  }
  
  // Data Management Methods
  async exportAllData(): Promise<any> {
    if (!this.db) {
      console.error('Database not initialized');
      return null;
    }
    
    try {
      const jobs = await this.getAllJobs();
      const settings = await this.getSettings();
      
      return {
        jobs,
        settings,
        exportDate: new Date().toISOString(),
        version: this.DB_VERSION
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return null;
    }
  }
  
  async importData(data: any): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized');
      return false;
    }
    
    try {
      const tx = this.db.transaction(['jobs', 'settings'], 'readwrite');
      
      // Clear existing data
      await tx.objectStore('jobs').clear();
      await tx.objectStore('settings').clear();
      
      // Import jobs
      if (data.jobs && Array.isArray(data.jobs)) {
        for (const job of data.jobs) {
          await tx.objectStore('jobs').add(job);
        }
      }
      
      // Import settings
      if (data.settings) {
        await tx.objectStore('settings').add(data.settings);
      }
      
      await tx.done;
      
      // Refresh data
      await this.loadJobs();
      await this.loadSettings();
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
  
  async clearAllData(): Promise<boolean> {
    if (!this.db) {
      console.error('Database not initialized');
      return false;
    }
    
    try {
      const tx = this.db.transaction(['jobs', 'settings'], 'readwrite');
      await tx.objectStore('jobs').clear();
      await tx.objectStore('settings').clear();
      await tx.done;
      
      // Refresh data
      this.jobsSubject.next([]);
      this.settingsSubject.next(null);
      
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }
}