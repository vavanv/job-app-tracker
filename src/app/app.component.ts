import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterOutlet, 
    RouterModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Job Application Tracker';
  sidenavOpened = false;
  
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  
  navigationItems = [
    { name: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { name: 'Job Applications', route: '/jobs', icon: 'work' },
    { name: 'Add New Job', route: '/jobs/new', icon: 'add_circle' },
    { name: 'Analytics', route: '/analytics', icon: 'analytics' },
    { name: 'Settings', route: '/settings', icon: 'settings' }
  ];
  
  constructor(private breakpointObserver: BreakpointObserver) {}
  
  toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
  }
}
