import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OtterCharacter from "@/components/ui/otter-character";
import { EditableBackground, EditableImage, EditableText } from "@/components/ui/visual-element";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <EditableBackground id="landing-bg" className="min-h-screen flex items-center justify-center p-6">
      <Card className="w-full max-w-md mx-auto shadow-lg border-0">
        <CardContent className="p-8 space-y-8">
          {/* Otter Character */}
          <div className="text-center space-y-4">
            <div className="w-32 h-32 mx-auto">
              <EditableImage 
                id="landing-hero-image" 
                className="w-full h-full object-cover rounded-full"
                fallback={<OtterCharacter mood="cheerful" animated />}
              />
            </div>
            <EditableText 
              id="landing-title" 
              as="h1" 
              className="text-3xl font-bold text-slate-800"
              fallback="Welcome to OtterSport!"
            />
            <EditableText 
              id="landing-subtitle" 
              as="p" 
              className="text-slate-600 leading-relaxed"
              fallback="Build consistent fitness habits with fun, card-based workouts guided by your personal otter coach."
            />
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm text-slate-700">
              <div className="w-8 h-8 bg-otter-teal-light rounded-full flex items-center justify-center">
                <i className="fas fa-cards-blank text-otter-teal text-xs"></i>
              </div>
              <span>Card-based workout system</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-700">
              <div className="w-8 h-8 bg-otter-teal-light rounded-full flex items-center justify-center">
                <i className="fas fa-chart-line text-otter-teal text-xs"></i>
              </div>
              <span>Adaptive progression engine</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-slate-700">
              <div className="w-8 h-8 bg-otter-teal-light rounded-full flex items-center justify-center">
                <i className="fas fa-heart text-otter-teal text-xs"></i>
              </div>
              <span>Personalized otter coach</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={handleLogin}
              className="w-full bg-otter-teal hover:bg-teal-600 text-white py-4 text-base font-semibold transition-all transform hover:scale-105 shadow-lg"
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
