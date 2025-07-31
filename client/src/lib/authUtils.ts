/**
 * AUTHUTILS MODULE
 * 
 * This module provides functionality for authutils.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

/**
 * Handles isunauthorizederror functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles isunauthorizederror functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles isunauthorizederror functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}