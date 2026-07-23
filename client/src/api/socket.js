// This is the Socket.io real-time integration skeleton.
// You can install 'socket.io-client' and use this file to manage your socket instance.
// e.g., run: npm install socket.io-client

// NOTE - Connect Socket.io client setup:
// Uncomment below code once you install socket.io-client and configure the server URL:
/*
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Replace with your backend server URL
export let socket = null;

export const initSocket = (userId) => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      query: { userId },
      transports: ["websocket"]
    });
    
    socket.on("connect", () => {
      console.log("Connected to Realtime Notification Socket server:", socket.id);
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
*/

// --- MOCK REALTIME SKELETON (For Front-End Demo) ---
// This simulate how socket.io receives notifications from other users.
let mockListeners = [];

export const initSocket = (userId) => {
  console.log(`[Socket Mock] Initialized socket connection for User: ${userId}`);
  
  // Simulation: Trigger a mock notification occasionally to demonstrate the real-time UI
  const timer = setTimeout(() => {
    const mockEvents = [
      {
        _id: "notif_mock_" + Math.random().toString(36).substr(2, 9),
        type: "like",
        senderId: "user_travelexplorer",
        postId: "post_4",
        createdAt: new Date().toISOString()
      },
      {
        _id: "notif_mock_" + Math.random().toString(36).substr(2, 9),
        type: "comment",
        senderId: "user_johndoe",
        postId: "post_4",
        text: "Wow, this looks really high quality! 😮🔥",
        createdAt: new Date().toISOString()
      }
    ];
    
    // Send one random event to listeners
    const randomEvent = mockEvents[Math.floor(Math.random() * mockEvents.length)];
    triggerMockNotification(randomEvent);
  }, 10000); // Wait 10 seconds, then trigger a random like/comment

  return {
    disconnect: () => {
      console.log("[Socket Mock] Disconnected");
      clearTimeout(timer);
    }
  };
};

/**
 * Register a listener for real-time notifications
 * @param {Function} callback (notification) => void
 */
export const subscribeToNotifications = (callback) => {
  // NOTE - Connect Socket.io client listener:
  // Once real socket is connected, change this to:
  // if (socket) {
  //   socket.on("new_notification", callback);
  // }
  
  mockListeners.push(callback);
  return () => {
    // Clean up listener
    mockListeners = mockListeners.filter(l => l !== callback);
    // NOTE - socket.off("new_notification", callback);
  };
};

/**
 * Helper to manually dispatch an event to simulated listeners
 */
export const triggerMockNotification = (notification) => {
  mockListeners.forEach(listener => listener(notification));
};

/**
 * Emit a notification trigger when current user performs an action
 * (In a real socket.io flow, you might emit this directly to the server
 *  or let the HTTP POST route on the backend trigger it to the target user)
 * @param {Object} data { type, targetUserId, postId, text }
 */
export const emitNotification = (data) => {
  // NOTE - Emit real-time events to Socket Server:
  // if (socket) {
  //   socket.emit("send_notification", data);
  // }
  console.log("[Socket Mock] Emitted notification event to server:", data);
};
