import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createRequire } from "module";

// Set up proper module resolution for Netlify environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure global require is available with proper URL
if (!globalThis.require) {
  globalThis.require = createRequire(import.meta.url || __filename);
}

let angularHandler;

export const handler = async (event, context) => {
  // Lazy load the Angular handler
  if (!angularHandler) {
    try {
      const serverPath = join(
        __dirname,
        "../dist/job-app-tracker/server/server.mjs"
      );
      const { netlifyAppEngineHandler } = await import(serverPath);
      angularHandler = netlifyAppEngineHandler;
    } catch (error) {
      console.error("Failed to load Angular handler:", error);
      return {
        statusCode: 500,
        body: "Internal Server Error",
      };
    }
  }

  // Convert Netlify event to Request object
  const url = `https://${event.headers.host}${event.rawUrl || event.path}`;
  const request = new Request(url, {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body
      ? event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : event.body
      : undefined,
  });

  try {
    const response = await angularHandler(request);

    if (!response) {
      return {
        statusCode: 404,
        body: "Not found",
      };
    }

    const body = await response.text();
    const headers = {};
    response.headers.forEach((value, key) => {
      headers[key] = value;
    });

    return {
      statusCode: response.status,
      headers,
      body,
    };
  } catch (error) {
    console.error("Handler error:", error);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};
