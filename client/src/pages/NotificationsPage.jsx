import { useApp } from "../context/AppContext";
import { Bell, Heart, MessageCircle, X, ArrowRight } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, users, posts, setActivePage, setSelectedPostId, setShowNotifications, setSelectedProfileUserId } = useApp();

  const handleNotificationClick = (postId) => {
    if (!postId) return;
    
    // Find if post exists
    const postExists = posts.some(p => p._id === postId);
    if (postExists) {
      setSelectedPostId(postId);
      setActivePage("comments");
      setShowNotifications(false); // Dismiss overlay modal
    }
  };

  const getUserDetails = (userId) => {
    return users.find(u => u._id === userId) || {
      username: "someone",
      profilePic: "https://ursmindfully.com/wp-content/uploads/2020/08/Profile-Icon-SVG-09856789.png"
    };
  };

  return (
    <div 
      onClick={() => setShowNotifications(false)}
      className="absolute inset-0 z-50 flex flex-col justify-end font-sans animate-backdrop-fade"
    >
      {/* Modal Sheet */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#0b0b0d] border-t border-neutral-900 rounded-t-[32px] max-h-[75%] flex flex-col overflow-hidden shadow-2xl animate-slide-up"
      >
        {/* Header */}
        <div className="h-14 px-5 flex items-center justify-between shrink-0 bg-neutral-950/40 border-b border-neutral-900 select-none">
          <div className="flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 text-rose-500" />
            <h2 className="text-xs font-bold text-white tracking-wide">
              Notifications
            </h2>
          </div>
          
          <button 
            onClick={() => setShowNotifications(false)}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-xl transition-all active:scale-95 cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-neutral-900/40 scrollbar-thin scrollbar-thumb-neutral-800">
          {notifications.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-center p-6 space-y-2 select-none">
              <span className="text-2xl">💤</span>
              <p className="text-xs text-neutral-500 italic">No activity yet. Notifications will show up here.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const sender = getUserDetails(notif.senderId);
              const isLike = notif.type === "like";

              return (
                <div 
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif.postId)}
                  className={`py-3.5 flex items-start justify-between gap-3 cursor-pointer group transition-all rounded-xl px-2.5 my-1 hover:bg-neutral-900/40 border border-transparent hover:border-neutral-900/60`}
                >
                  <div className="flex items-start gap-3">
                    {/* Sender Avatar */}
                    <img 
                      src={sender.profilePic} 
                      alt={sender.username} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProfileUserId(sender._id);
                        setActivePage("profile");
                        setShowNotifications(false);
                      }}
                      className="w-9 h-9 rounded-full object-cover shrink-0 mt-0.5 border border-neutral-800 cursor-pointer hover:opacity-80 transition-opacity"
                    />

                    <div className="flex flex-col">
                      <p className="text-xs text-neutral-300 leading-normal">
                        <span 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProfileUserId(sender._id);
                            setActivePage("profile");
                            setShowNotifications(false);
                          }}
                          className="font-bold text-white mr-1.5 cursor-pointer hover:text-rose-400 transition-colors"
                        >
                          {sender.displayName || sender.username}
                        </span>
                        {isLike ? "liked your snapshot." : "commented: "}
                        {!isLike && notif.text && (
                          <span className="italic text-neutral-400 font-medium block mt-1 bg-neutral-900/50 p-2 rounded-lg border border-neutral-900/30">
                            "{notif.text}"
                          </span>
                        )}
                      </p>
                      <span className="text-[9px] text-neutral-500 font-semibold mt-1">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Right side icon */}
                  <div className="flex items-center gap-1.5 self-center shrink-0">
                    {isLike ? (
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    ) : (
                      <MessageCircle className="w-4 h-4 text-sky-400 fill-sky-950/40" />
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
