import type { Context } from "@netlify/edge-functions";
import { AngularAppEngine } from '@angular/ssr';
import { getContext } from '@netlify/angular-runtime';

const angularAppEngine = new AngularAppEngine();

export default async function handler(request: Request, context: Context): Promise<Response> {
  const netlifyContext = getContext();
  
  // Handle the request with Angular SSR
  const result = await angularAppEngine.handle(request, netlifyContext);
  return result || new Response('Not found', { status: 404 });
}

export const config = {
  path: "/*"
};