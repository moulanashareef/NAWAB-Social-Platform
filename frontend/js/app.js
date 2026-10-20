
/**
 * Nawab Social Platform (Nawab) — Feed & Interactions App
 * Author: Nawab | Nawab Social Platform
 */

// Global Toast System
window.showToast = function (message, type = 'info') {
  let container = document.getElementById('toastContainer');

  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  let icon = 'ℹ️';
  if (type === 'success') icon = '🎉';
  if (type === 'error') icon = '⚠️';

  const iconSpan = document.createElement('span');
  iconSpan.textContent = icon;

  const messageSpan = document.createElement('span');
  messageSpan.textContent = String(message ?? '');

  toast.append(iconSpan, messageSpan);
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
};

const app = {
  currentFilter: 'all',
  selectedAttachmentUrl: null,

  escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  },

  // Safely format image URLs.
  safeImageUrl(value) {
    if (typeof value !== 'string' || !value.trim()) return '';
    try {
      const url = new URL(value, window.location.href);
      if (url.protocol === 'https:' || url.protocol === 'http:') {
        return this.escapeHtml(url.href);
      }
    } catch (_) {}
    return '';
  },

  init() {
    this.bindEvents();
    this.loadFeed(this.currentFilter);
    this.loadSidebar();
  },

  bindEvents() {
    // Creator search
    const searchInput = document.getElementById('userSearchInput');
    const searchButton = document.getElementById('userSearchButton');

    const runSearch = async () => {
      const q = searchInput ? searchInput.value.trim() : '';
      const resultsBox = document.getElementById('userSearchResults');

      if (!resultsBox) return;

      if (!q) {
        resultsBox.hidden = true;
        resultsBox.innerHTML = '';
        return;
      }

      resultsBox.hidden = false;
      resultsBox.innerHTML =
        '<p class="search-empty">Searching creators…</p>';

      try {
        const result = await api.searchUsers(q);
        const users = Array.isArray(result.users) ? result.users : [];

        resultsBox.innerHTML = users.length
          ? users.map(user => {
              const avatar = this.safeImageUrl(user.avatar);
              const id = encodeURIComponent(String(user.id ?? ''));
              const name = this.escapeHtml(user.name || 'Creator');
              const handle = this.escapeHtml(user.handle || 'creator');
              const bio = this.escapeHtml(user.bio || '');

              return `
                <a class="search-result-person"
                   href="profile.html?id=${id}">
                  <img src="${avatar}" alt="" loading="lazy">
                  <span>
                    <strong>${name}</strong>
                    <small>@${handle} · ${bio}</small>
                  </span>
                  <b>View profile ↗</b>
                </a>`;
            }).join('')
          : '<p class="search-empty">No creators found. Try another name or handle.</p>';
      } catch (error) {
        console.error('Creator search error:', error);
        resultsBox.innerHTML =
          '<p class="search-empty">Search is unavailable. Check that the backend is running.</p>';
      }
    };

    if (searchButton) {
      searchButton.addEventListener('click', runSearch);
    }

    if (searchInput) {
      searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') runSearch();
      });
    }

    // Notifications
    const activityButton = document.getElementById('notificationsButton');
    const activityPanel = document.getElementById('notificationsPanel');

    if (activityButton && activityPanel) {
      activityButton.addEventListener('click', () => {
        const open = activityPanel.hidden;
        activityPanel.hidden = !open;
        activityButton.setAttribute('aria-expanded', String(open));

        if (!open) return;

        if (!window.auth || !auth.isLoggedIn()) {
          activityPanel.innerHTML = `
            <strong>Your notifications</strong>
            <p>Sign in to see notifications for follows, likes, and comments.</p>
            <a href="auth.html">Sign in to Nawab ↗</a>`;
          return;
        }

        activityPanel.innerHTML = `
          <strong>Your notifications</strong>
          <p>Loading your activity…</p>`;

        api.getNotifications()
          .then(async result => {
            const notifications = Array.isArray(result.notifications)
              ? result.notifications
              : [];

            const unreadCount = Number(result.unreadCount) || 0;

            activityPanel.innerHTML =
              `<div class="activity-panel-heading">
                <strong>Your notifications</strong>
                <span>${unreadCount} unread</span>
              </div>` +
              (notifications.length
                ? notifications.map(item => {
                    const actor = item.actor || {};
                    const actorName = this.escapeHtml(
                      actor.name || 'A creator'
                    );
                    const message = this.escapeHtml(
                      item.message || 'interacted with you'
                    );
                    const time = this.escapeHtml(
                      this.calculateTimeAgo(item.createdAt)
                    );
                    const avatar = this.safeImageUrl(actor.avatar);

                    return `
                      <div class="activity-item ${item.read ? '' : 'unread'}">
                        <img src="${avatar}" alt="" loading="lazy">
                        <div>
                          <p><b>${actorName}</b> ${message}</p>
                          <small>${time}</small>
                        </div>
                      </div>`;
                  }).join('')
                : '<p>No notifications yet. When someone follows you, likes a post, or comments, you will see it here.</p>');

            if (notifications.some(item => !item.read)) {
              try {
                await api.markNotificationsRead();
              } catch (error) {
                console.error('Mark notifications read error:', error);
              }
            }
          })
          .catch(error => {
            console.error('Notifications error:', error);
            activityPanel.innerHTML = `
              <strong>Your notifications</strong>
              <p>Could not load notifications. Check that the backend is running.</p>`;
          });
      });
    }

    // Feed filter tabs
    document.querySelectorAll('.feed-tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.feed-tab-btn').forEach(item => {
          item.classList.remove('active');
        });

        tab.classList.add('active');
        this.currentFilter = tab.getAttribute('data-filter') || 'all';
        this.loadFeed(this.currentFilter);
      });
    });

    // Preset image chips
    document.querySelectorAll('.preset-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const url = chip.getAttribute('data-url');
        if (url) this.setAttachment(url);
      });
    });

    // Remove attachment
    const removeImgBtn = document.getElementById('btnRemoveAttachment');

    if (removeImgBtn) {
      removeImgBtn.addEventListener('click', () => this.clearAttachment());
    }

    // Publish post
    const publishBtn = document.getElementById('btnPublishPost');

    if (publishBtn) {
      publishBtn.addEventListener('click', () => this.handleCreatePost());
    }
  },

  setAttachment(url) {
    if (!url) return;

    this.selectedAttachmentUrl = url;

    const box = document.getElementById('composerImgPreviewBox');
    const img = document.getElementById('composerImgPreview');

    if (box && img) {
      img.src = url;
      box.style.display = 'block';
    }
  },

  clearAttachment() {
    this.selectedAttachmentUrl = null;

    const box = document.getElementById('composerImgPreviewBox');
    const img = document.getElementById('composerImgPreview');

    if (img) img.removeAttribute('src');
    if (box) box.style.display = 'none';
  },

  async handleCreatePost() {
    if (!window.auth || !auth.isLoggedIn()) {
      window.showToast('Please sign in to publish a post', 'error');
      setTimeout(() => {
        window.location.href = 'auth.html';
      }, 800);
      return;
    }

    const textarea = document.getElementById('composerTextarea');

    if (!textarea) {
      window.showToast('Post editor was not found', 'error');
      return;
    }

    const content = textarea.value.trim();

    if (!content) {
      window.showToast('Post caption cannot be blank', 'error');
      return;
    }

    const btn = document.getElementById('btnPublishPost');

    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Publishing...';
    }

    try {
      const res = await api.createPost({
        content,
        image: this.selectedAttachmentUrl
      });

      if (res.success) {
        textarea.value = '';
        this.clearAttachment();
        window.showToast('Post shared to your feed!', 'success');
        await this.loadFeed(this.currentFilter);
      } else {
        window.showToast(res.message || 'Failed to create post', 'error');
      }
    } catch (error) {
      console.error('Create post error:', error);
      window.showToast('Server error while posting', 'error');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Publish Post';
      }
    }
  },

  async loadFeed(filter = 'all') {
    const feedContainer = document.getElementById('postsStream');

    // Profile pages may not contain the main feed container.
    if (!feedContainer) return;

    feedContainer.innerHTML = `
      <div style="text-align:center; padding:3rem; color:var(--text-muted);">
        <div style="font-size:2.5rem; margin-bottom:0.5rem;">⏳</div>
        <p>Loading posts feed...</p>
      </div>`;

    try {
      const res = await api.getFeed(filter);
      const posts = Array.isArray(res.posts) ? res.posts : [];

      if (!res.success) {
        feedContainer.innerHTML = `
          <div style="text-align:center; padding:2rem;">
            Could not load posts. Please try again.
          </div>`;
        return;
      }

      if (posts.length === 0) {
        feedContainer.innerHTML = `
          <div style="text-align:center; padding:4rem 1rem; color:var(--text-muted);">
            <div style="font-size:3rem; margin-bottom:1rem;">✨</div>
            <h3 style="color:var(--text-main); margin-bottom:0.5rem;">
              No posts in this feed yet
            </h3>
            <p>Be the first one to share an update or follow other creators!</p>
          </div>`;
        return;
      }

      feedContainer.innerHTML = posts
        .map(post => this.renderPostCard(post))
        .join('');
    } catch (error) {
      console.error('Load feed error:', error);
      feedContainer.innerHTML = `
        <div style="text-align:center; padding:2rem; color:var(--accent-rose);">
          Failed to load feed. Ensure the server is active.
        </div>`;
    }
  },

  renderPostCard(post = {}) {
    const author = post.author || {};
    const currentUser =
      window.auth && typeof auth.getUser === 'function'
        ? auth.getUser()
        : null;

    const postId = String(post.id ?? '');
    const authorId = String(author.id ?? '');
    const isSelf = !!currentUser &&
      String(currentUser.id) === authorId;

    const authorName = this.escapeHtml(author.name || 'Nawab Creator');
    const authorHandle = this.escapeHtml(author.handle || 'creator');
    const authorAvatar = this.safeImageUrl(author.avatar);
    const content = this.escapeHtml(post.content || '');
    const timeAgo = this.escapeHtml(this.calculateTimeAgo(post.createdAt));
    const image = this.safeImageUrl(post.image);

    const comments = Array.isArray(post.comments) ? post.comments : [];
    const likesCount = Number(post.likesCount) || 0;
    const commentsCount = Number(post.commentsCount) || comments.length;

    // Highlight hashtags without inserting raw post content into HTML.
    const formattedContent = content.replace(
      /#([\w]+)/g,
      '<span class="hashtag-highlight" onclick="app.filterByTag(\'$1\')">#$1</span>'
    );

    // Follow button
    let followBtnHtml = '';

    if (!isSelf && authorId) {
      const followText = post.isFollowingAuthor ? 'Following' : '+ Follow';
      const followClass = post.isFollowingAuthor ? 'following' : '';

      followBtnHtml = `
        <button class="btn-follow-toggle ${followClass}"
          onclick="app.handleToggleFollow('${this.escapeHtml(authorId)}', this)">
          ${followText}
        </button>`;
    }

    const commentsHtml = comments.map(comment => {
      const c = comment || {};
      const commentAvatar = this.safeImageUrl(c.authorAvatar);
      const commentName = this.escapeHtml(c.authorName || 'Creator');
      const commentContent = this.escapeHtml(c.content || '');
      const commentTime = this.escapeHtml(
        this.calculateTimeAgo(c.createdAt)
      );

      return `
        <div class="comment-item">
          <img src="${commentAvatar}" alt="${commentName}" class="comment-avatar">
          <div class="comment-body">
            <div>
              <span class="comment-author-name">${commentName}</span>
              <span class="comment-time">${commentTime}</span>
            </div>
            <div class="comment-text">${commentContent}</div>
          </div>
        </div>`;
    }).join('');

    return `
      <article class="post-card" id="post-${this.escapeHtml(postId)}">
        <div class="post-header">
          <div class="post-author-info">
            <img src="${authorAvatar}"
              alt="${authorName}"
              class="post-author-avatar"
              onclick="window.location.href='profile.html?id=${encodeURIComponent(authorId)}'">

            <div class="post-author-meta">
              <div class="post-author-name"
                onclick="window.location.href='profile.html?id=${encodeURIComponent(authorId)}'">
                ${authorName}
                <span class="verified-icon">✓</span>
              </div>

              <div class="post-author-handle">
                @${authorHandle} • <span class="post-time">${timeAgo}</span>
              </div>
            </div>
          </div>

          ${followBtnHtml}
        </div>

        <div class="post-text">${formattedContent}</div>

        ${image ? `
          <div class="post-media-wrap">
            <img src="${image}" alt="Post attachment"
              class="post-media-img" loading="lazy">
          </div>` : ''}

        <div class="post-actions-bar">
          <button class="action-btn like-btn ${post.isLiked ? 'liked' : ''}"
            onclick="app.handleToggleLike('${this.escapeHtml(postId)}', this)"
            aria-label="Like post">
            <svg width="19" height="19"
              fill="${post.isLiked ? 'currentColor' : 'none'}"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z">
              </path>
            </svg>
            <span class="like-count-span">${likesCount}</span>
          </button>

          <button class="action-btn comment-btn"
            onclick="app.toggleCommentsSection('${this.escapeHtml(postId)}')"
            aria-label="Show comments">
            <svg width="19" height="19" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
              </path>
            </svg>
            <span class="comment-count-span">${commentsCount}</span>
          </button>

          <button class="action-btn share-btn"
            onclick="app.handleSharePost('${this.escapeHtml(postId)}')">
            <svg width="18" height="18" fill="none"
              stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z">
              </path>
            </svg>
            <span>Share</span>
          </button>
        </div>

        <div class="post-comments-section" id="comments-${this.escapeHtml(postId)}">
          <div class="comment-input-row">
            <input type="text"
              id="comment-input-${this.escapeHtml(postId)}"
              class="comment-input-field"
              placeholder="Write a thoughtful reply..."
              onkeydown="if(event.key==='Enter') app.handleSubmitComment('${this.escapeHtml(postId)}')">

            <button class="btn-send-comment"
              onclick="app.handleSubmitComment('${this.escapeHtml(postId)}')"
              title="Send Comment">
              <svg width="15" height="15" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round"
                  stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">
                </path>
              </svg>
            </button>
          </div>

          <div class="comments-list"
            id="comments-list-${this.escapeHtml(postId)}">
            ${commentsHtml}
          </div>
        </div>
      </article>`;
  },

  async handleToggleLike(postId, btnEl) {
    if (!window.auth || !auth.isLoggedIn()) {
      window.showToast('Please sign in to like posts', 'error');
      return;
    }

    try {
      const res = await api.toggleLike(postId);

      if (res.success && btnEl) {
        const countSpan = btnEl.querySelector('.like-count-span');
        const svg = btnEl.querySelector('svg');

        if (res.isLiked) {
          btnEl.classList.add('liked');
          if (svg) svg.setAttribute('fill', 'currentColor');
          window.showToast('Liked!', 'info');
        } else {
          btnEl.classList.remove('liked');
          if (svg) svg.setAttribute('fill', 'none');
        }

        if (countSpan) {
          countSpan.textContent = Number(res.likesCount) || 0;
        }
      }
    } catch (error) {
      console.error('Toggle like error:', error);
      window.showToast('Failed to update like', 'error');
    }
  },

  toggleCommentsSection(postId) {
    const section = document.getElementById(`comments-${postId}`);

    if (!section) return;

    section.classList.toggle('open');

    if (section.classList.contains('open')) {
      const input = document.getElementById(`comment-input-${postId}`);
      if (input) input.focus();
    }
  },

  async handleSubmitComment(postId) {
    if (!window.auth || !auth.isLoggedIn()) {
      window.showToast('Please sign in to comment', 'error');
      return;
    }

    const input = document.getElementById(`comment-input-${postId}`);
    if (!input) return;

    const content = input.value.trim();
    if (!content) return;

    try {
      const res = await api.addComment(postId, content);

      if (res.success && res.comment) {
        input.value = '';

        const comment = res.comment;
        const list = document.getElementById(`comments-list-${postId}`);

        if (list) {
          const avatar = this.safeImageUrl(comment.authorAvatar);
          const name = this.escapeHtml(comment.authorName || 'Creator');
          const text = this.escapeHtml(comment.content || content);

          const html = `
            <div class="comment-item">
              <img src="${avatar}" alt="${name}" class="comment-avatar">
              <div class="comment-body">
                <div>
                  <span class="comment-author-name">${name}</span>
                  <span class="comment-time">Just now</span>
                </div>
                <div class="comment-text">${text}</div>
              </div>
            </div>`;

          list.insertAdjacentHTML('beforeend', html);
        }

        const card = document.getElementById(`post-${postId}`);
        const countSpan = card
          ? card.querySelector('.comment-count-span')
          : null;

        if (countSpan) {
          countSpan.textContent =
            (Number.parseInt(countSpan.textContent, 10) || 0) + 1;
        }

        window.showToast('Comment posted!', 'success');
      }
    } catch (error) {
      console.error('Submit comment error:', error);
      window.showToast('Failed to submit comment', 'error');
    }
  },

  async handleToggleFollow(userId, btnEl) {
    if (!window.auth || !auth.isLoggedIn()) {
      window.showToast('Please sign in to follow users', 'error');
      return;
    }

    try {
      const res = await api.toggleFollow(userId);

      if (res.success && btnEl) {
        if (res.isFollowing) {
          btnEl.textContent = 'Following';
          btnEl.classList.add('following');
          window.showToast('You followed this creator!', 'success');
        } else {
          btnEl.textContent = '+ Follow';
          btnEl.classList.remove('following');
          window.showToast('Unfollowed', 'info');
        }

        this.loadSidebar();
      }
    } catch (error) {
      console.error('Toggle follow error:', error);
      window.showToast('Failed to toggle follow', 'error');
    }
  },

  async handleSharePost(postId) {
    const shareUrl =
      `${window.location.origin}/#post-${encodeURIComponent(postId)}`;

    try {
      if (!navigator.clipboard || !navigator.clipboard.writeText) {
        throw new Error('Clipboard unavailable');
      }

      await navigator.clipboard.writeText(shareUrl);
      window.showToast('Post link copied to clipboard!', 'success');
    } catch (_) {
      window.showToast('Post link: ' + shareUrl, 'info');
    }
  },

  filterByTag(tag) {
    const safeTag = String(tag ?? '').replace(/[^\w]/g, '');
    if (!safeTag) return;

    window.showToast(`Filtering by tag #${safeTag}`, 'info');

    const textarea = document.getElementById('composerTextarea');

    if (textarea) {
      textarea.value += `${textarea.value ? ' ' : ''}#${safeTag}`;
      textarea.focus();
    }
  },

  async loadSidebar() {
    const whoToFollowBox = document.getElementById('whoToFollowList');
    const trendingTagsBox = document.getElementById('trendingTagsList');

    // Avoid unnecessary API calls on pages without sidebar sections.
    if (!whoToFollowBox && !trendingTagsBox) return;

    try {
      const res = await api.getSidebar();

      if (!res.success) return;

      // Who to Follow
      if (whoToFollowBox && Array.isArray(res.whoToFollow)) {
        if (res.whoToFollow.length === 0) {
          whoToFollowBox.innerHTML = `
            <p style="color:var(--text-muted); font-size:0.85rem;">
              You are following all creators!
            </p>`;
        } else {
          whoToFollowBox.innerHTML = res.whoToFollow.map(user => {
            const id = String(user.id ?? '');
            const avatar = this.safeImageUrl(user.avatar);
            const name = this.escapeHtml(user.name || 'Creator');
            const handle = this.escapeHtml(user.handle || 'creator');

            return `
              <div class="follow-suggestion-row">
                <div class="suggestion-user-wrap"
                  onclick="window.location.href='profile.html?id=${encodeURIComponent(id)}'"
                  style="cursor:pointer;">
                  <img src="${avatar}" alt="${name}" class="suggestion-avatar">
                  <div>
                    <div class="suggestion-name">${name}</div>
                    <div class="suggestion-handle">@${handle}</div>
                  </div>
                </div>

                <button class="btn-follow-toggle"
                  onclick="app.handleToggleFollow('${this.escapeHtml(id)}', this)">
                  + Follow
                </button>
              </div>`;
          }).join('');
        }
      }

      // Trending Tags
      if (trendingTagsBox && Array.isArray(res.trendingTags)) {
        trendingTagsBox.innerHTML = res.trendingTags.map(item => {
          const tag = String(item.tag ?? '').replace(/[^\w]/g, '');
          const count = Number(item.count) || 0;

          return `
            <div class="trending-item"
              onclick="app.filterByTag('${this.escapeHtml(tag)}')"
              style="cursor:pointer;">
              <div>
                <div class="trending-tag">#${this.escapeHtml(tag)}</div>
                <div class="trending-count">${count} posts this week</div>
              </div>
              <span style="color:var(--accent-primary); font-size:1.1rem;">↗</span>
            </div>`;
        }).join('');
      }
    } catch (error) {
      console.error('Sidebar error:', error);
    }
  },

  calculateTimeAgo(dateString) {
    if (!dateString) return 'Recently';

    const timestamp = new Date(dateString).getTime();

    if (!Number.isFinite(timestamp)) return 'Recently';

    const diff = Math.max(0, (Date.now() - timestamp) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

    return `${Math.floor(diff / 86400)}d ago`;
  }
};

// IMPORTANT: Expose the app globally.
// profile.html and inline post buttons depend on window.app.
window.app = app;

// Start the app after the page has loaded.
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
