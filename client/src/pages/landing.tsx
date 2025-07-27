import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import OtterCharacter from "@/components/ui/otter-character";
import { EditableBackground, EditableImage, EditableText } from "@/components/ui/visual-element";
import { 
  AnimatedButton, 
  AnimatedCard, 
  PageTransition, 
  StaggeredList 
} from "@/components/ui/menu-animations";
import { motion } from "framer-motion";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <PageTransition direction="up">
      <EditableBackground id="landing-bg" className="min-h-screen flex items-center justify-center p-6">
        <AnimatedCard animationType="glow" className="w-full max-w-md mx-auto shadow-lg border-0">
          <CardContent className="p-8 space-y-8">
            {/* Otter Character */}
            <motion.div 
              className="text-center space-y-4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            >
              <motion.div 
                className="w-32 h-32 mx-auto"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <EditableImage 
                  id="landing-hero-image" 
                  className="w-full h-full object-cover rounded-full"
                  fallback={<OtterCharacter mood="cheerful" animated />}
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <EditableText 
                  id="landing-title" 
                  as="h1" 
                  className="text-3xl font-bold text-slate-800"
                  fallback="Welcome to OtterSport!"
                />
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <EditableText 
                  id="landing-subtitle" 
                  as="p" 
                  className="text-slate-600 leading-relaxed"
                  fallback="Build consistent fitness habits with fun, card-based workouts guided by your personal otter coach."
                />
              </motion.div>
            </motion.div>

            {/* Features */}
            <StaggeredList staggerDelay={0.1} direction="left">
              {[
                { icon: "fas fa-cards-blank", text: "Card-based workout system" },
                { icon: "fas fa-chart-line", text: "Adaptive progression engine" },
                { icon: "fas fa-heart", text: "Personalized otter coach" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center space-x-3 text-sm text-slate-700"
                  whileHover={{ x: 10, transition: { duration: 0.2 } }}
                >
                  <motion.div 
                    className="w-8 h-8 bg-otter-teal-light rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <i className={`${feature.icon} text-otter-teal text-xs`}></i>
                  </motion.div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </StaggeredList>

            {/* Action Buttons */}
            <motion.div 
              className="space-y-4"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <AnimatedButton
                onClick={handleLogin}
                animationType="glow"
                className="w-full bg-otter-teal hover:bg-teal-600 text-white py-4 text-base font-semibold shadow-lg"
              >
                <motion.div
                  className="flex items-center justify-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>Start Your Fitness Journey</span>
                  <motion.i 
                    className="fas fa-rocket"
                    initial={{ x: 0 }}
                    whileHover={{ x: 5 }}
                  />
                </motion.div>
              </AnimatedButton>
              <motion.p 
                className="text-xs text-center text-slate-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                Sign in with your account to get started
              </motion.p>
            </motion.div>
          </CardContent>
        </AnimatedCard>
      </EditableBackground>
    </PageTransition>
  );
}
