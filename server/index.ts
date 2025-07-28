/**
 * OTTERSPORT EXPRESS SERVER
 * 
 * Main server entry point for the OtterSport fitness application.
 * This file sets up the Express server with comprehensive middleware,
 * routing, and development/production environment handling.
 * 
 * Features:
 * - Request/response logging with performance monitoring
 * - API route registration with authentication
 * - Development hot-reloading via Vite
 * - Production static file serving
 * - Global error handling with proper status codes
 * - CORS and security middleware
 * 
 * Architecture:
 * - Express.js server framework
 * - TypeScript for type safety
 * - Vite for development/production builds
 * - Replit OAuth authentication integration
 * - PostgreSQL database with connection pooling
 */

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Initialize Express application with middleware
const app = express();

// Body parsing middleware for JSON and URL-encoded data
app.use(express.json({ limit: '10mb' })); // Support for larger JSON payloads
app.use(express.urlencoded({ extended: false, limit: '10mb' }));

/**
 * REQUEST LOGGING & PERFORMANCE MONITORING MIDDLEWARE
 * 
 * Captures request/response data for API endpoints including:
 * - HTTP method, path, and status code
 * - Response time in milliseconds
 * - JSON response body for debugging
 * - Truncated output for readability
 * 
 * Only logs API routes (starting with /api) to reduce noise
 * in development and production environments.
 */
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  // Intercept res.json to capture response data
  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  // Log API requests when response finishes
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      
      // Include response data for debugging (truncated)
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      // Truncate long log lines for readability
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

/**
 * SERVER INITIALIZATION & STARTUP
 * 
 * Async initialization function that:
 * 1. Registers all API routes with authentication
 * 2. Sets up global error handling
 * 3. Configures Vite for development or static serving for production
 * 4. Starts the server on the specified port
 */
(async () => {
  try {
    // Register all API routes (authentication, exercises, decks, gamification, etc.)
    const server = await registerRoutes(app);

    /**
     * GLOBAL ERROR HANDLING MIDDLEWARE
     * 
     * Catches all unhandled errors in route handlers and middleware.
     * Provides consistent error responses with proper HTTP status codes.
     * Logs error details while sending user-friendly messages.
     */
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      // Log error details for debugging
      console.error(`[Server Error] ${status}: ${message}`, err.stack);

      // Send clean error response to client
      res.status(status).json({ message });
      
      // Re-throw for process monitoring
      throw err;
    });

    /**
     * ENVIRONMENT-SPECIFIC SETUP
     * 
     * Development: Hot-reloading with Vite dev server
     * Production: Optimized static file serving
     * 
     * Important: Vite setup must come AFTER route registration
     * to prevent the catch-all route from interfering with API routes.
     */
    if (app.get("env") === "development") {
      await setupVite(app, server);
      log("[Server] Development mode: Vite hot-reloading enabled");
    } else {
      serveStatic(app);
      log("[Server] Production mode: Static file serving enabled");
    }

    /**
     * SERVER STARTUP
     * 
     * Binds to environment-specified port (default: 5000)
     * Uses 0.0.0.0 host for external access in containerized environments
     * Enables port reuse for faster development restarts
     */
    const port = parseInt(process.env.PORT || '5000', 10);
    server.listen({
      port,
      host: "0.0.0.0",
      reusePort: true,
    }, () => {
      log(`[Server] OtterSport server running on port ${port}`);
      log(`[Server] Environment: ${app.get("env") || "development"}`);
      log(`[Server] Ready to accept connections`);
    });

  } catch (error) {
    console.error("[Server] Failed to start:", error);
    process.exit(1);
  }
})();
