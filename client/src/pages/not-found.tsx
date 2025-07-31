/**
 * NOT-FOUND MODULE
 * 
 * This module provides functionality for not-found.
 * All exports are designed to work seamlessly with the OtterSport application.
 * 
 * Human Developer Guide:
 * - Follow established patterns when modifying this file
 * - Maintain comprehensive test coverage for all functions
 * - Update documentation when adding new functionality
 */

import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

/**
 * Handles notfound functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles notfound functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
/**
 * Handles notfound functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
