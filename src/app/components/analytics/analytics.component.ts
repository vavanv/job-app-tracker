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
  template: `
    <div class="analytics-container">
      <h1>Analytics Dashboard</h1>

      <div class="stats-overview">
        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Total Applications</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ analytics.totalApplications }}</div>
            <div
              class="stat-change positive"
              *ngIf="analytics.totalApplications > 0"
            >
              <mat-icon>trending_up</mat-icon>
              +{{ analytics.thisMonthApplications }} this month
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Response Rate</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ analytics.responseRate }}%</div>
            <mat-progress-bar
              mode="determinate"
              [value]="analytics.responseRate"
            ></mat-progress-bar>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Interview Rate</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ analytics.interviewRate }}%</div>
            <mat-progress-bar
              mode="determinate"
              [value]="analytics.interviewRate"
            ></mat-progress-bar>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-header>
            <mat-card-title>Offer Rate</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="stat-number">{{ analytics.offerRate }}%</div>
            <mat-progress-bar
              mode="determinate"
              [value]="analytics.offerRate"
            ></mat-progress-bar>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="charts-section">
        <div class="chart-row">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Application Status Breakdown</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="status-breakdown">
                <div
                  class="status-item"
                  *ngFor="let status of analytics.statusBreakdown"
                >
                  <div class="status-info">
                    <mat-chip [class]="'status-' + status.name.toLowerCase()">{{
                      status.name
                    }}</mat-chip>
                    <span class="status-count">{{ status.count }}</span>
                  </div>
                  <div class="status-bar">
                    <div
                      class="status-progress"
                      [style.width.%]="status.percentage"
                      [class]="'status-' + status.name.toLowerCase()"
                    ></div>
                  </div>
                  <span class="status-percentage"
                    >{{ status.percentage }}%</span
                  >
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Applications Over Time</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="timeline-chart">
                <div
                  class="timeline-item"
                  *ngFor="let month of analytics.monthlyData"
                >
                  <div class="month-label">{{ month.month }}</div>
                  <div class="month-bar">
                    <div
                      class="month-progress"
                      [style.height.px]="month.count * 10"
                    ></div>
                  </div>
                  <div class="month-count">{{ month.count }}</div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>

        <div class="chart-row">
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Top Companies</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="company-list">
                <div
                  class="company-item"
                  *ngFor="let company of analytics.topCompanies"
                >
                  <div class="company-info">
                    <strong>{{ company.name }}</strong>
                    <span class="company-count"
                      >{{ company.count }} applications</span
                    >
                  </div>
                  <div class="company-bar">
                    <div
                      class="company-progress"
                      [style.width.%]="company.percentage"
                    ></div>
                  </div>
                </div>
              </div>
            </mat-card-content>
          </mat-card>
          <mat-card class="chart-card">
            <mat-card-header>
              <mat-card-title>Job Types</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="job-types">
                <div
                  class="job-type-item"
                  *ngFor="let type of analytics.jobTypes"
                >
                  <mat-icon>work</mat-icon>
                  <div class="job-type-info">
                    <strong>{{ type.name }}</strong>
                    <span>{{ type.count }} applications</span>
                  </div>
                  <span class="job-type-percentage"
                    >{{ type.percentage }}%</span
                  >
                </div>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>

      <mat-card class="insights-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon>lightbulb</mat-icon>
            Insights & Recommendations
          </mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="insights-list">
            <div
              class="insight-item"
              *ngFor="let insight of analytics.insights"
            >
              <mat-icon [class]="insight.type">{{ insight.icon }}</mat-icon>
              <div class="insight-content">
                <strong>{{ insight.title }}</strong>
                <p>{{ insight.description }}</p>
              </div>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .analytics-container {
        padding: 24px;
        max-width: 1400px;
        margin: 0 auto;
      }

      h1 {
        margin-bottom: 32px;
        color: #333;
      }

      .stats-overview {
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
        margin: 16px 0;
      }

      .stat-change {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 4px;
        font-size: 0.9rem;
        color: #666;
      }

      .stat-change.positive {
        color: #4caf50;
      }

      .charts-section {
        margin-bottom: 32px;
      }

      .chart-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }

      .chart-card {
        padding: 16px;
      }

      .status-breakdown {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .status-item {
        display: grid;
        grid-template-columns: 1fr 2fr auto;
        gap: 16px;
        align-items: center;
      }

      .status-info {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .status-count {
        font-weight: bold;
        color: #666;
      }

      .status-bar {
        height: 8px;
        background-color: #f0f0f0;
        border-radius: 4px;
        overflow: hidden;
      }

      .status-progress {
        height: 100%;
        transition: width 0.3s ease;
      }

      .status-applied .status-progress {
        background-color: #2196f3;
      }

      .status-interview .status-progress {
        background-color: #ff9800;
      }

      .status-offer .status-progress {
        background-color: #4caf50;
      }

      .status-rejected .status-progress {
        background-color: #f44336;
      }

      .status-percentage {
        font-weight: bold;
        color: #666;
      }

      .timeline-chart {
        display: flex;
        align-items: end;
        gap: 16px;
        height: 200px;
        padding: 16px 0;
      }

      .timeline-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        flex: 1;
      }

      .month-label {
        font-size: 0.8rem;
        color: #666;
      }

      .month-bar {
        width: 100%;
        height: 120px;
        display: flex;
        align-items: end;
        justify-content: center;
      }

      .month-progress {
        width: 20px;
        background-color: #3f51b5;
        border-radius: 2px 2px 0 0;
        min-height: 4px;
      }

      .month-count {
        font-weight: bold;
        color: #333;
      }

      .company-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .company-item {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .company-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .company-count {
        color: #666;
        font-size: 0.9rem;
      }

      .company-bar {
        height: 6px;
        background-color: #f0f0f0;
        border-radius: 3px;
        overflow: hidden;
      }

      .company-progress {
        height: 100%;
        background-color: #3f51b5;
        transition: width 0.3s ease;
      }

      .job-types {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .job-type-item {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .job-type-item mat-icon {
        color: #666;
      }

      .job-type-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .job-type-info span {
        color: #666;
        font-size: 0.9rem;
      }

      .job-type-percentage {
        font-weight: bold;
        color: #3f51b5;
      }

      .insights-card {
        margin-top: 16px;
      }

      .insights-card mat-card-title {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .insights-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .insight-item {
        display: flex;
        align-items: flex-start;
        gap: 12px;
        padding: 16px;
        background-color: #f8f9fa;
        border-radius: 8px;
      }

      .insight-item mat-icon {
        margin-top: 4px;
      }

      .insight-item mat-icon.positive {
        color: #4caf50;
      }

      .insight-item mat-icon.warning {
        color: #ff9800;
      }

      .insight-item mat-icon.info {
        color: #2196f3;
      }

      .insight-content strong {
        display: block;
        margin-bottom: 4px;
        color: #333;
      }

      .insight-content p {
        margin: 0;
        color: #666;
        line-height: 1.5;
      }

      @media (max-width: 768px) {
        .analytics-container {
          padding: 16px;
        }

        .stats-overview {
          grid-template-columns: 1fr;
        }

        .chart-row {
          grid-template-columns: 1fr;
        }

        .timeline-chart {
          height: 150px;
        }

        .status-item {
          grid-template-columns: 1fr;
          gap: 8px;
        }
      }
    `,
  ],
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
