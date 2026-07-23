import { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, MessageCircle, Plus, Bell } from "lucide-react";
import { formatRelativeDate } from "../utils/date";

export default function FeedPage() {
  const { posts, currentUser, comments, notifications, likePost, setActivePage, setSelectedPostId, setShowNotifications, setSelectedProfileUserId } = useApp();
  const hasNotifications = notifications && notifications.length > 0;
  const [doubleTapPostId, setDoubleTapPostId] = useState(null);
  const [lastTap, setLastTap] = useState(0);

  const handleDoubleTap = (postId) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTap < DOUBLE_PRESS_DELAY) {
      const post = posts.find(p => p._id === postId);
      const alreadyLiked = post?.likes.includes(currentUser._id);

      if (!alreadyLiked) {
        likePost(postId);
      }

      // Trigger pop-up heart
      setDoubleTapPostId(postId);
      setTimeout(() => {
        setDoubleTapPostId(null);
      }, 850);
    }
    setLastTap(now);
  };

  const handlePostDetails = (postId) => {
    setSelectedPostId(postId);
    setActivePage("comments");
  };

  // Helper to calculate initials for avatars
  const getInitials = (username) => {
    if (!username) return "GG";
    return username.slice(0, 2).toUpperCase();
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black relative">
      {/* Header */}
      <div className="h-14 px-4 flex items-center justify-between shrink-0 bg-neutral-950/70 backdrop-blur-md absolute top-0 left-0 right-0 z-30 select-none">
        <button
          onClick={() => setActivePage("create")}
          className="p-1.5 text-neutral-300 hover:text-white transition-colors rounded-xl hover:bg-neutral-900 cursor-pointer"
          title="Create Post"
        >
          <Plus className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-white tracking-wide font-sans text-center flex-1">
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

      {/* Feed Scroll Grid */}
      <div className="space-y-4 overflow-y-auto h-full overflow-x-hidden pb-20 pt-15">
        {posts.map((post) => {
          const author = post.user || { username: "anonymous_user", profilePic: "" };
          const isLiked = (post.likes || []).includes(currentUser._id);

          return (
            <div
              key={post._id}
              className="rounded-md overflow-hidden flex flex-col"
            >
              {/* Card Header (Optional mock representation - matches screenshot) */}
              {/* We can show header if user is not visitor, or based on post properties */}
              {author.username !== "no_header_user" && (
                <div
                  className="flex items-center justify-between px-3 py-2 border-b border-neutral-900/10 hover:bg-neutral-900/20 transition-colors select-none"
                >
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProfileUserId(author._id);
                      setActivePage("profile");
                    }}
                    className="flex items-center gap-3 cursor-pointer group/author"
                  >
                    {/* Simple Avatar */}
                    {author.profilePic ? (
                      <img
                        src={author.profilePic}
                        alt={author.username}
                        className="w-7.5 h-7.5 rounded-full object-cover border border-neutral-800 group-hover/author:opacity-85 transition-opacity"
                      />
                    ) : (
                      <div className="w-7.5 h-7.5 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[10px] font-bold text-neutral-300">
                        {getInitials(author.username)}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-neutral-200 group-hover/author:text-rose-400 transition-colors">
                      {author.displayName || author.username}
                    </span>
                  </div>

                  <span 
                    onClick={() => handlePostDetails(post._id)}
                    className="text-[10px] font-semibold text-neutral-500 pr-1 cursor-pointer hover:text-neutral-300 transition-colors"
                  >
                    {formatRelativeDate(post.createdAt)}
                  </span>
                </div>
              )}

              {/* Card Image Content */}
              <div
                onClick={() => handleDoubleTap(post._id)}
                className="relative w-full aspect-16/13 sm:aspect-square bg-neutral-900 overflow-hidden cursor-pointer select-none"
              >
                <img
                  src={post.imageUrl}
                  alt="Post view"
                  className="w-full h-full object-cover"
                />

                {/* Floating Interaction Pill over Image */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="absolute bottom-3 left-3 bg-neutral-950/65 backdrop-blur-md rounded-md px-3 py-1.5 flex items-center justify-center gap-4 text-[14px] font-medium text-neutral-300 select-none shadow-lg z-20"
                >
                  <button
                    onClick={() => likePost(post._id)}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <Heart className={`w-4 h-4 transition-colors ${isLiked ? "text-rose-500 fill-rose-500" : ""}`} />
                    <span>{(post.likes || []).length}</span>
                  </button>

                  <button
                    onClick={() => handlePostDetails(post._id)}
                    className="flex items-center gap-1.5 hover:text-sky-400 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.commentCount || 0}</span>
                  </button>
                </div>

                {/* Pop-up heart double-tap indicator */}
                {doubleTapPostId === post._id && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/15 animate-fade-in">
                    <Heart className="w-20 h-20 text-rose-500 fill-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-heart-pop" />
                  </div>
                )}
              </div>

              {/* Card Caption Tray (Screenshot styling) */}
              <div
                onClick={() => handlePostDetails(post._id)}
                className="px-4 py-3.5 bg-neutral-900/10 hover:bg-neutral-900/30 transition-all cursor-pointer flex flex-col justify-between"
              >
                <p className="text-[14px] font-medium text-neutral-300 leading-relaxed font-sans line-clamp-2 wrap-break-words">
                  {post.caption}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
