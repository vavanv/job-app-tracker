import { Component, OnInit } from '@angular/core';
import { IndexedDBService, JobApplication } from '../../services/indexeddb.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatChipsModule,
  ],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css'],
})
export class AnalyticsComponent implements OnInit {
  jobs: JobApplication[] = [];
  analytics = {
    totalApplications: 0,
    thisMonthApplications: 0,
    responseRate: 0,
    interviewRate: 0,
    offerRate: 0,
    statusBreakdown: [
      { name: 'Applied', count: 0, percentage: 0 },
      { name: 'Interview', count: 0, percentage: 0 },
      { name: 'Offer', count: 0, percentage: 0 },
      { name: 'Rejected', count: 0, percentage: 0 },
    ],
    monthlyData: [
      { month: 'Jan', count: 0 },
      { month: 'Feb', count: 0 },
      { month: 'Mar', count: 0 },
      { month: 'Apr', count: 0 },
      { month: 'May', count: 0 },
      { month: 'Jun', count: 0 },
    ],
    topCompanies: [] as Array<{name: string, count: number, percentage: number}>,
    jobTypes: [
      { name: 'Full-time', count: 0, percentage: 0 },
      { name: 'Part-time', count: 0, percentage: 0 },
      { name: 'Contract', count: 0, percentage: 0 },
      { name: 'Internship', count: 0, percentage: 0 },
    ],
    insights: [
      {
        type: 'info',
        icon: 'info',
        title: 'Getting Started',
        description:
          'Start adding job applications to see detailed analytics and insights about your job search progress.',
      },
    ],
  };

  constructor(private dbService: IndexedDBService) {}
  
  ngOnInit(): void {
    this.loadAnalytics();
  }

  private async loadAnalytics(): Promise<void> {
    try {
      this.jobs = await this.dbService.getAllJobs();
      this.calculateAnalytics();
    } catch (error) {
      console.error('Error loading analytics:', error);
      // Set default values on error
      this.analytics.topCompanies = [];
    }
  }
  
  private calculateAnalytics(): void {
    this.analytics.totalApplications = this.jobs.length;
    
    // Calculate this month's applications
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    this.analytics.thisMonthApplications = this.jobs.filter(job => {
      const jobDate = new Date(job.dateApplied);
      return jobDate.getMonth() === currentMonth && jobDate.getFullYear() === currentYear;
    }).length;
    
    // Calculate rates
    const responses = this.jobs.filter(job => job.status !== 'Applied').length;
    const interviews = this.jobs.filter(job => job.status === 'Interview').length;
    const offers = this.jobs.filter(job => job.status === 'Offer').length;
    
    this.analytics.responseRate = this.analytics.totalApplications > 0 ? Math.round((responses / this.analytics.totalApplications) * 100) : 0;
    this.analytics.interviewRate = this.analytics.totalApplications > 0 ? Math.round((interviews / this.analytics.totalApplications) * 100) : 0;
    this.analytics.offerRate = this.analytics.totalApplications > 0 ? Math.round((offers / this.analytics.totalApplications) * 100) : 0;
    
    // Calculate status breakdown
    const statusCounts = {
      'Applied': this.jobs.filter(job => job.status === 'Applied').length,
      'Interview': interviews,
      'Offer': offers,
      'Rejected': this.jobs.filter(job => job.status === 'Rejected').length
    };
    
    this.analytics.statusBreakdown = this.analytics.statusBreakdown.map(status => ({
      ...status,
      count: statusCounts[status.name as keyof typeof statusCounts] || 0,
      percentage: this.analytics.totalApplications > 0 ? Math.round((statusCounts[status.name as keyof typeof statusCounts] / this.analytics.totalApplications) * 100) : 0
    }));
    
    // Calculate top companies
    const companyCount = new Map<string, number>();
    this.jobs.forEach(job => {
      const count = companyCount.get(job.company) || 0;
      companyCount.set(job.company, count + 1);
    });
    
    this.analytics.topCompanies = Array.from(companyCount.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: this.analytics.totalApplications > 0 ? Math.round((count / this.analytics.totalApplications) * 100) : 0
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Calculate monthly data
    const monthlyCount = new Map<string, number>();
    this.jobs.forEach(job => {
      const date = new Date(job.dateApplied);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
      const count = monthlyCount.get(monthKey) || 0;
      monthlyCount.set(monthKey, count + 1);
    });
    
    this.analytics.monthlyData = this.analytics.monthlyData.map(month => ({
      ...month,
      count: monthlyCount.get(month.month) || 0
    }));
    
    // Calculate job types
    const typeCount = new Map<string, number>();
    this.jobs.forEach(job => {
      const type = job.jobType || 'Full-time';
      const count = typeCount.get(type) || 0;
      typeCount.set(type, count + 1);
    });
    
    this.analytics.jobTypes = this.analytics.jobTypes.map(type => ({
      ...type,
      count: typeCount.get(type.name) || 0,
      percentage: this.analytics.totalApplications > 0 ? Math.round((typeCount.get(type.name) || 0) / this.analytics.totalApplications * 100) : 0
    }));
    
    // Generate insights
    this.generateInsights();
  }
  
  private generateInsights(): void {
    const insights = [];
    
    if (this.analytics.totalApplications === 0) {
      insights.push({
        type: 'info',
        icon: 'info',
        title: 'Getting Started',
        description: 'Start adding job applications to see detailed analytics and insights about your job search progress.'
      });
    } else {
      if (this.analytics.responseRate < 20) {
        insights.push({
          type: 'warning',
          icon: 'warning',
          title: 'Low Response Rate',
          description: 'Your response rate is below 20%. Consider tailoring your applications more specifically to each role.'
        });
      }
      
      if (this.analytics.interviewRate > 15) {
        insights.push({
          type: 'positive',
          icon: 'trending_up',
          title: 'Great Interview Rate',
          description: 'Your interview rate is above 15%! Your applications are getting noticed.'
        });
      }
      
      if (this.analytics.thisMonthApplications > 10) {
        insights.push({
          type: 'positive',
          icon: 'speed',
          title: 'Active Job Search',
          description: `You've submitted ${this.analytics.thisMonthApplications} applications this month. Keep up the momentum!`
        });
      }
    }
    
    this.analytics.insights = insights;
  }
}
