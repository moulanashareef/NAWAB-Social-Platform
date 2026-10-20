# Nawab Social Platform 2.0

A dark-themed, full-stack social networking project adapted from an existing social media starter codebase. Nawab focuses on sharing developer updates, discovering creators, and interacting with a community.

> **Project provenance:** This project builds on an existing Social Media Platform codebase. Changes in this version include Nawab branding cleanup, explicit sign-in instead of automatic demo login, creator search UI/API, persistent personal notifications for likes/comments/follows, notification read state, additional request validation, basic security headers, and updated documentation. Review the inherited code, understand each component, and accurately describe your own contributions in an internship submission.

## Features

- Register and sign in using bcrypt password hashing and JWT sessions.
- Create text posts and attach an image by URL.
- Like posts and add comments.
- Public profiles with follower/following counts and follow/unfollow actions.
- Feed filters: all posts, following, and trending.
- Search creators by name, username, or bio.
- Persistent personal notifications for likes, comments, and new followers, including unread counts and mark-as-read.
- Suggested creators and trending tags.
- Responsive dark UI and client-side input escaping for post/comment text.
- Express REST API with JSON-file persistence for local demos.

## Tech stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js and Express
- Authentication: bcryptjs and JSON Web Tokens
- Data: `backend/database/data.json`

## Requirements

- Node.js 18 or newer (Node.js LTS recommended)
- npm

## Run locally (Windows / macOS / Linux)

Open a terminal in the extracted project directory, then run:

```bash
cd backend
npm install
npm start
```

Keep the terminal open and visit <http://localhost:5001>.

Health check: <http://localhost:5001/api/health>

If the terminal reports `Cannot find module 'express'`, ensure you are in the `backend` directory, wait for `npm install` to finish successfully, then run `npm ls express` before `npm start`.

## Seeded demo accounts

The starter dataset includes **10 unique demo profiles and 50 distinct posts** (five posts per profile). Each demo account uses a unique name, handle, email, bio, and avatar.

- Primary demo email: `demo@nawab.social`
- Password for seeded demo accounts: `password123`
- Other demo emails: `aarav@example.com`, `sneha@example.com`, `rohan@example.com`, `meera@example.com`, `kabir@example.com`, `ananya@example.com`, `ishaan@example.com`, `zoya@example.com`, and `dev@example.com`

These demo accounts are included for local testing. The application no longer silently signs visitors into this account; use the sign-in page or the demo credential helper. Change/remove demo credentials before any public deployment.

## API overview

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health and project metadata |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Sign in and receive a token |
| GET | `/api/auth/profile` | Current user's profile |
| GET | `/api/posts?filter=all` | Get posts (`all`, `following`, `trending`) |
| POST | `/api/posts` | Create a post (authenticated) |
| POST | `/api/posts/:id/like` | Toggle a like (authenticated) |
| POST | `/api/posts/:id/comments` | Add a comment (authenticated) |
| GET | `/api/users/search?q=term` | Search creators |
| GET | `/api/users/:id` | Get a public profile |
| POST | `/api/users/:id/follow` | Toggle follow state (authenticated) |
| GET | `/api/notifications` | Get the signed-in user's notifications |
| PATCH | `/api/notifications/read` | Mark notifications as read |
| GET | `/api/sidebar` | Suggested creators and trending tags |

Authenticated endpoints expect `Authorization: Bearer <token>`.

## Configuration and limitations

- Copy `backend/.env.example` to `backend/.env` and set a long random `JWT_SECRET` before deployment. The built-in development fallback is not suitable for production.
- The current JSON-file database is for a local demonstration, not concurrent production traffic. Use PostgreSQL or another managed database before deploying a multi-user production service.
- The notification system persists to the JSON file; it is not real-time push/WebSocket delivery.
- Image attachments currently accept HTTP/HTTPS image URLs rather than uploading image files.
- Keep `.env` and secrets out of version control.

## Before internship submission

1. Run the app and manually test registration, login, post creation, likes, comments, search, following, and notifications.
2. Check browser DevTools for errors and test at mobile widths.
3. Replace demo posts with your own original content and take genuine screenshots.
4. Add a changelog that identifies the changes you personally implemented and tested.
5. Preserve any source license and attribution obligations from the original codebase.

## License

The starter archive identifies the source project as MIT licensed. Review the included source/license terms and retain required attribution when redistributing inherited portions.

## Nawab 2.2 UI refresh

This version adds an editorial dark visual refresh with warm terracotta accents, refined cards, updated navigation states, sticky search on desktop, and responsive layout adjustments for smaller screens. The existing backend and seeded demo data are retained.

### Demo data
- 10 demo users
- 50 distinct demo posts
- 12 hashtags

### Run locally
```powershell
cd backend
npm install
npm run check
npm start
```
Then open the frontend using the project's existing local-serving instructions. API server default: `http://localhost:5001`.

### Verification status
JavaScript syntax checks pass and the bundled JSON database parses with 10 users and 50 posts. The UI changes have not yet been validated through a full browser-based end-to-end run. This project is an adaptation of an existing codebase; document your own contributions accurately.


## Refreshed demo content
- 10 demo profiles and 50 demo posts (5 posts per profile).
- Demo profile IDs are retained so likes, follows, and comments remain compatible.
- The starter demo login remains `demo@nawab.social` / `password123` if the project uses the included seeded password.
- To update an existing checkout, back up `backend/database/data.json`, then replace it with the refreshed file from this archive. Restart the backend afterward.
