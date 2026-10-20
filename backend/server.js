const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const db = require('./database/db');
const { requireAuth, optionalAuth, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.disable('x-powered-by');
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'DENY');
  next();
});
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Nawab Social Platform',
    developer: 'Nawab',
    port: PORT,
    timestamp: new Date().toISOString()
  });
});

// Authentication: Register
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, handle, email, password, bio } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }
    if (String(name).trim().length < 2 || String(name).trim().length > 60) {
      return res.status(400).json({ success: false, message: 'Name must be between 2 and 60 characters.' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
      return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
    }

    if (password.length < 8) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
    }

    const existingUser = db.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }
    const requestedHandle = String(handle || name).trim().replace(/^@/, '').toLowerCase();
    if (requestedHandle.length > 24 || !/^[a-z0-9_]+$/.test(requestedHandle)) {
      return res.status(400).json({ success: false, message: 'Username must use only letters, numbers, and underscores (max 24 characters).' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = db.createUser({ name: String(name).trim(), handle: requestedHandle, email, passwordHash, bio });

    const token = jwt.sign(
      { id: newUser.id, name: newUser.name, handle: newUser.handle, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Welcome to Nawab!',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        handle: newUser.handle,
        avatar: newUser.avatar,
        email: newUser.email,
        bio: newUser.bio
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Authentication: Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, handle: user.handle, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user.id,
        name: user.name,
        handle: user.handle,
        avatar: user.avatar,
        email: user.email,
        bio: user.bio
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Current User Profile
app.get('/api/auth/profile', requireAuth, (req, res) => {
  try {
    const profile = db.getUserById(req.user.id, req.user.id);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get Feed Posts
app.get('/api/posts', optionalAuth, (req, res) => {
  try {
    const filter = req.query.filter || 'all';
    const currentUserId = req.user ? req.user.id : null;
    const posts = db.getPosts(filter, currentUserId);
    res.json({ success: true, count: posts.length, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Create Post
app.post('/api/posts', requireAuth, (req, res) => {
  try {
    const { content, image, tags } = req.body;
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Post content cannot be empty.' });
    }
    if (String(content).length > 2000) return res.status(400).json({ success: false, message: 'Posts must be 2,000 characters or fewer.' });
    if (image && (typeof image !== 'string' || image.length > 2000 || !/^https?:\/\//i.test(image.trim()))) {
      return res.status(400).json({ success: false, message: 'Image must be a valid HTTP or HTTPS URL.' });
    }

    // Extract hashtags if not provided
    let postTags = tags || [];
    if (!postTags.length) {
      const matched = content.match(/#(\w+)/g);
      if (matched) {
        postTags = matched.map(t => t.replace('#', ''));
      }
    }

    const newPost = db.createPost({
      authorId: req.user.id,
      content: content.trim(),
      image: image ? image.trim() : null,
      tags: postTags
    });

    res.status(201).json({
      success: true,
      message: 'Post published!',
      post: newPost
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle Like
app.post('/api/posts/:id/like', requireAuth, (req, res) => {
  try {
    const post = db.getPostById(req.params.id, req.user.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    const result = db.toggleLike(req.params.id, req.user.id);
    if (!result) return res.status(404).json({ success: false, message: 'Post not found' });
    if (result.isLiked) db.addNotification({ recipientId: post.authorId, actorId: req.user.id, type: 'like', postId: req.params.id, message: 'liked your post' });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add Comment
app.post('/api/posts/:id/comments', requireAuth, (req, res) => {
  try {
    const { content } = req.body;
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ success: false, message: 'Comment content cannot be empty.' });
    }
    if (String(content).length > 500) return res.status(400).json({ success: false, message: 'Comments must be 500 characters or fewer.' });

    const comment = db.addComment(req.params.id, {
      authorId: req.user.id,
      content: content.trim()
    });

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const post = db.getPostById(req.params.id, req.user.id);
    if (post) db.addNotification({ recipientId: post.authorId, actorId: req.user.id, type: 'comment', postId: req.params.id, message: 'commented on your post' });

    res.status(201).json({
      success: true,
      message: 'Comment added!',
      comment
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Search creators by name, handle, or bio
app.get('/api/users/search', optionalAuth, (req, res) => {
  try {
    const users = db.searchUsers(req.query.q, req.user ? req.user.id : null);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get User Profile by ID
app.get('/api/users/:id', optionalAuth, (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const profile = db.getUserById(req.params.id, currentUserId);
    if (!profile) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Toggle Follow
app.post('/api/users/:id/follow', requireAuth, (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({ success: false, message: 'You cannot follow yourself.' });
    }

    const result = db.toggleFollow(req.params.id, req.user.id);
    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (result.isFollowing) db.addNotification({ recipientId: req.params.id, actorId: req.user.id, type: 'follow', message: 'started following you' });
    res.json({
      success: true,
      message: result.isFollowing ? 'Followed user!' : 'Unfollowed user.',
      ...result
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Persistent personal notifications
app.get('/api/notifications', requireAuth, (req, res) => {
  const notifications = db.getNotifications(req.user.id);
  res.json({ success: true, unreadCount: notifications.filter(n => !n.read).length, notifications });
});

app.patch('/api/notifications/read', requireAuth, (req, res) => {
  const updated = db.markNotificationsRead(req.user.id);
  res.json({ success: true, updated });
});

// Sidebar Data: Trending Tags & Suggestions
app.get('/api/sidebar', optionalAuth, (req, res) => {
  try {
    const currentUserId = req.user ? req.user.id : null;
    const whoToFollow = db.getWhoToFollow(currentUserId);
    const trendingTags = db.getTrendingTags();
    res.json({ success: true, whoToFollow, trendingTags });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Fallback route
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
  } else {
    res.status(404).json({ success: false, message: 'Endpoint not found' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Nawab Social Platform running!`);
  console.log(`🌐 Web App: http://localhost:${PORT}`);
  console.log(`📡 REST API: http://localhost:${PORT}/api/`);
  console.log(`====================================================`);
});
