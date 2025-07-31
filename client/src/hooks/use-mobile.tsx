/**
 * USE-MOBILE MODULE
 * 
 * This module provides functionality for use-mobile.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import * as React from "react"

const MOBILE_BREAKPOINT = 768

/**
 * Handles useismobile functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles useismobile functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles useismobile functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
