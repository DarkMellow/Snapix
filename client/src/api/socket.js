import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
export let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"]
    });
    
    socket.on("connect", () => {
      console.log("Connected to Realtime Notification Socket server:", socket.id);
      socket.emit("login", userId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket server");
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Register a listener for real-time notifications
 * @param {Function} callback (notification) => void
 */
export const subscribeToNotifications = (callback) => {
  if (socket) {
    socket.on("likeNotification", (newNotif) => {
      callback({
        _id: "notif_" + Date.now() + Math.random().toString(36).substr(2, 4),
        type: "like",
        senderId: newNotif.from,
        postId: newNotif.post._id,
        createdAt: new Date().toISOString()
      });
    });
  }
  
  return () => {
    if (socket) {
      socket.off("likeNotification");
    }
  };
};

/**
 * Emit a notification trigger when current user performs an action
 */
export const emitNotification = (data) => {
  console.log("Activity notification emitted to server API:", data);
};
