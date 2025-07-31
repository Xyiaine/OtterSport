/**
 * ADMIN LOGIN COMPONENT
 * 
 * Provides admin authentication interface for OtterSport application.
 * Allows authorized users to access admin features including game artist mode
 * and exercise skip functionality.
 */

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Shield, Eye, EyeOff } from "lucide-react";

/**
 * AdminLoginProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * AdminLoginProps interface defines the contract for implementation.
/**
 * AdminLoginProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
/**
 * AdminLoginProps interface defines the contract for implementation.
 * 
/**
 * defines interface defines the contract for implementation.
 * 
/**
 * AdminLoginProps interface defines the contract for implementation.
/**
 * AdminLoginProps interface defines the contract for implementation.
/**
 * AdminLoginProps interface defines the contract for implementation.
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AdminLoginProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AdminLoginProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AdminLoginProps
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface defines
/**
 * Handles adminlogin functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
 */
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AdminLoginProps
 */
 * @interface AdminLoginProps
 */
 * 
 * This interface defines the contract for implementation.
 * All properties and methods should be implemented according to specification.
 * 
 * @interface AdminLoginProps
 */
 * @interface AdminLoginProps
 */
interface AdminLoginProps {
  isOpen: boolean;
/**
 * Handles adminlogin functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
  onClose: () => void;
  onSuccess: () => void;
/**
 * Handles adminlogin functionality for the application
 * 
 * @param {any} params - Function parameters
 * @returns {any} Function return value
 */
}

/**
 * AdminLogin Component
 * 
 * Modal dialog for admin authentication with form validation
 * and secure credential handling.
 */
export default function AdminLogin({ isOpen, onClose, onSuccess }: AdminLoginProps) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Admin login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: { login: string; password: string }) => {
      const response = await apiRequest("POST", "/api/admin/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Admin access granted",
          description: "Welcome to admin mode",
        });
        
        // Invalidate auth queries to refresh admin status
        queryClient.invalidateQueries({ queryKey: ["/api/admin/status"] });
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        // Reset form and close dialog
        setLogin("");
        setPassword("");
        onSuccess();
        onClose();
      }
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid admin credentials",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!login || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both login and password",
        variant: "destructive",
      });
      return;
    }

    loginMutation.mutate({ login, password });
  };

  const handleClose = () => {
    setLogin("");
    setPassword("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-600" />
            Admin Login
          </DialogTitle>
        </DialogHeader>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-center">
              Administrator Access Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-login">Admin Login</Label>
                <Input
                  id="admin-login"
                  type="text"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  placeholder="Enter admin login"
                  autoComplete="username"
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-password">Admin Password</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter admin password"
                    autoComplete="current-password"
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}