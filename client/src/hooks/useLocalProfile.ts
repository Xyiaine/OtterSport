/**
 * CUSTOM HOOK FOR LOCAL PROFILE MANAGEMENT
 * 
 * Manages user profile data with local storage fallback
 * Automatically syncs with server when user authenticates
 */

import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from './useAuth';
import { getOnboardingData, clearOnboardingData, hasCompletedOnboarding, getUserProfile } from '@/lib/localStorage';
import { apiRequest } from '@/lib/queryClient';

/**
 * Handles uselocalprofile functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles uselocalprofile functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles uselocalprofile functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
export function useLocalProfile() {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Get combined profile (server + local storage)
  const profile = getUserProfile(user);
  const hasProfile = hasCompletedOnboarding(user);

  // Sync local data to server when user authenticates
  const syncMutation = useMutation({
    mutationFn: async (localData: any) => {
      await apiRequest("PATCH", "/api/user/profile", localData);
    },
    onSuccess: () => {
      // Clear local storage after successful sync
      clearOnboardingData();
      // Refresh user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      console.error('Failed to sync local profile data:', error);
    },
  });

  // Auto-sync when user becomes authenticated and has local data
  useEffect(() => {
    if (isAuthenticated && user && !(user as any).fitnessGoal) {
      const localData = getOnboardingData();
      if (localData) {
        console.log('Syncing local onboarding data to server...');
        syncMutation.mutate(localData);
      }
    }
  }, [isAuthenticated, user, syncMutation]);

  return {
    profile,
    hasProfile,
    isAuthenticated,
    isSyncing: syncMutation.isPending,
  };
}