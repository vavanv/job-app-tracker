// Import the built Angular server function
import { netlifyAppEngineHandler } from "../dist/job-app-tracker/server/server.mjs";

export const handler = netlifyAppEngineHandler;
