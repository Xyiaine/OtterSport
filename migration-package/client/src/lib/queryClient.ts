/**
 * QUERY CLIENT SETUP
 * 
 * This file configures TanStack Query for making API requests.
 * It handles authentication and provides unified error handling.
 */

import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Helper function to throw errors for failed HTTP responses
 */
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

/**
 * Helper function for making authenticated API requests
 * Used for POST, PATCH, DELETE operations
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include", // Include cookies for authentication
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

/**
 * Creates a query function that handles authentication properly
 * Can either return null or throw on 401 errors
 */
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include", // Include cookies for authentication
    });

    // Handle 401 errors based on specified behavior
    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

/**
 * Configured TanStack Query client with sensible defaults
 * - Includes credentials for authentication
 * - Doesn't retry failed requests (we handle errors manually)
 * - Caches data indefinitely until manually invalidated
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false, // Don't auto-refresh
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      staleTime: Infinity, // Cache forever until manually invalidated
      retry: false, // Don't retry failed requests
    },
    mutations: {
      retry: false, // Don't retry failed mutations
    },
  },
});
