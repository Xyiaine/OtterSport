/**
 * AUTHENTICATION HOOK
 * 
 * This hook manages user authentication state throughout the app.
 * It fetches user data and provides authentication status.
 */

import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  // Fetch current user data from the server
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false, // Don't retry on failure (user is likely not logged in)
  });

  return {
    user, // User data if authenticated
    isLoading, // True while checking authentication
    isAuthenticated: !!user, // True if user is logged in
  };
}
