# Add Notes Functionality with Backend

## Overview

Implement a full-stack notes application with create, edit, delete, and search capabilities. Notes will be displayed in a masonry/Pinterest-style layout and stored in a backend database.

## Frontend Changes

### 1. Create Note Components

- **AddNoteButton.jsx**: Plus button component positioned top-right near search bar
- **Note.jsx**: Individual note card with title, content, edit, and delete functionality
- **NotesGrid.jsx**: Masonry layout container for displaying notes

### 2. Update App.jsx

- Add state management for notes array
- Integrate API calls to fetch, create, update, and delete notes
- Pass notes data to NotesGrid component
- Position AddNoteButton near search bar

### 3. Update Searchbar.jsx

- Modify search functionality to filter notes by title/content
- Pass filtered results back to App.jsx
- Keep existing search placeholder or update to "Search your notes"

### 4. Styling

- Create CSS files for new components (AddNoteButton.css, Note.css, NotesGrid.css)
- Implement masonry/Pinterest layout using CSS Grid or Flexbox
- Style notes with variable width/height, shadows, and hover effects
- Add responsive design for mobile/tablet

## Backend Setup

### 5. Create Backend Server

- Initialize new Express.js server in `/backend` directory
- Set up package.json with dependencies: express, cors, body-parser
- Create server.js with REST API endpoints:
- GET /api/notes - fetch all notes
- POST /api/notes - create new note
- PUT /api/notes/:id - update existing note
- DELETE /api/notes/:id - delete note

### 6. Database

- Use simple JSON file storage (notes.json) for MVP
- Structure: `{ id, title, content, createdAt, updatedAt }`
- Add file system operations to read/write notes

### 7. API Integration

- Create API utility file (src/utils/api.js) for frontend
- Implement fetch calls to backend endpoints
- Handle loading states and error handling

## Dependencies to Install

- Frontend: No new dependencies needed (using native fetch)
- Backend: express, cors, body-parser, nodemon (dev)

## Key Files to Create/Modify

- Create: `src/components/AddNoteButton.jsx`, `src/components/Note.jsx`, `src/components/NotesGrid.jsx`
- Create: `backend/server.js`, `backend/notes.json`, `backend/package.json`
- Create: `src/utils/api.js`
- Modify: `src/App.jsx`, `src/components/Searchbar.jsx`
- Create: CSS files for styling