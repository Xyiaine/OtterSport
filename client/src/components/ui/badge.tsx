/**
 * BADGE MODULE
 * 
 * This module provides functionality for badge.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

/**
 * BadgeProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
/**
 * Handles badge functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * All properties and methods should be implemented according to specification.
 * 
/**
 * BadgeProps interface defines the contract for implementation.
/**
 * BadgeProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
/**
 * Handles badge functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * All properties and methods should be implemented according to specification.
 * 
/**
 * BadgeProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * BadgeProps interface defines the contract for implementation.
/**
 * BadgeProps interface defines the contract for implementation.
/**
 * BadgeProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
/**
 * Handles badge functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BadgeProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BadgeProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BadgeProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BadgeProps
 */
 * @interface BadgeProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface BadgeProps
 */
 * @interface BadgeProps
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
