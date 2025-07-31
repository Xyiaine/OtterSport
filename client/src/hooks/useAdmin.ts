/**
 * Admin Hook - Minimal Implementation
 * Simple admin authentication and permissions for OtterSport
 */

import { useState, useEffect } from 'react';

interface AdminState {
  isAdmin: boolean;
  canAccessGameArtist: boolean;
}

export function useAdmin(): AdminState & {
  login: (password: string) => Promise<boolean>;
  logout: () => void;
} {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin session exists in localStorage
    const adminSession = localStorage.getItem('ottersport_admin_session');
    if (adminSession) {
      try {
        const session = JSON.parse(adminSession);
        if (session.isAdmin && session.expires > Date.now()) {
          setIsAdmin(true);
        } else {
          localStorage.removeItem('ottersport_admin_session');
        }
      } catch (error) {
        console.error('Error parsing admin session:', error);
        localStorage.removeItem('ottersport_admin_session');
      }
    }
  }, []);

  const login = async (password: string): Promise<boolean> => {
    // Simple password check for minimal implementation
    if (password === 'admin' || password === 'ottersport') {
      setIsAdmin(true);
      
      // Store session in localStorage (expires in 24 hours)
      const session = {
        isAdmin: true,
        expires: Date.now() + (24 * 60 * 60 * 1000)
      };
      localStorage.setItem('ottersport_admin_session', JSON.stringify(session));
      
      return true;
    }
    return false;
  };

  const logout = (): void => {
    setIsAdmin(false);
    localStorage.removeItem('ottersport_admin_session');
  };

  return {
    isAdmin,
    canAccessGameArtist: isAdmin, // Game artist access requires admin permissions
    login,
    logout,
  };
}