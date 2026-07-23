/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import {
  getPosts,
  createPostApi,
  toggleLikePostApi,
  createCommentApi,
  createReplyCommentApi,
  deletePostApi,
  updateProfileApi,
  loginAPI,
  registerAPI,
  getMeAPI,
  logoutAPI,
  getUsersAPI,
  getPostDetailsAPI
} from "../api/index";
import { initSocket, subscribeToNotifications, emitNotification } from "../api/socket";

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  // Navigation / Routing State
  const [activePage, setActivePage] = useState("login"); // 'feed' | 'profile' | 'create' | 'settings' | 'comments' | 'people' | 'notifications' | 'login' | 'register'
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [selectedProfileUserId, setSelectedProfileUserId] = useState(null);
  
  // Data States
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Start in logged-out state
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verify active session on app mount - checking if the user already logged in so that we can grab the token and they don't need to login again on every reload.
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true);
      try {
        const data = await getMeAPI();
        if (data && data.user) {
          setCurrentUser(data.user);
          setSelectedProfileUserId(data.user._id);
          initSocket(data.user._id);
          subscribeToNotifications((newNotif) => {
            console.log("[Notification Received Real-Time]:", newNotif);
            setNotifications(prev => [newNotif, ...prev]);
          });
          setActivePage("feed");
        }
      } catch (error) {
        console.log("No active session found:", error.message);
        setActivePage("login");
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Initialize and fetch starting posts and users when current user changes (e.g. logs in)
  useEffect(() => {
    if (!currentUser) return;
    
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const [postsData, usersData] = await Promise.all([
          getPosts(),
          getUsersAPI()
        ]);
        setPosts(postsData.allPosts || []);
        setUsers(usersData.userData || []);
      } catch (error) {
        console.error("Error loading feed data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [currentUser]);

  // Fetch comments automatically when selectedPostId changes
  useEffect(() => {
    if (!selectedPostId) {
      setComments([]);
      return;
    }

    const fetchPostDetails = async () => {
      try {
        const details = await getPostDetailsAPI(selectedPostId);
        setComments(details.comments || []);
      } catch (error) {
        console.error("Failed to load post details & comments:", error);
      }
    };

    fetchPostDetails();
  }, [selectedPostId]);

  // Actions

  /**
   * Toggle like state on a post
   */
  const likePost = async (postId) => {
    try {
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post._id === postId) {
            const postLikes = post.likes || [];
            const hasLiked = postLikes.includes(currentUser._id);
            const updatedLikes = hasLiked
              ? postLikes.filter(id => id !== currentUser._id) //Removing current user if he has already liked
              : [...postLikes, currentUser._id];  // Adding current user since he hasn't liked the post earlier
            
            // If liking, trigger socket notifications
            const postAuthorId = post.user?._id || post.user;
            if (!hasLiked && postAuthorId !== currentUser._id) {
              emitNotification({
                type: "like",
                targetUserId: postAuthorId,
                postId: post._id,
                senderId: currentUser._id
              });
            }

            return { ...post, likes: updatedLikes };
          }
          return post;
        })
      );

      // Perform API call
      await toggleLikePostApi(postId);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };
  
  /**
   * Add a new comment to a post
   */
  const addComment = async (postId, commentText, parentId = null) => {
    if (!commentText.trim()) return;
    try {
      const response = parentId
        ? await createReplyCommentApi(postId, parentId, commentText)
        : await createCommentApi(postId, commentText);

      // Add to local state
      setComments(prev => [...prev, response.newComment]);

      // Update comment count on the post object in posts state
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p._id === postId
            ? { ...p, commentCount: (p.commentCount || 0) + 1 }
            : p
        )
      );

      // Trigger Notification if comment belongs to someone else
      const targetPost = posts.find(p => p._id === postId);
      if (targetPost) {
        const targetPostAuthorId = targetPost.user?._id || targetPost.user;
        if (targetPostAuthorId !== currentUser._id) {
          emitNotification({
            type: "comment",
            targetUserId: targetPostAuthorId,
            postId: postId,
            senderId: currentUser._id,
            text: commentText
          });
        }
      }

      return response.newComment;
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  /**
   * Create a new post
   */
  const createPost = async (caption, imageFile) => {
    try {
      const response = await createPostApi(caption, imageFile);
      setPosts(prev => [response.newPost, ...prev]);
      setActivePage("feed");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  /**
   * Delete a post
   */
  const deletePost = async (postId) => {
    try {
      await deletePostApi(postId);
      setPosts(prev => prev.filter(post => post._id !== postId));
      setComments(prev => prev.filter(comment => comment.postId !== postId));
      
      // If we deleted the post we were currently viewing, go back to feed/profile
      if (selectedPostId === postId) {
        setSelectedPostId(null);
        setActivePage("feed");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  /**
   * Update user details (Bio & Profile Pic)
   */
  const updateProfile = async (bio, displayName, profilePicFile) => {
    try {
      const response = await updateProfileApi(bio, displayName, profilePicFile);
      const updatedUser = response.user;

      // Update users list
      setUsers(prevUsers =>
        prevUsers.map(u => {
          if (u._id === currentUser._id) {
            return updatedUser;
          }
          return u;
        })
      );

      // Update current user state
      setCurrentUser(updatedUser);
      setActivePage("profile");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  /**
   * Real login logic hitting the backend auth API
   */
  const loginUser = async (username, password) => {
    try {
      const data = await loginAPI(username, password);
      if (data && data.user) {
        setCurrentUser(data.user);
        setSelectedProfileUserId(data.user._id);
        
        // Add to local users if not present
        setUsers(prev => {
          if (!prev.some(u => u._id === data.user._id)) {
            return [...prev, data.user];
          }
          return prev;
        });

        // Init socket connection
        initSocket(data.user._id);
        subscribeToNotifications((newNotif) => {
          console.log("[Notification Received Real-Time]:", newNotif);
          setNotifications(prev => [newNotif, ...prev]);
        });

        setActivePage("feed");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  };

  /**
   * Real registration logic hitting the backend auth API
   */
  const registerUser = async ({ username, displayName, email, password, profilePicFile }) => {
    try {
      const data = await registerAPI(username, password, email, displayName, profilePicFile);
      if (data && data.user) {
        setCurrentUser(data.user);
        setSelectedProfileUserId(data.user._id);

        // Add to local users
        setUsers(prev => {
          if (!prev.some(u => u._id === data.user._id)) {
            return [...prev, data.user];
          }
          return prev;
        });

        // Init socket connection
        initSocket(data.user._id);
        subscribeToNotifications((newNotif) => {
          console.log("[Notification Received Real-Time]:", newNotif);
          setNotifications(prev => [newNotif, ...prev]);
        });

        setActivePage("feed");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error registering:", error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logoutAPI();
      setCurrentUser(null);
      setSelectedProfileUserId(null);
      setActivePage("login");
      localStorage.removeItem('token');
      return true;
    } catch (error) {
      console.error("Error logging out:", error);
      setCurrentUser(null);
      setSelectedProfileUserId(null);
      setActivePage("login");
      localStorage.removeItem('token');
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage,
        showNotifications,
        setShowNotifications,
        selectedPostId,
        setSelectedPostId,
        selectedProfileUserId,
        setSelectedProfileUserId,
        users,
        currentUser,
        posts,
        comments,
        notifications,
        isLoading,
        likePost,
        addComment,
        createPost,
        deletePost,
        updateProfile,
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
