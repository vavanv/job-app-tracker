import type { Context } from "@netlify/edge-functions";
import { netlifyAppEngineHandler } from "../../server.ts";

export default async function handler(request: Request, context: Context): Promise<Response> {
  // Use the Netlify app engine handler from server.ts
  return await netlifyAppEngineHandler(request);
}

export const config = {
  path: "/*"
};