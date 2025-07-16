import { useLocation } from "wouter";

export default function BottomNavigation() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { id: "home", path: "/", icon: "fas fa-home", label: "Home" },
    { id: "workout", path: "/workout", icon: "fas fa-play", label: "Workout" },
    { id: "progress", path: "/progress", icon: "fas fa-chart-line", label: "Progress" },
    { id: "decks", path: "/decks", icon: "fas fa-layer-group", label: "Decks" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location === "/";
    return location.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setLocation(item.path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "text-otter-teal"
                  : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              <i className={`${item.icon} text-lg`}></i>
              <span className={`text-xs mt-1 ${
                isActive(item.path) ? "font-medium" : ""
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
