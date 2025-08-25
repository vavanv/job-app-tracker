const path = require("path");

let angularHandler;

exports.handler = async (event, context) => {
  // Lazy load the Angular handler
  if (!angularHandler) {
    try {
      // Use dynamic import to load the ES module
      const serverPath = path.join(
        __dirname,
        "../dist/job-app-tracker/server/server.mjs"
      );
      const { netlifyAppEngineHandler } = await import(serverPath);
      angularHandler = netlifyAppEngineHandler;
    } catch (error) {
      console.error("Failed to load Angular handler:", error);
      console.error("Error details:", error.message);
      console.error("Stack:", error.stack);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Internal Server Error",
          details: error.message,
        }),
      };
    }
  }

  try {
    // Convert Netlify event to Request object
    const protocol = event.headers["x-forwarded-proto"] || "https";
    const host = event.headers.host || event.headers.Host;
    const url = `${protocol}://${host}${event.rawUrl || event.path || "/"}`;

    const request = new Request(url, {
      method: event.httpMethod || "GET",
      headers: event.headers || {},
      body: event.body
        ? event.isBase64Encoded
          ? Buffer.from(event.body, "base64")
          : event.body
        : undefined,
    });

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
    console.error("Event:", JSON.stringify(event, null, 2));
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
    };
  }
};
