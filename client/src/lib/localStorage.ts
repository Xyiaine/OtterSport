/**
 * LOCAL STORAGE UTILITIES FOR OTTERSPORT - MINIMAL VERSION
 * 
 * Simple local storage management for user preferences and onboarding data
 */

export interface OnboardingData {
  fitnessGoal: string;
  fitnessLevel: string;
  workoutFrequency: string;
  preferredWorkoutTime: string;
  hasCompletedOnboarding: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  soundEnabled: boolean;
}

const STORAGE_KEYS = {
  ONBOARDING: 'ottersport_onboarding',
  PREFERENCES: 'ottersport_preferences',
  USER_PROFILE: 'ottersport_user_profile',
} as const;

// Onboarding Data Management
export const getOnboardingData = (): OnboardingData | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting onboarding data:', error);
    return null;
  }
};

export const setOnboardingData = (data: Partial<OnboardingData>): void => {
  try {
    const existing = getOnboardingData() || {} as OnboardingData;
    const updated = { ...existing, ...data };
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(updated));
  } catch (error) {
    console.error('Error setting onboarding data:', error);
  }
};

export const clearOnboardingData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
  } catch (error) {
    console.error('Error clearing onboarding data:', error);
  }
};

export const hasCompletedOnboarding = (): boolean => {
  try {
    const data = getOnboardingData();
    return data?.hasCompletedOnboarding === true;
  } catch (error) {
    console.error('Error checking onboarding completion:', error);
    return false;
  }
};

// User Preferences Management
export const getUserPreferences = (): UserPreferences => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    const defaults: UserPreferences = {
      theme: 'light',
      notifications: true,
      soundEnabled: true,
    };
    return data ? { ...defaults, ...JSON.parse(data) } : defaults;
  } catch (error) {
    console.error('Error getting user preferences:', error);
    return {
      theme: 'light',
      notifications: true,
      soundEnabled: true,
    };
  }
};

export const setUserPreferences = (preferences: Partial<UserPreferences>): void => {
  try {
    const existing = getUserPreferences();
    const updated = { ...existing, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error setting user preferences:', error);
  }
};

// User Profile Management
export interface UserProfile {
  id?: string;
  name?: string;
  email?: string;
  fitnessGoal?: string;
  fitnessLevel?: string;
  workoutFrequency?: string;
  preferredWorkoutTime?: string;
}

export const getUserProfile = (): UserProfile | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const setUserProfile = (profile: Partial<UserProfile>): void => {
  try {
    const existing = getUserProfile() || {} as UserProfile;
    const updated = { ...existing, ...profile };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
  } catch (error) {
    console.error('Error setting user profile:', error);
  }
};

export const clearUserProfile = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
  } catch (error) {
    console.error('Error clearing user profile:', error);
  }
};

// Clear all local storage data
export const clearAllLocalData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing local data:', error);
  }
};