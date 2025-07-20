import { GamificationDashboard } from "@/components/gamification-dashboard";
import { useAuth } from "@/hooks/useAuth";
import { Redirect } from "wouter";

export default function Progress() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/api/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <div className="pt-6">
        <h1 className="text-center text-2xl font-bold text-slate-800 mb-6">Your Fitness Journey</h1>
        <GamificationDashboard />
      </div>
    </div>
  );
}