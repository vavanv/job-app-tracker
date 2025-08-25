import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import '@angular/compiler';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Ensure JIT compiler is available globally
if (typeof globalThis !== 'undefined') {
  (globalThis as any).ngJitMode = true;
}

export default () => bootstrapApplication(AppComponent, config);
