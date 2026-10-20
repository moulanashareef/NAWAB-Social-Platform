
/**
 * Nawab Social Platform (Nawab) — API Client
 * Author: Nawab | Nawab Social Platform
 */

const API_BASE = 'http://localhost:5001/api';

function getAuthHeaders() {
  const token = localStorage.getItem('nawab_token');

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

// Common response handler
async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || '';

  let data;

  if (contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const text = await response.text();
    data = {
      message: text || `Request failed (${response.status})`
    };
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
      data.error ||
      `Request failed (${response.status})`
    );
  }

  return data;
}

const api = {
  async getFeed(filter = 'all') {
    const res = await fetch(
      `${API_BASE}/posts?filter=${encodeURIComponent(filter)}`,
      { headers: getAuthHeaders() }
    );

    return handleResponse(res);
  },

  async createPost(postData) {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData)
    });

    return handleResponse(res);
  },

  async toggleLike(postId) {
    const res = await fetch(`${API_BASE}/posts/${postId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    return handleResponse(res);
  },

  async addComment(postId, content) {
    const res = await fetch(`${API_BASE}/posts/${postId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });

    return handleResponse(res);
  },

  async searchUsers(query) {
    const res = await fetch(
      `${API_BASE}/users/search?q=${encodeURIComponent(query)}`,
      { headers: getAuthHeaders() }
    );

    return handleResponse(res);
  },

  async getUser(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}`, {
      headers: getAuthHeaders()
    });

    return handleResponse(res);
  },

  async toggleFollow(userId) {
    const res = await fetch(`${API_BASE}/users/${userId}/follow`, {
      method: 'POST',
      headers: getAuthHeaders()
    });

    return handleResponse(res);
  },

  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });

    return handleResponse(res);
  },

  async markNotificationsRead() {
    const res = await fetch(`${API_BASE}/notifications/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });

    return handleResponse(res);
  },

  async getSidebar() {
    const res = await fetch(`${API_BASE}/sidebar`, {
      headers: getAuthHeaders()
    });

    return handleResponse(res);
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    return handleResponse(res);
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    return handleResponse(res);
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      headers: getAuthHeaders()
    });

    return handleResponse(res);
  }
};

// Expose the API client to auth.html and other browser scripts.
window.api = api;
