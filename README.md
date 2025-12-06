# Stash - Note-Taking Application

A full-stack note-taking application built with React, Express, and SQLite. Features include user authentication, note management, tagging, spaces organization, and AI-powered tag suggestions.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

To verify your installations:

```bash
node --version  # Should be v18 or higher
npm --version   # Should be 8.x or higher
```

## Project Structure

```
cs35l_project/
├── server/                 # Backend Express server
│   ├── database.js        # SQLite database setup
│   ├── index.js           # Server entry point
│   ├── middleware/        # Authentication middleware
│   ├── routes/            # API routes (auth, notes, spaces, tags)
│   ├── utils/             # JWT utilities
│   ├── uploads/           # Uploaded note files
│   └── notes.db           # SQLite database (auto-created)
├── src/                   # Frontend React application
│   ├── components/        # Reusable React components
│   ├── pages/             # Page components
│   ├── context/           # React Context (AuthContext)
│   └── assets/            # Static assets
├── tests/                 # Playwright E2E tests
├── package.json           # Frontend dependencies
└── server/package.json    # Backend dependencies
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/aarnav-11/35L_final_project
cd cs35l_project
```

### 2. Install Frontend Dependencies

```bash
npm install
```

This will install all React, Vite, and frontend dependencies.

### 3. Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

This will install all Express, SQLite, and backend dependencies.

### 4. Set Up Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
touch .env
```

Add the following environment variables to `server/.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Supabase Configuration (for file uploads)
SUPABASE_URL=your-supabase-project-url
SUPABASE_SERVICE_KEY=your-supabase-service-role-key

# Google Gemini API (for AI tag suggestions)
GEMINI_API_KEY=your-gemini-api-key

# Use the Gemini stub (no external API call) only for tests/load:
USE_TAG_STUB=false   # set to true to return ["this","is","a","test","double"]
```
To generate the Gemini API (this is free), go to https://aistudio.google.com/app/ and click Get API key on the botton left.

### 5. Initialize the Database

The SQLite database (`server/notes.db`) will be automatically created and initialized when you first start the server. 

## Running the Application

The application consists of two parts that need to run simultaneously:

**Terminal 1 - Backend Server:**
```bash
cd server
npm run devStart
```

The server will start on `http://localhost:3000`

**Terminal 2 - Frontend Development Server:**
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`


### Accessing the Application

Once both servers are running:
1. Open your browser and navigate to `http://localhost:5173`
2. You should see the login/signup page
3. Create an account or log in to start using the application

## Available Scripts

### Frontend Scripts (run from project root)

```bash
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test:e2e     # Run Playwright E2E tests
npm run test:load     # Run Artillery API load tests
npm run test:load:browser  # Run Artillery + Playwright browser load tests
```

### Backend Scripts (run from server/ directory)

```bash
npm run devStart     # Start server with nodemon (auto-reload)
```

## Testing

### End-to-End Testing (Playwright)

```bash
npm run test:e2e
```

This runs Playwright tests located in the `tests/` directory. Test reports are generated in `playwright-report/`.

### Load Testing

**API-level load testing:**
```bash
npm run test:load
```

**Browser-based load testing (Artillery + Playwright):**
```bash
npm run test:load:browser
```

**Note:** Make sure both frontend and backend servers are running before executing load tests.

## Troubleshooting

### Port Already in Use

If you see an error like `Port 3000 is already in use`:

**Backend:**
- Change `PORT` in `server/.env` to a different port (e.g., `3001`)
- Update CORS origins in `server/index.js` if needed

**Frontend:**
- Vite will automatically use the next available port (e.g., `5174`)
- Update CORS origins in `server/index.js` to include the new port

### Database Connection Issues

If you see database errors:
- Ensure SQLite3 is properly installed: `npm install sqlite3`
- Check that `server/notes.db` file has write permissions
- Delete `server/notes.db` to reset the database (all data will be lost)

### Authentication Issues

If login/signup fails:
- Verify `JWT_SECRET_KEY` is set in `server/.env`
- Check browser console for CORS errors
- Ensure cookies are enabled in your browser
- Verify backend server is running on the correct port

### CORS Errors

If you see CORS errors in the browser console:
- Verify the frontend URL matches the CORS origin in `server/index.js`
- Default allowed origins: `http://localhost:5173` and `http://localhost:5174`
- Add your frontend URL to the `origin` array in `server/index.js` if using a different port

### Missing Environment Variables

If the server crashes with "undefined" errors:
- Verify all required environment variables are set in `server/.env`
- Restart the server after adding/changing environment variables
- Check that `.env` file is in the `server/` directory (not the root)

### Module Not Found Errors

If you see "Cannot find module" errors:
- Run `npm install` in both root and `server/` directories
- Delete `node_modules` folders and `package-lock.json` files, then reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  cd server
  rm -rf node_modules package-lock.json
  cd ..
  npm install
  cd server && npm install
  ```

### Playwright Tests Not Running

If Playwright tests fail:
- Install Playwright browsers: `npx playwright install`
- Ensure both frontend and backend servers are running
- Check that test credentials in test files match your database

## Features

- **User Authentication**: Secure JWT-based authentication with refresh tokens
- **Note Management**: Create, read, update, and delete notes
- **Tagging System**: Organize notes with tags and AI-powered tag suggestions
- **Spaces**: Organize notes into different spaces/workspaces
- **File Uploads**: Upload and attach files to notes (via Supabase)
- **Search**: Search through your notes
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

**Frontend:**
- React 19
- Vite
- React Router v7
- Axios

**Backend:**
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcrypt
- Multer (file uploads)
- Supabase (cloud storage)

**Testing:**
- Playwright (E2E testing)
- Artillery (load testing)

## License

[Your License Here]

## Support

For issues or questions, please [open an issue](link-to-issues) or contact the development team.
