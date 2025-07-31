/**
 * Landing Page - Minimal Implementation
 * Clean, simple landing page for OtterSport fitness app
 */

import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OtterCharacter from "@/components/ui/otter-character";
import { useAuth } from "@/hooks/useAuth";

export default function Landing() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      await login();
      setLocation("/onboarding");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-slate-50 to-slate-100">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0">
        <CardContent className="p-8 text-center space-y-6">
          {/* Hero Section */}
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <OtterCharacter mood="cheerful" size="lg" />
            </div>
            
            <h1 className="text-3xl font-bold text-slate-800">
              Welcome to OtterSport!
            </h1>
            
            <p className="text-slate-600 leading-relaxed">
              Build consistent fitness habits with fun, card-based workouts guided by your personal otter coach.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            {[
              { icon: "🃏", text: "Card-based workout system" },
              { icon: "📈", text: "Adaptive progression engine" },
              { icon: "🦦", text: "Personalized otter coach" }
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm text-slate-700">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <span className="text-lg">{feature.icon}</span>
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 text-base font-semibold shadow-lg"
            >
              Start Your Fitness Journey
            </Button>
            <p className="text-xs text-center text-slate-500">
              Sign in with your account to get started
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}