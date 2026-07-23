import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Heart, Edit3, Grid, Image as ImageIcon, ChevronLeft, Settings, LogOut } from "lucide-react";

// Hook to extract the dominant/vibrant color from an image URL dynamically
function useDominantColor(imageUrl) {
  const [color, setColor] = useState("#f43f5e"); // Fallback color

  useEffect(() => {
    let isMounted = true;

    if (!imageUrl) {
      const timer = setTimeout(() => {
        if (isMounted) setColor("#f43f5e");
      }, 0);
      return () => {
        isMounted = false;
        clearTimeout(timer);
      };
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 10;
        canvas.height = 10;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, 10, 10);
        const imgData = ctx.getImageData(0, 0, 10, 10).data;
        
        let maxVibrancy = -1;
        let dominantColor = "#f43f5e";
        let rSum = 0, gSum = 0, bSum = 0, count = 0;
        
        for (let i = 0; i < imgData.length; i += 4) {
          const r = imgData[i];
          const g = imgData[i+1];
          const b = imgData[i+2];
          const a = imgData[i+3];
          
          if (a > 220) {
            const maxVal = Math.max(r, g, b);
            const minVal = Math.min(r, g, b);
            const vibrancy = maxVal - minVal;
            
            rSum += r;
            gSum += g;
            bSum += b;
            count++;
            
            if (vibrancy > maxVibrancy) {
              maxVibrancy = vibrancy;
              const toHex = (c) => c.toString(16).padStart(2, "0");
              dominantColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;
            }
          }
        }
        
        if (maxVibrancy < 30 && count > 0) {
          const rAvg = Math.round(rSum / count);
          const gAvg = Math.round(gSum / count);
          const bAvg = Math.round(bSum / count);
          const toHex = (c) => c.toString(16).padStart(2, "0");
          dominantColor = `#${toHex(rAvg)}${toHex(gAvg)}${toHex(bAvg)}`;
        }

        if (isMounted) {
          setColor(dominantColor);
        }
      } catch (e) {
        console.warn("Canvas dominant color extraction failed:", e);
        if (isMounted) setColor("#f43f5e");
      }
    };

    img.onerror = () => {
      if (isMounted) setColor("#f43f5e");
    };

    return () => {
      isMounted = false;
    };
  }, [imageUrl]);

  return color;
}

export default function ProfilePage() {
  const { posts, users, currentUser, setActivePage, setSelectedPostId, selectedProfileUserId, logoutUser } = useApp();
  
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const profileUser = users.find(u => u._id === selectedProfileUserId) || currentUser;
  const themeColor = useDominantColor(profileUser.profilePic);
  const isOwnProfile = profileUser._id === currentUser._id;

  // Filter posts that belong to user profile being viewed
  const userPosts = posts.filter(p => p.user._id === profileUser._id);

  // Calculate total likes dynamically
  const totalLikes = userPosts.reduce((acc, curr) => acc + curr.likes.length, 0);

  const handlePostClick = (postId) => {
    setSelectedPostId(postId);
    setActivePage("comments");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black font-sans relative">
      {/* Header */}
      <div className="h-14 border-b border-neutral-900 px-4 flex items-center justify-between shrink-0 bg-neutral-950/70 backdrop-blur-md absolute top-0 left-0 right-0 z-30 select-none">
        <button 
          onClick={() => {
            if (isOwnProfile) {
              setActivePage("feed");
            } else {
              setActivePage("people");
            }
          }}
          className="p-1.5 text-neutral-300 hover:text-white transition-colors rounded-xl hover:bg-neutral-900 cursor-pointer"
          title="Back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-white tracking-wide text-center flex-1">
          Snapix
        </h1>

        <div className="flex items-center gap-1">
          {isOwnProfile && (
            <button 
              onClick={() => setShowSettingsModal(true)}
              className="p-1.5 text-neutral-300 hover:text-white transition-colors rounded-xl hover:bg-neutral-900 cursor-pointer"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Profile Details Area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-800 pt-14 h-full pb-20 relative">
        {/* Top linear gradient starting from the very top of the screen/container (y = 0) */}
        <div 
          style={{
            backgroundImage: `linear-gradient(to bottom, ${themeColor}38, transparent)`
          }}
          className="absolute top-0 left-0 right-0 h-48 pointer-events-none z-0" 
        />

        {/* User Card */}
        <div className="relative p-6 border-b border-neutral-900/60 bg-neutral-950/15 overflow-hidden z-10">
          <div className="relative flex flex-col z-10">
            {/* Top row: Avatar on left, Name/Username/Likes on right */}
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <img 
                  src={profileUser.profilePic} 
                  alt={profileUser.username} 
                  className="w-18 h-18 rounded-full object-cover border border-neutral-800 shadow-xl"
                />
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-lg font-bold text-white leading-tight truncate select-none">
                  {profileUser.displayName || profileUser.username}
                </h2>
                <div className="flex items-center gap-2 mt-1 select-none text-[12.5px] text-neutral-500 font-semibold font-sans">
                  <span className="truncate">@{profileUser.username}</span>
                  <span className="shrink-0">•</span>
                  <span className="text-neutral-400 font-bold shrink-0">
                    {new Intl.NumberFormat().format(totalLikes)} {totalLikes === 1 ? "like" : "likes"}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle row: Bio (full width) */}
            {profileUser.bio ? (
              <p className="text-[13px] text-neutral-350 mt-4 leading-relaxed font-sans wrap-break-words pl-0.5">
                {profileUser.bio}
              </p>
            ) : (
              <p className="text-[11px] text-neutral-600 mt-4 italic font-sans pl-0.5">
                No bio added yet.
              </p>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="p-3">
          <div className="flex items-center gap-2 mb-3 text-neutral-400 px-1 select-none">
            <Grid className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-bold uppercase tracking-wider">My Snapshots ({userPosts.length})</span>
          </div>

          {userPosts.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <ImageIcon className="w-10 h-10 text-neutral-700" />
              <span className="text-sm font-medium text-neutral-500">No photos published yet</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {userPosts.map((post) => (
                <div 
                  key={post._id}
                  onClick={() => handlePostClick(post._id)}
                  className="aspect-square bg-neutral-900 rounded-xl overflow-hidden cursor-pointer relative group shadow-md"
                >
                  <img 
                    src={post.imageUrl} 
                    alt="Grid thumbnail" 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-350"
                  />
                  {/* Hover stats overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity text-white text-xs font-semibold">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likes.length}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings Modal (Slide-up Panel with subtle fade-in background) */}
      {showSettingsModal && (
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end justify-center animate-fade-in"
          onClick={() => setShowSettingsModal(false)}
        >
          <div 
            className="w-full bg-[#161616] rounded-t-2xl border-t border-neutral-900 p-6 space-y-4 shadow-2xl animate-slide-up max-w-md select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Settings</span>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-neutral-500 hover:text-neutral-300 text-xs font-semibold"
              >
                Done
              </button>
            </div>

            {/* Options list */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  setActivePage("settings");
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl bg-neutral-900/50 hover:bg-neutral-850 transition-colors text-left"
              >
                <Edit3 className="w-4.5 h-4.5 text-neutral-400" />
                <span className="text-xs font-semibold text-neutral-200">Edit Profile</span>
              </button>

              <button
                onClick={() => {
                  setShowSettingsModal(false);
                  logoutUser();
                }}
                className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl bg-rose-950/15 hover:bg-rose-950/30 transition-colors text-left"
              >
                <LogOut className="w-4.5 h-4.5 text-rose-500" />
                <span className="text-xs font-bold text-rose-500">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
