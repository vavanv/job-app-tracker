import type { Context } from "@netlify/edge-functions";
import { AngularAppEngine } from '@angular/ssr';
import '@angular/compiler';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// Ensure JIT compiler is available
if (typeof globalThis !== 'undefined') {
  (globalThis as any).ngJitMode = true;
}

const angularAppEngine = new AngularAppEngine();

export default async function handler(request: Request, context: Context): Promise<Response> {
  // Handle the request with Angular SSR
  const result = await angularAppEngine.handle(request, context);
  return result || new Response('Not found', { status: 404 });
}

export const config = {
  path: "/*"
};