/**
 * UTILS MODULE
 * 
 * This module provides functionality for utils.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Handles cn functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles cn functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles cn functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
