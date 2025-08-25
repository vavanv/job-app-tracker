import type { Context } from "@netlify/edge-functions";

export default async function handler(request: Request, context: Context): Promise<Response> {
  // Import the server handler dynamically
  const { reqHandler } = await import('../../dist/job-app-tracker/server/server.mjs');
  
  // Use the Angular SSR request handler
  return await reqHandler(request);
}

export const config = {
  path: "/*"
};