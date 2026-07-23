import { useApp } from "../context/AppContext";
import { Home, Binoculars, CircleUserRound  } from "lucide-react";

export default function MobileShell({ children }) {
  const { activePage, setActivePage, currentUser, setSelectedProfileUserId } = useApp();

  // Floating pill tabs configuration
  const navigationTabs = [
    { id: "feed", label: "Feed", icon: Home },
    { id: "people", label: "People", icon: Binoculars },
    { id: "profile", label: "Profile", icon: CircleUserRound  }
  ];

  return (
    <div className="min-h-screen bg-[#07070a] flex items-center justify-center text-slate-100 font-sans antialiased selection:bg-rose-500 selection:text-white">
      {/* Centered borderless viewport container extending full height */}
      <div className="relative w-full h-screen min-[430px]:max-w-[430px] bg-black flex flex-col min-[430px]:border-x border-neutral-900/40 shadow-2xl">
        
        {/* Main Application Container */}
        <div className="flex-1 w-full bg-[#09090b] flex flex-col overflow-hidden relative">
          {children}

          {/* Centered Floating Navigation Capsule */}
          {activePage !== "comments" && activePage !== "login" && activePage !== "register" && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-neutral-950/85 backdrop-blur-md border border-neutral-900 rounded-full py-1.5 px-2 shadow-2xl flex items-center justify-center gap-1 z-40 select-none w-max">
              {navigationTabs.map((tab) => {
                const isActive = activePage === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (tab.id === "profile") {
                        setSelectedProfileUserId(currentUser._id);
                      }
                      setActivePage(tab.id);
                    }}
                    className={`px-3.5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all relative flex items-center gap-1.5 ${
                      isActive
                        ? "bg-linear-to-r from-amber-500/70 via-rose-500/70 to-purple-600/70 text-white shadow-md shadow-rose-950/20 scale-105"
                        : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
