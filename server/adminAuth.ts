/**
 * ADMIN AUTHENTICATION MODULE
 * 
 * Provides admin authentication functionality for OtterSport application.
 * Includes login validation, session management, and admin-only feature access.
 */

import crypto from 'crypto';
import type { Request, Response } from 'express';

// Admin credentials configuration
const ADMIN_CREDENTIALS = {
  login: 'OtterAdmin',
  password: 'OtterAdmin'
};

/**
 * Hash password using SHA-256
 */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Verify admin credentials
 */
export function verifyAdminCredentials(login: string, password: string): boolean {
  return login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password;
}

/**
 * Admin login endpoint handler
 */
export async function handleAdminLogin(req: Request, res: Response) {
  try {
    const { login, password } = req.body;
    
    if (!login || !password) {
      return res.status(400).json({ 
        error: 'Login and password are required' 
      });
    }
    
    // Verify admin credentials
    if (verifyAdminCredentials(login, password)) {
      // Set admin session
      if (req.session) {
        req.session.isAdmin = true;
        req.session.adminLogin = login;
      }
      
      return res.json({ 
        success: true, 
        message: 'Admin login successful',
        isAdmin: true 
      });
    } else {
      return res.status(401).json({ 
        error: 'Invalid admin credentials' 
      });
    }
    
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

/**
 * Admin logout endpoint handler
 */
export async function handleAdminLogout(req: Request, res: Response) {
  try {
    if (req.session) {
      req.session.isAdmin = false;
      req.session.adminLogin = undefined;
    }
    
    return res.json({ 
      success: true, 
      message: 'Admin logout successful' 
    });
    
  } catch (error) {
    console.error('Admin logout error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

/**
 * Check if current session has admin privileges
 */
export function isAdmin(req: Request): boolean {
  return !!(req.session && req.session.isAdmin);
}

/**
 * Middleware to require admin privileges
 */
export function requireAdmin(req: Request, res: Response, next: any) {
  if (!isAdmin(req)) {
    return res.status(403).json({ 
      error: 'Admin privileges required' 
    });
  }
  next();
}

/**
 * Get admin status for current session
 */
export async function getAdminStatus(req: Request, res: Response) {
  try {
    const adminStatus = {
      isAdmin: isAdmin(req),
      adminLogin: req.session?.adminLogin || null
    };
    
    return res.json(adminStatus);
    
  } catch (error) {
    console.error('Get admin status error:', error);
    return res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
}

// Extend express session interface
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
    adminLogin?: string;
  }
}