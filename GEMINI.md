# Project Overview

This project is a cross-platform multiplayer 2D game built with a Node.js backend and a Phaser-based frontend.

## Technologies Used:

### Backend
*   **Node.js & Express:** The core server-side framework.
*   **Socket.io:** Enables real-time, bidirectional communication between the web clients and the server, crucial for multiplayer game mechanics.
*   **MongoDB & Mongoose:** Used for data persistence, managing game data, user information, and other dynamic content.
*   **EJS:** An Embedded JavaScript templating engine used for rendering dynamic HTML on the server.
*   **Authentication:** Implemented using `bcryptjs` for password hashing, `jsonwebtoken` for secure information exchange, and `client-sessions` for session management.

### Frontend
*   **Phaser (inferred):** A fast, free, and fun open-source HTML5 game framework. The presence of `phaser-kinetic-scrolling-plugin` in `package.json` strongly suggests its use.
*   **HTML5, CSS, JavaScript:** Standard web technologies for the client-side interface and game logic.

## Architecture Highlights:

*   **Client-Server Model:** The game operates on a client-server architecture, where the Node.js server handles game state, user authentication, and real-time updates, while the client-side renders the game and sends user input.
*   **Modular Socket Handling:** Socket.io listeners are organized into separate modules (e.g., `equipmentListeners`, `fightListeners`) for better maintainability and separation of concerns.
*   **Static Asset Serving:** Static files like images, CSS, and client-side JavaScript are served from the `public/` directory.

# Building and Running

## Prerequisites:
*   Node.js (version 8.11.2, as specified in `package.json` engines, though newer versions might work).
*   MongoDB instance accessible to the application.

## Installation:

1.  **Clone the repository:**
    ```bash
    git clone <repository_url>
    cd wantaja
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Running the Application:

*   **Start the server:**
    ```bash
    npm start
    ```
    This will run the `server.js` file using Node.js.

*   **Start the server with live reloading (for development):**
    ```bash
    npm run start-watch
    ```
    This command uses `nodemon` to automatically restart the server when file changes are detected.

The application will typically be available at `http://localhost:3000` or the port specified by the `PORT` environment variable.

# Development Conventions

*   **Directory Structure:** The project follows a clear directory structure, separating concerns into `authentication`, `database`, `helpers`, `public`, `sockets`, and `views`.
*   **Server-Side Logic:** `server.js` acts as the main entry point for the Express application, handling routing, middleware, and Socket.io initialization.
*   **Client-Side Entry:** `public/scripts/main.js` is the primary entry point for client-side JavaScript, responsible for establishing socket connections and initiating the game.
*   **Socket.io Event Handling:** Server-side Socket.io events are modularized within the `sockets/listeners` directory, promoting organized and manageable real-time logic.
*   **Templating:** EJS templates located in the `views/` directory are used to construct the dynamic web pages.
