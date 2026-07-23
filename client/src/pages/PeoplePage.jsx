import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Bell, Search, Plus } from "lucide-react";

export default function PeoplePage() {
  const { users, notifications, setActivePage, setShowNotifications, setSelectedProfileUserId } = useApp();
  const [searchTerm, setSearchTerm] = useState("");
  const hasNotifications = notifications && notifications.length > 0;

  // Filter out current user and apply search filter
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black font-sans relative">
      {/* Header */}
      <div className="h-14 border-b border-neutral-900 px-4 flex items-center justify-between shrink-0 bg-neutral-950/70 backdrop-blur-md absolute top-0 left-0 right-0 z-30 select-none">
        <button 
          onClick={() => setActivePage("create")}
          className="p-1.5 text-neutral-300 hover:text-white transition-colors rounded-xl hover:bg-neutral-900 cursor-pointer"
          title="Create Post"
        >
          <Plus className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-white tracking-wide text-center flex-1">
          Snapix
        </h1>

        <button 
          onClick={() => setShowNotifications(true)}
          className="p-1.5 text-neutral-300 hover:text-white transition-colors rounded-xl hover:bg-neutral-900 cursor-pointer relative"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {hasNotifications && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-rose-500 rounded-full" />
          )}
        </button>
      </div>

      {/* Explore Panel */}
      <div className="flex-1 flex flex-col overflow-hidden pt-14 h-full">

        {/* Search Bar */}
        <div className="p-3.5 border-b border-neutral-900/50 flex items-center shrink-0">
          <div className="w-full flex items-center relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5" />
            <input 
              type="text" 
              placeholder="Search other users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-900/60 border border-neutral-800 text-xs rounded-full py-2.5 pl-10 pr-4 focus:outline-none focus:border-rose-500 text-neutral-200 placeholder-neutral-500"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-neutral-900/40 scrollbar-thin scrollbar-thumb-neutral-800">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 text-xs select-none">
              No matching users found
            </div>
          ) : (
            filteredUsers.map((user) => {
              
              return (
                <div key={user._id} className="py-3 flex items-center justify-between gap-4">
                  <div 
                    onClick={() => {
                      setSelectedProfileUserId(user._id);
                      setActivePage("profile");
                    }}
                    className="flex items-center gap-3 cursor-pointer group/user flex-1"
                  >
                    <img 
                      src={user.profilePic} 
                      alt={user.username} 
                      className="w-10 h-10 rounded-full object-cover border border-neutral-800 group-hover/user:opacity-85 transition-opacity"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white group-hover/user:text-rose-400 transition-colors leading-none">
                        {user.displayName || user.username}
                      </span>
                      <span className="text-[10.5px] text-neutral-500 font-medium mt-1.5">
                        @{user.username}
                      </span>
                    </div>
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
