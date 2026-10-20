
/**
 * Nawab Social Platform (Nawab) — Auth State Module
 * Author: Nawab | Nawab Social Platform
 */

const auth = {
  getToken() {
    return localStorage.getItem('nawab_token');
  },

  getUser() {
    try {
      const userData =
        localStorage.getItem('nawab_user') ||
        localStorage.getItem('pulse_user');

      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Unable to read saved user:', error);
      return null;
    }
  },

  setSession(token, user) {
    if (!token) {
      throw new Error('Login response did not contain an authentication token.');
    }

    if (!user) {
      throw new Error('Login response did not contain user information.');
    }

    localStorage.setItem('nawab_token', token);
    localStorage.setItem('nawab_user', JSON.stringify(user));
    localStorage.removeItem('pulse_user');

    this.updateUserMiniUI();
  },

  logout() {
    localStorage.removeItem('nawab_token');
    localStorage.removeItem('nawab_user');
    localStorage.removeItem('pulse_user');

    if (typeof window.showToast === 'function') {
      window.showToast('Signed out of Nawab', 'info');
    }

    window.setTimeout(() => {
      window.location.href = 'auth.html';
    }, 500);
  },

  isLoggedIn() {
    return Boolean(this.getToken());
  },

  updateUserMiniUI() {
    const miniCard = document.getElementById('userMiniCard');
    const user = this.getUser();

    if (miniCard) {
      if (user && this.isLoggedIn()) {
        const avatar =
          user.avatar ||
          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
            user.name || 'User'
          )}`;

        const profileId = encodeURIComponent(user.id || '');

        miniCard.innerHTML = `
          <img
            src="${avatar}"
            alt="User Avatar"
            class="user-mini-avatar"
            onclick="window.location.href='profile.html?id=${profileId}'"
            style="cursor:pointer;"
          >

          <div
            class="user-mini-details"
            onclick="window.location.href='profile.html?id=${profileId}'"
            style="cursor:pointer;"
          >
            <div class="user-mini-name"></div>
            <div class="user-mini-handle"></div>
          </div>

          <button
            class="user-logout-btn"
            onclick="window.auth.logout()"
            title="Log out"
            type="button"
          >
            <svg
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
          </button>
        `;

        // Set user-provided text safely.
        miniCard.querySelector('.user-mini-name').textContent =
          user.name || 'Nawab User';

        miniCard.querySelector('.user-mini-handle').textContent =
          `@${user.handle || 'user'}`;
      } else {
        miniCard.innerHTML = `
          <a
            href="auth.html"
            style="width:100%;text-align:center;font-size:0.9rem;font-weight:700;color:var(--accent-primary);"
          >
            Sign In / Register →
          </a>
        `;
      }
    }

    // Update the avatar in the post composer, if present.
    const compAvatar = document.getElementById('composerAvatar');

    if (compAvatar && user) {
      compAvatar.src =
        user.avatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          user.name || 'User'
        )}`;
    }
  }
};

// Expose auth methods to auth.html and other browser scripts.
window.auth = auth;

// Initialize the user interface after the page loads.
document.addEventListener('DOMContentLoaded', () => {
  auth.updateUserMiniUI();
});
