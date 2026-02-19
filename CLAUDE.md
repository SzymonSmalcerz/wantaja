# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm start            # Start server (node server.js)
npm run start-watch  # Dev mode with nodemon auto-restart
```

- Server runs at `http://localhost:3000` (or `PORT` env var)
- MongoDB connection defaults to `mongodb://localhost:27017/wantajaLocal` (override with `MONGODB_URI`)
- SCSS is compiled via [Prepros](https://prepros.io/) — there is no npm build step for CSS
- No linting or test suite configured

## Architecture

This is a real-time multiplayer 2D RPG using a Node.js/Express + Socket.io backend and a Phaser 2 frontend.

### Backend

**Entry point:** `server.js` — Express app, EJS routing, Socket.io initialization.

**`sockets/sockets.js`** composes modular socket listeners from `sockets/listeners/`:
- `initializers.js` — player init, game data loading
- `playerStateListeners.js` — player sync
- `equipmentListeners.js` — equipment management
- `fightListeners.js` — combat mechanics
- `tradeListeners.js` — NPC trading
- `missionsListeners.js` — quest progression

**`sockets/dataManager.js`** acts as a central in-memory cache holding: logged-in players, map data, skills, missions, and equipment definitions. All listener modules share this object rather than passing state through function arguments.

Game data (maps, enemies, items, missions) is defined as JS modules under `sockets/` subdirectories and loaded into the data manager at startup.

**Authentication:** `client-sessions` middleware for session management, `bcryptjs` for password hashing, `jsonwebtoken` for token exchange. User model lives in `database/models/`.

### Frontend (Phaser 2)

**Entry point:** `public/scripts/main.js` → initializes socket connection, then `public/scripts/game/game.js` (the `GameHandler` class).

**Game states** (loaded in order): `PreState` → `LoadState` → `HomeState` → `GameState`

`GameState` orchestrates feature **Managers**:
- `FightWithOpponentManager` — PvP combat
- `MapManager` — map transitions
- `MissionManager` — quest tracking
- `UIManager` — HUD and menus
- `PlayerMoveManager` — movement and collision
- `DeathManager` — revival mechanics

All game entities extend a base `Entity` class (wraps Phaser Sprite): `Player`, `OtherPlayer`, Enemy, NPC, Trader, Teleporter, Fence.

**`SocketsManager`** handles all client-side socket.io emit/on calls. Game state syncs at ~10 FPS.

### Key Patterns

- **Rendering order:** Explicit `bringToTop()` calls; entities are Y-sorted by bottom position each frame for depth illusion.
- **Mission stages:** Typed objects — `Stage_goto` (NPC interaction), `Stage_getitem` (item collection), `Stage_kill` (enemy elimination).
- **Equipment types:** weapon, helmet, armor, shield, boots, gloves, special — each as a separate definition module.
- **Skills:** Punch, Poison, Ignite, Entangle, Health — defined in `sockets/skills/`.
- **Maps:** Greengrove, Northpool, Southpool, Frozendefile, Blackford — each has its own server-side module.
