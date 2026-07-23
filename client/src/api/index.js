// This file serves as the API integration layer.

const BASE_URL = import.meta.env.VITE_API_URL || "";

/**
 * Centered fetch wrapper that appends VITE_API_URL, enforces CORS credentials inclusion,
 * and handles HTML/JSON errors gracefully before parsing.
 */
const apiFetch = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  options.credentials = "include";
  const response = await fetch(url, options);
  
  if (!response.ok) {
    let errMsg = `Request failed with status ${response.status}`;
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        errMsg = data.message || errMsg;
      }
    } catch (e) {
      // ignore parsing error
    }
    throw new Error(errMsg);
  }
  return response;
};

/**
 * Fetch all posts from feed
 */
export const getPosts = async () => {
  const response = await apiFetch('/api/content/feed');
  return await response.json();
};

/**
 * Create a new post
 * @param {String} caption 
 * @param {File} imageFile 
 */
export const createPostApi = async (caption, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);
  formData.append("caption", caption);

  const response = await apiFetch('/api/content/post', {
    method: 'POST',
    body: formData
  });

  return await response.json();
};

/**
 * Toggle liking a post
 * @param {string} postId 
 */
export const toggleLikePostApi = async (postId) => {
  const response = await apiFetch(`/api/content/${postId}/like`, { method: 'POST' });
  return await response.json();
};

/**
 * Create a new top-level comment
 * @param {string} postId - The ID of the post
 * @param {string} comment - The comment text
 */
export const createCommentApi = async (postId, comment) => {
  const response = await apiFetch(`/api/comments/${postId}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment })
  });
  return await response.json();
};

/**
 * Create a reply to an existing comment
 * @param {string} postId - The ID of the post
 * @param {string} commentId - The ID of the parent comment
 * @param {string} comment - The reply comment text
 */
export const createReplyCommentApi = async (postId, commentId, comment) => {
  const response = await apiFetch(`/api/comments/${postId}/reply/${commentId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment })
  });
  return await response.json();
};

/**
 * Delete a post
 * @param {string} postId 
 */
export const deletePostApi = async (postId) => {
  const response = await apiFetch(`/api/content/${postId}`, { method: 'DELETE' });
  return await response.json();
};

/**
 * Update user profile settings
 * @param {string} bio 
 * @param {string} displayName 
 * @param {File} profilePicFile 
 */
export const updateProfileApi = async (bio, displayName, profilePicFile) => {
  const formData = new FormData();
  formData.append('bio', bio);
  formData.append('displayName', displayName);
  if (profilePicFile) {
    formData.append('profilePic', profilePicFile);
  }

  const response = await apiFetch('/api/user/update', {
    method: 'PUT',
    body: formData
  });
  return await response.json();
};


/**
 * Login an existing user
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 */
export const loginAPI = async (username, password) => {
  const response = await apiFetch(`/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  // Store token in localStorage to maintain user session
  localStorage.setItem('token', data.token);
  return data;
};


/**
 * Register new user
 * @param {string} username - The username of the user
 * @param {string} password - The password of the user
 * @param {string} email    - The email of the user
 * @param {string} displayName - The display name of the user
 * @param {File} profilePicFile - The profile picture of the user
 */
export const registerAPI = async (username, password, email, displayName, profilePicFile) => {
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  formData.append("email", email);
  formData.append("displayName", displayName);
  formData.append("profilePic", profilePicFile);

  const response = await apiFetch(`/api/auth/register`, {
    method: 'POST',
    body: formData
  });
  const data = await response.json();
  return data;
};

/**
 * Fetch currently logged-in user profile from active session cookie
 */
export const getMeAPI = async () => {
  const response = await apiFetch('/api/auth/me');
  const data = await response.json();
  return data;
};

/**
 * Logout the currently logged-in user session
 */
export const logoutAPI = async () => {
  const response = await apiFetch('/api/auth/logout', { method: 'POST' });
  const data = await response.json();
  return data;
};

/**
 * Fetch all registered users from the database
 */
export const getUsersAPI = async () => {
  const response = await apiFetch('/api/data/users');
  const data = await response.json();
  return data;
};

/**
 * Fetch a single post's details (including populated comments) from the database
 */
export const getPostDetailsAPI = async (postId) => {
  const response = await apiFetch(`/api/content/${postId}`);
  const data = await response.json();
  return data;
};