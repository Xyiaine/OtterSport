/**
 * ADMIN AUTHENTICATION HOOK
 * 
 * Custom React hook for managing admin authentication state
 * and providing admin-specific functionality access control.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AdminStatus {
  isAdmin: boolean;
  adminLogin: string | null;
}

/**
 * useAdmin Hook
 * 
 * Provides admin authentication state and logout functionality.
 * Automatically refreshes admin status and handles session management.
 */
export function useAdmin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query admin status
  const { 
    data: adminStatus, 
    isLoading, 
    error 
  } = useQuery<AdminStatus>({
    queryKey: ["/api/admin/status"],
    refetchOnWindowFocus: true,
    refetchInterval: 5 * 60 * 1000, // Refresh every 5 minutes
  });

  // Admin logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/admin/logout", {});
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Admin logout successful",
        description: "You have been logged out of admin mode",
      });
      
      // Invalidate admin status to refresh UI
      queryClient.invalidateQueries({ queryKey: ["/api/admin/status"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Logout failed",
        description: error.message || "Failed to logout from admin mode",
        variant: "destructive",
      });
    },
  });

  return {
    // Admin status
    isAdmin: adminStatus?.isAdmin || false,
    adminLogin: adminStatus?.adminLogin || null,
    
    // Loading states
    isLoading,
    error,
    
    // Actions
    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    
    // Convenience methods
    hasAdminAccess: () => adminStatus?.isAdmin === true,
    canAccessGameArtist: () => adminStatus?.isAdmin === true,
    canSkipExercises: () => adminStatus?.isAdmin === true,
  };
}