# Pomodoro Timer Application

## Overview

This is a Matrix-themed Pomodoro timer application built with React frontend and Express backend. The application features a 20-minute focus timer with 5-minute breaks, statistics tracking, and a cyberpunk aesthetic with digital rain effects and Matrix-style quotes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: Tailwind CSS with custom Matrix-themed color scheme
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL session store
- **API**: RESTful API with JSON responses

### Key Design Decisions
1. **Monorepo Structure**: Single repository with shared schema between client and server
2. **TypeScript Throughout**: End-to-end type safety
3. **Matrix Theme**: Cyberpunk aesthetic with green/cyan neon colors and digital rain effects
4. **In-Memory Fallback**: MemStorage class for development without database
5. **Real-time Updates**: Timer state managed in React with Web Audio API for notifications

## Key Components

### Frontend Components
- **PomodoroPage**: Main timer interface with circular progress indicator
- **TimerCircle**: Animated SVG circle showing countdown progress
- **StatisticsPanel**: Daily and weekly stats display with achievements
- **DigitalRain**: Canvas-based Matrix-style background animation
- **UI Components**: Complete shadcn/ui component library

### Backend Components
- **Storage Interface**: Abstraction layer for data persistence
- **Session Management**: Timer session tracking and statistics
- **API Routes**: RESTful endpoints for sessions and statistics
- **Database Schema**: Drizzle ORM schemas for sessions and daily stats

### Custom Hooks
- **usePomodoro**: Timer logic with start/pause/reset functionality
- **useAudio**: Web Audio API integration for timer notifications
- **useToast**: Toast notification system

## Data Flow

### Timer Flow
1. User starts timer (20-minute focus or 5-minute break)
2. Timer counts down with circular progress animation
3. On completion, session is saved to database
4. Audio notification plays
5. Statistics are updated and UI refreshes

### Data Persistence
1. Sessions stored with type, duration, completion time, and date
2. Daily stats automatically calculated and cached
3. Recent sessions displayed in statistics panel
4. Weekly stats aggregated for progress tracking

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, Radix UI, Tailwind CSS
- **Data Fetching**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Audio**: Web Audio API for timer notifications
- **Canvas**: HTML5 Canvas for digital rain animation

### Backend Dependencies
- **Database**: PostgreSQL with Drizzle ORM
- **Hosting**: Neon Database for PostgreSQL hosting
- **Session Storage**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for schema validation
- **Date Handling**: date-fns for date manipulation

### Development Dependencies
- **Build Tools**: Vite, esbuild, TypeScript
- **Development**: tsx for TypeScript execution
- **Linting**: ESLint, Prettier (implicit)
- **Replit Integration**: Replit-specific plugins for development

## Deployment Strategy

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment mode (development/production)
- **REPL_ID**: Replit environment detection

### Deployment Steps
1. Install dependencies: `npm install`
2. Build application: `npm run build`
3. Apply database migrations: `npm run db:push`
4. Start production server: `npm start`

### Development Workflow
- **Dev Server**: `npm run dev` starts both frontend and backend
- **Type Checking**: `npm run check` validates TypeScript
- **Database Updates**: `npm run db:push` applies schema changes

### Production Considerations
- Express serves static files from `dist/public` in production
- Database connection pooling via Neon serverless
- Session persistence with PostgreSQL session store
- Error handling with proper HTTP status codes
- CORS and security headers configured via Express middleware