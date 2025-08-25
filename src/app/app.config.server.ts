import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRendering as provideSSRRendering, withRoutes } from '@angular/ssr';
import { COMPILER_OPTIONS, CompilerFactory } from '@angular/core';
import { JitCompilerFactory } from '@angular/platform-browser-dynamic';
import '@angular/compiler';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideSSRRendering(withRoutes(serverRoutes)),
    { provide: COMPILER_OPTIONS, useValue: {}, multi: true },
    { provide: CompilerFactory, useClass: JitCompilerFactory, deps: [COMPILER_OPTIONS] }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
