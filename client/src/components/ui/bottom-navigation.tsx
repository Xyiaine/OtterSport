import { useLocation } from "wouter";
import { useAdmin } from "@/hooks/useAdmin";
import { useState } from "react";
import AdminLogin from "./admin-login";
import { 
  Home, 
  Play, 
  TrendingUp, 
  Layers, 
  Palette, 
  Shield, 
  LogOut 
} from "lucide-react";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();
  const { isAdmin, canAccessGameArtist, logout } = useAdmin();
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  const navItems = [
    { id: "home", path: "/", icon: Home, label: "Home" },
    { id: "workout", path: "/workout", icon: Play, label: "Workout" },
    { id: "progress", path: "/progress", icon: TrendingUp, label: "Progress" },
    { id: "decks", path: "/decks", icon: Layers, label: "Decks" },
    ...(canAccessGameArtist() ? [
      { id: "artist", path: "/game-artist", icon: Palette, label: "Artist" }
    ] : []),
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      logout();
    } else {
      setShowAdminLogin(true);
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50 safe-area-inset-bottom">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex justify-around items-center">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setLocation(item.path)}
                  className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "text-otter-teal bg-otter-teal/10"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className={`text-xs mt-1 ${
                    isActive(item.path) ? "font-medium" : ""
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
            
            {/* Admin toggle button */}
            <button
              onClick={handleAdminClick}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isAdmin
                  ? "text-amber-600 bg-amber-50"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
              title={isAdmin ? "Logout from admin mode" : "Login as admin"}
            >
              {isAdmin ? (
                <LogOut className="text-lg w-5 h-5" />
              ) : (
                <Shield className="text-lg w-5 h-5" />
              )}
              <span className={`text-xs mt-1 ${isAdmin ? "font-medium" : ""}`}>
                {isAdmin ? "Logout" : "Admin"}
              </span>
            </button>
          </div>
        </div>
      </nav>
      
      {/* Admin login modal */}
      <AdminLogin
        isOpen={showAdminLogin}
        onClose={() => setShowAdminLogin(false)}
        onSuccess={() => {
          // Refresh navigation after successful login
          // Game Artist will become available automatically
        }}
      />
    </>
  );
}
