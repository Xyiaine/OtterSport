/**
 * LOCAL STORAGE UTILITIES FOR OTTERSPORT
 * 
 * Manages local storage for user preferences and onboarding data
 * that can be synced with the server when user authenticates.
 */

export interface OnboardingData {
  fitnessGoal: string;
  fitnessLevel: string;
  workoutFrequency: string;
  currentDifficultyLevel: number;
}

const STORAGE_KEYS = {
  ONBOARDING_DATA: 'ottersport_onboarding_data',
  USER_PREFERENCES: 'ottersport_user_preferences',
} as const;

/**
 * Save onboarding data to local storage
 */
export function saveOnboardingData(data: OnboardingData): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_DATA, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save onboarding data to localStorage:', error);
  }
}

/**
 * Get onboarding data from local storage
 */
export function getOnboardingData(): OnboardingData | null {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get onboarding data from localStorage:', error);
    return null;
  }
}

/**
 * Clear onboarding data from local storage (after successful sync)
 */
export function clearOnboardingData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING_DATA);
  } catch (error) {
    console.error('Failed to clear onboarding data from localStorage:', error);
  }
}

/**
 * Check if user has completed onboarding (either locally or on server)
 */
export function hasCompletedOnboarding(user?: any): boolean {
  // Check if user has fitness goal set on server
  if (user && user.fitnessGoal) {
    return true;
  }
  
  // Check if onboarding data exists locally
  const localData = getOnboardingData();
  return localData !== null;
}

/**
 * Get user profile data (combines server data with local storage)
 */
export function getUserProfile(user?: any): OnboardingData | null {
  // Prefer server data if available
  if (user && user.fitnessGoal) {
    return {
      fitnessGoal: user.fitnessGoal,
      fitnessLevel: user.fitnessLevel,
      workoutFrequency: user.workoutFrequency,
      currentDifficultyLevel: user.currentDifficultyLevel || 1.0,
    };
  }
  
  // Fall back to local storage
  return getOnboardingData();
}