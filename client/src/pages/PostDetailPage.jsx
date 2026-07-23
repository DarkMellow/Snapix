import { useState } from "react";
import { useApp } from "../context/AppContext";
import { ChevronLeft, Bell, Heart, MessageCircle, MoreHorizontal, Send, Trash2, Share2 } from "lucide-react";
import { formatRelativeDate } from "../utils/date";

export default function PostDetailPage() {
  const {
    posts,
    comments,
    currentUser,
    selectedPostId,
    likePost,
    addComment,
    deletePost,
    setActivePage,
    setShowNotifications,
    setSelectedProfileUserId
  } = useApp();

  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Retrieve active post details
  const post = posts.find(p => p._id === selectedPostId);

  if (!post) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-black">
        <span className="text-xs text-neutral-500 font-sans">Snapshot not found.</span>
        <button
          onClick={() => setActivePage("feed")}
          className="mt-3 text-rose-500 text-xs font-semibold hover:underline font-sans"
        >
          Return to Feed
        </button>
      </div>
    );
  }

  // Get author details
  const postUser = post.user || {
    username: "anonymous_user",
    profilePic: ""
  };

  const getInitials = (username) => {
    if (!username) return "GG";
    return username.slice(0, 2).toUpperCase();
  };

  // Get comment details
  const postComments = comments.filter(c => c.postId === selectedPostId);
  const topLevelComments = postComments.filter(c => !c.parentId);
  const getRepliesForComment = (commentId) => postComments.filter(c => c.parentId === commentId);



  const handleSendComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    await addComment(post._id, commentText, replyToId);
    setCommentText("");
    setReplyToId(null);
  };

  const handleDeletePost = () => {
    setShowDeleteConfirm(true);
  };

  const handleSharePost = () => {
    const fakeUrl = `${window.location.origin}/posts/${post._id}`;
    navigator.clipboard.writeText(fakeUrl).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const isLiked = (post.likes || []).includes(currentUser._id);
  const isPostOwner = post.user === currentUser._id;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-black font-sans relative">
      {/* Header */}
      <div className="h-14 border-b border-neutral-900 px-4 flex items-center justify-between shrink-0 bg-neutral-950/70 backdrop-blur-md absolute top-0 left-0 right-0 z-30 select-none">
        <button
          onClick={() => setActivePage("feed")}
          className="p-2 text-neutral-300 hover:text-white transition-colors rounded-full hover:bg-neutral-900"
          title="Back to Feed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <h1 className="text-sm font-bold text-white tracking-wide">
          Snapshot
        </h1>

        <button
          onClick={() => setShowNotifications(true)}
          className="p-2 text-neutral-300 hover:text-white transition-colors rounded-full hover:bg-neutral-900"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
        </button>
      </div>

      {/* Main detail views container */}
      <div className="flex-1 overflow-y-auto pb-24 scrollbar-thin scrollbar-thumb-neutral-800 px-4 pt-18 h-full space-y-4">
        {/* Post Card Layout */}
        <div className="bg-[#121212] rounded-md overflow-hidden border border-neutral-900 shadow-lg">
          {/* Card Author Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-900/10">
            <div className="flex-1 flex items-center justify-between mr-3">
              <div
                onClick={() => {
                  setSelectedProfileUserId(postUser._id);
                  setActivePage("profile");
                }}
                className="flex items-center gap-3 cursor-pointer group/author"
              >
                {/* Simple Avatar */}
                {postUser.profilePic ? (
                  <img
                    src={postUser.profilePic}
                    alt={postUser.username}
                    className="w-7.5 h-7.5 rounded-full object-cover border border-neutral-850 group-hover/author:opacity-85 transition-opacity"
                  />
                ) : (
                  <div className="w-7.5 h-7.5 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[10px] font-bold text-neutral-300">
                    {getInitials(postUser.username)}
                  </div>
                )}

                <span className="text-xs font-semibold text-neutral-200 group-hover/author:text-rose-400 transition-colors">{postUser.displayName || postUser.username}</span>
              </div>

              <span className="text-[10px] font-semibold text-neutral-500">
                {formatRelativeDate(post.createdAt)}
              </span>
            </div>

            {/* Menu Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-900 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>

              {/* Menu Panel */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl z-50 overflow-hidden divide-y divide-neutral-800/60">
                  <button
                    onClick={() => {
                      handleSharePost();
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-2 text-[10px] text-neutral-300 hover:bg-neutral-800 transition-colors text-left font-semibold"
                  >
                    <Share2 className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{isCopied ? "Copied Link!" : "Share Snapshot"}</span>
                  </button>

                  {isPostOwner && (
                    <button
                      onClick={() => {
                        handleDeletePost();
                        setShowDropdown(false);
                      }}
                      className="w-full px-4 py-2.5 flex items-center gap-2 text-[10px] text-rose-500 hover:bg-rose-950/20 transition-colors text-left font-bold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Snapshot</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Post Media */}
          <div className="relative w-full aspect-16/12 sm:aspect-square bg-neutral-900 overflow-hidden select-none">
            <img
              src={post.imageUrl}
              alt="Snapshot detail"
              className="w-full h-full object-cover"
            />

            {/* Floating Interaction Pill over Image (matching feed design, no borders) */}
            <div className="absolute bottom-3 left-3 bg-neutral-950/65 backdrop-blur-md rounded-md px-3 py-1.5 flex items-center justify-center gap-4 text-[14px] font-medium text-neutral-300 select-none shadow-lg z-20">
              <button
                onClick={() => likePost(post._id)}
                className="flex items-center gap-1.5 cursor-pointer"
              >
                <Heart className={`w-4 h-4 transition-colors ${isLiked ? "text-rose-500 fill-rose-500" : ""}`} />
                <span>{(post.likes || []).length}</span>
              </button>

              <div className="flex items-center gap-1.5 text-neutral-300">
                <MessageCircle className="w-4 h-4" />
                <span>{postComments.length}</span>
              </div>
            </div>
          </div>

          {/* Caption Box */}
          <div className="p-4 bg-neutral-950/15">
            <p className="text-[11px] text-neutral-300 leading-relaxed font-sans font-medium">
              {post.caption || "No caption added"}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 pl-1 select-none">
            Comments ({postComments.length})
          </span>

          {topLevelComments.length === 0 ? (
            <div className="py-6 text-center select-none">
              <p className="text-[14px] text-neutral-500 italic">No comments. Add one below!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topLevelComments.map((comment) => {
                const commenter = comment.userId || { username: "anonymous_user", profilePic: "" };
                const replies = getRepliesForComment(comment._id);

                return (
                  <div key={comment._id} className="space-y-2 bg-[#121212]/35 border border-neutral-950 rounded-xl p-3">
                    {/* Top level comment item */}
                    <div className="flex items-start gap-2.5">
                      <div
                        onClick={() => {
                          setSelectedProfileUserId(commenter._id);
                          setActivePage("profile");
                        }}
                        className="cursor-pointer hover:opacity-85 transition-opacity shrink-0"
                      >
                        {commenter.profilePic ? (
                          <img
                            src={commenter.profilePic}
                            alt={commenter.username}
                            className="w-6.5 h-6.5 rounded-full object-cover border border-neutral-850"
                          />
                        ) : (
                          <div className="w-6.5 h-6.5 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[8px] font-bold text-neutral-300">
                            {getInitials(commenter.username)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col min-w-0">
                        <div className="text-[14px] leading-5 wrap-break-words font-medium text-neutral-300">
                          <span
                            onClick={() => {
                              setSelectedProfileUserId(commenter._id);
                              setActivePage("profile");
                            }}
                            className="font-bold text-neutral-500 mr-1.5 cursor-pointer"
                          >
                            {commenter.displayName || commenter.username}
                          </span>
                          : {comment.comment}
                        </div>
                        <div className="flex items-center gap-3.5 mt-1.5 text-[11px] text-neutral-500 font-medium select-none">
                          <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <button
                            onClick={() => {
                              setReplyToId(comment._id);
                              setCommentText(`@${commenter.username} `);
                            }}
                            className="text-rose-500 hover:text-rose-400"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Replies */}
                    {replies.map((reply) => {
                      const replier = reply.userId || { username: "anonymous_user", profilePic: "" };
                      return (
                        <div key={reply._id} className="flex items-start gap-2.5 pl-6 pt-1">
                          <div
                            onClick={() => {
                              setSelectedProfileUserId(replier._id);
                              setActivePage("profile");
                            }}
                            className="cursor-pointer hover:opacity-85 transition-opacity shrink-0"
                          >
                            {replier.profilePic ? (
                              <img
                                src={replier.profilePic}
                                alt={replier.username}
                                className="w-5.5 h-5.5 rounded-full object-cover border border-neutral-850"
                              />
                            ) : (
                              <div className="w-5.5 h-5.5 rounded-full bg-neutral-900 border border-neutral-850 flex items-center justify-center text-[7px] font-bold text-neutral-300">
                                {getInitials(replier.username)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1 flex flex-col min-w-0">
                            <div className="text-[13px] leading-4 wrap-break-words font-medium text-neutral-300">
                              <span
                                onClick={() => {
                                  setSelectedProfileUserId(replier._id);
                                  setActivePage("profile");
                                }}
                                className="font-bold text-neutral-500 mr-1.5 cursor-pointer hover:text-rose-400 transition-colors"
                              >
                                {replier.displayName || replier.username}
                              </span>
                              {reply.comment}
                            </div>
                            <span className="text-[10px] text-neutral-500 font-bold mt-1">
                              {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom comment box */}
      <form
        onSubmit={handleSendComment}
        className="absolute bottom-0 left-0 right-0 bg-neutral-950/95 border-t border-neutral-900/60 p-3.5 flex items-center gap-3 z-30"
      >
        <div className="flex-1 flex items-center relative">
          <input
            type="text"
            placeholder={replyToId ? "Write a reply..." : "Write a comment..."}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 text-[14px] font-medium rounded-md py-2 pl-4 pr-12 focus:outline-none focus:border-rose-500 text-neutral-200 placeholder-neutral-500"
          />
          {replyToId && (
            <button
              type="button"
              onClick={() => {
                setReplyToId(null);
                setCommentText("");
              }}
              className="absolute right-3 text-[12px] bg-neutral-800 text-neutral-400 hover:text-white px-1.5 py-0.5 rounded-md font-bold"
            >
              Cancel
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={!commentText.trim()}
          className="h-[38px] w-[38px]  flex items-center border border-neutral-800 justify-center bg-rose-500 hover:bg-rose-600 disabled:bg-neutral-900 disabled:text-neutral-600 text-white rounded-md transition-all active:scale-95 disabled:scale-100 shrink-0 cursor-pointer disabled:cursor-not-allowed"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* iOS style custom delete confirm modal overlay */}
      {showDeleteConfirm && (
        <div
          onClick={() => setShowDeleteConfirm(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-backdrop-fade"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-[270px] bg-[#1c1c1e]/95 backdrop-blur-xl border border-neutral-800/80 rounded-2xl flex flex-col text-center shadow-2xl animate-pop-scale"
          >
            {/* Alert Content */}
            <div className="p-5 flex flex-col items-center">
              <h3 className="text-[14px] font-bold text-white tracking-wide">
                Delete Post?
              </h3>
              <p className="text-[11px] text-neutral-400 leading-normal mt-2 select-none">
                Are you sure you want to delete this snapshot permanently? This action cannot be undone.
              </p>
            </div>

            {/* Alert Actions Panel (iOS Style Side-by-Side) */}
            <div className="flex border-t border-neutral-800/60 h-11 shrink-0">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 text-[13px] font-medium text-neutral-400 hover:text-white transition-colors cursor-pointer border-r border-neutral-800/60 flex items-center justify-center active:bg-neutral-800/30"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deletePost(post._id);
                  setShowDeleteConfirm(false);
                  setActivePage("profile"); // Navigate back to profile
                }}
                className="flex-1 text-[13px] font-bold text-rose-500 hover:text-rose-400 transition-colors cursor-pointer flex items-center justify-center active:bg-neutral-800/30"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
