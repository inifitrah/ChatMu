# ChatMu

ChatMu is a real-time chat application built with a modern architecture using npm workspaces.

![Screenshot](/apps/web/public/screenshot/auth.png)

## 🏗️ Monorepo Structure

```
ChatMu/
├── apps/
│   ├── web/          # Next.js frontend application
│   └── server/       # Express + Socket.IO backend server
├── packages/
│   ├── shared/       # Shared types, schemas, and utilities
│   ├── database/     # Database models and data access layer
│   └── ui/           # Shared UI components (Shadcn/UI)
└── package.json      # Root workspace configuration
```

## 🚀 Tech Stack

### Frontend (`apps/web`)

- **Framework**: Next.js 14 (App Router)
- **State Management**: Redux Toolkit
- **UI Components**: Shadcn/UI + Tailwind CSS
- **Authentication**: NextAuth.js
- **Real-time**: Socket.IO Client

### Backend (`apps/server`)

- **Server**: Express.js
- **Real-time**: Socket.IO
- **Language**: TypeScript

### Shared Packages

- **`@chatmu/shared`**: Types, schemas (Zod), utilities
- **`@chatmu/database`**: MongoDB models (Mongoose), data access
- **`@chatmu/ui`**: Reusable UI components

## 📋 Features

- [x] Real-time messaging
- [x] User authentication
- [x] Private chat
- [x] Message history
- [x] Online/offline status
- [x] Message read receipts

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- npm (comes with Node.js)
- MongoDB (or use Docker Compose)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/inifitrah/ChatMu.git
   cd ChatMu
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start MongoDB (using Docker)**
   ```bash
   docker compose up mongo mongo-express -d
   ```

### Running Development Servers

**Option 1: Run all apps simultaneously**

```bash
npm run dev
```

**Option 2: Run apps individually**

```bash
# Terminal 1 - Start backend server
npm run dev:server

# Terminal 2 - Start frontend web app
npm run dev:web
```

The applications will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:3003
- MongoDB Express: http://localhost:8081

## 🏗️ Building for Production

### Build all packages and apps

```bash
npm run build
```

### Build specific workspace

```bash
npm run build:web     # Build web app only
npm run build:server  # Build server only
```

## 🐳 Docker Deployment

Build and run all services with Docker Compose:

```bash
docker compose up --build
```

This will start:

- MongoDB database
- MongoDB Express (admin UI)
- Socket.IO server
- Next.js web application

## 📦 Workspace Commands

### Install dependencies for a specific workspace

```bash
npm install <package> --workspace=apps/web
npm install <package> --workspace=packages/shared
```

### Run scripts in specific workspace

```bash
npm run <script> --workspace=apps/web
```

### Clean all build artifacts

```bash
npm run clean
```

## 🗂️ Package Overview

### `@chatmu/shared`

Contains shared code used across the monorepo:

- **Types**: TypeScript type definitions
- **Schemas**: Zod validation schemas
- **Utils**: Utility functions

### `@chatmu/database`

Database layer:

- **Models**: Mongoose models for MongoDB
- **Data Access**: Database query functions

### `@chatmu/ui`

Reusable UI components:

- Shadcn/UI components
- Shadcn/UI hooks (useToast, etc.)
- Custom styled components
- Shared utilities (cn helper)

### `apps/server`

Backend server:

- Express.js API server
- Socket.IO real-time messaging
- Health check endpoints

### `apps/web`

Frontend application:

- Next.js 14 with App Router
- User authentication
- Real-time chat interface
- Profile management

## 🔧 Development Notes

### Adding New Dependencies

**To a specific workspace:**

```bash
npm install <package> -w apps/web
npm install <package> -w packages/shared
```

**To root (dev dependencies):**

```bash
npm install -D <package>
```

### Using Internal Packages

In `apps/web` or `apps/server`, import from internal packages:

```typescript
import { IMessage } from "@chatmu/shared";
import { User } from "@chatmu/database";
import { Button } from "@chatmu/ui";
```

### TypeScript Path Aliases

Each app/package has path aliases configured in `tsconfig.json`:

- `@chatmu/shared` → `../../packages/shared/src`
- `@chatmu/database` → `../../packages/database/src`
- `@chatmu/ui` → `../../packages/ui/src`

## 📄 Environment Variables

See `.env.example` for all required environment variables.

Key variables:

- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `NEXT_PUBLIC_SOCKET_URL`: Socket.IO server URL
- `RESEND_API_KEY`: Email service API key
- `CLOUDINARY_*`: Image upload configuration

## 🗺️ Roadmap

- [ ] Implement group chat functionality
- [ ] Improve user interface and experience
- [ ] Develop mobile application
- [ ] Add support for multiple languages
- [ ] File sharing support
- [ ] Voice/video calling

## 📝 License

This project is licensed under the MIT License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
