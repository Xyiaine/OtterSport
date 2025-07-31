/**
 * BOTTOM-NAVIGATION MODULE
 * 
 * This module provides functionality for bottom-navigation.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { useLocation } from "wouter";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";
// Admin login component removed for minimal design
import { 
  Home, 
  Play, 
  TrendingUp, 
  Layers, 
  Palette, 
  Shield, 
  LogOut 
} from "lucide-react";

/**
 * Handles bottomnavigation functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await BottomNavigation(params);
 */
/**
 * Handles bottomnavigation functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await BottomNavigation(params);
 */
/**
 * Handles bottomnavigation functionality for the application
 * 
 * This is a complex function that requires careful attention.
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 * 
 * @example
 * const result = await BottomNavigation(params);
 */
export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const { isAdmin, canAccessGameArtist, logout } = useAdmin();
  // Admin login removed for minimal design

  const navItems = [
    { id: "home", path: "/", icon: Home, label: "Home" },
    { id: "workout", path: "/workout", icon: Play, label: "Workout" },
    { id: "progress", path: "/progress", icon: TrendingUp, label: "Progress" },
    { id: "decks", path: "/decks", icon: Layers, label: "Decks" },
    ...(canAccessGameArtist() ? [
      { id: "artist", path: "/game-artist", icon: Palette, label: "Artist" }
    ] : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      logout();
    } else {
      // Admin login disabled in minimal mode
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 safe-area-inset-bottom">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.path)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-otter-teal bg-otter-teal/10"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className={`text-xs mt-1 ${
                    isActive(item.path) ? "font-medium" : ""
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
            
            {/* Admin toggle button */}
            <button
              onClick={handleAdminClick}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isAdmin
                  ? "text-amber-600 bg-amber-50"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
              title={isAdmin ? "Logout from admin mode" : "Login as admin"}
            >
              {isAdmin ? (
                <LogOut className="text-lg w-5 h-5" />
              ) : (
                <Shield className="text-lg w-5 h-5" />
              )}
              <span className={`text-xs mt-1 ${isAdmin ? "font-medium" : ""}`}>
                {isAdmin ? "Logout" : "Admin"}
              </span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Admin login modal */}
      {/* Admin login component removed for minimal design */}
    </>
  );
}
