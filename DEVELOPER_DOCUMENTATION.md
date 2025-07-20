# OtterSport - Developer Documentation

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [API Documentation](#api-documentation)
5. [Frontend Components](#frontend-components)
6. [Testing & Optimization](#testing--optimization)
7. [Deployment Guide](#deployment-guide)
8. [Common Issues & Solutions](#common-issues--solutions)

## 🏗️ System Overview

OtterSport is a gamified fitness application built with modern web technologies:

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit OAuth
- **Build Tool**: Vite
- **UI Library**: Radix UI + shadcn/ui components

### Key Features
- **Gamification System**: XP, levels, badges, achievements, streaks, lives
- **Workout Roadmap**: Duolingo-style visual progression
- **Adaptive Engine**: Difficulty adjustment based on user feedback
- **Psychological Triggers**: Notifications, progress animations, loss aversion
- **Card Battle System**: Turn-based exercise competition
- **Game Artist Mode**: Visual asset creation and editing tools

## 🏛️ Architecture

### Frontend Structure
```
client/src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── workout-roadmap.tsx     # Duolingo-style progression
│   │   ├── progress-animations.tsx # XP, level-up animations
│   │   ├── loss-aversion-warnings.tsx # Streak warnings
│   │   └── progress-commitment.tsx # Goal setting
│   └── gamification-dashboard.tsx # Main gamification UI
├── pages/                     # Route components
├── hooks/                     # Custom React hooks
├── lib/                       # Utilities and helpers
└── contexts/                  # React contexts
```

### Backend Structure
```
server/
├── gamification-routes.ts    # Gamification API endpoints
├── gamification.ts          # Core gamification logic
├── storage.ts               # Database operations
├── db.ts                   # Database connection
└── routes.ts               # Main API routes
```

### Database Design
```
shared/schema.ts             # Drizzle schema definitions
```

## 📊 Database Schema

### Core Tables

#### Users Table
Contains all user profile and progress data:
```typescript
users {
  id: varchar (primary key)
  email: varchar
  first_name: varchar
  last_name: varchar
  fitness_goal: varchar         // 'weight_loss', 'muscle_gain', 'general_fitness'
  fitness_level: varchar        // 'beginner', 'intermediate', 'advanced'
  workout_frequency: varchar    // 'daily', 'frequent', 'moderate', 'occasional'
  
  // Progress tracking
  current_streak: integer
  longest_streak: integer
  total_workouts: integer
  total_minutes: integer
  
  // Gamification
  experience_points: integer
  current_level: integer
  xp_to_next_level: integer
  lives_remaining: integer      // Heart/life system (max 5)
  streak_freeze_uses: integer   // Monthly limit
  
  // Adaptive system
  current_difficulty_level: real
  last_workout_feedback: varchar
  last_workout_date: timestamp
}
```

#### Exercises Table
Exercise library with categories and difficulties:
```typescript
exercises {
  id: integer (primary key)
  name: varchar
  description: text
  category: varchar             // 'strength', 'cardio', 'flexibility', 'core'
  difficulty: real             // 0.0 - 2.0 scale
  default_reps: integer
  default_duration: integer
  instructions: text
  equipment_needed: varchar[]
  muscle_groups: varchar[]
}
```

#### Gamification Tables
- **xp_activities**: XP earning opportunities
- **badges**: Available badges and their criteria
- **achievements**: User achievement definitions
- **user_badges**: User-earned badges with timestamps
- **user_achievements**: User-earned achievements
- **leaderboards**: Weekly competition tracking

## 🔌 API Documentation

### Authentication Endpoints
```
GET  /api/auth/user           # Get current user data
POST /api/auth/logout         # Logout user
```

### Core Endpoints
```
GET  /api/exercises           # Get all exercises
GET  /api/decks              # Get all workout decks
POST /api/workouts           # Create new workout session
PATCH /api/user/profile      # Update user profile
```

### Gamification Endpoints
```
GET  /api/gamification/xp                    # Get user XP/level
GET  /api/gamification/streak               # Get streak info
GET  /api/gamification/lives                # Get lives/hearts
GET  /api/gamification/badges               # Get all badges
GET  /api/gamification/achievements         # Get user achievements
GET  /api/gamification/leaderboard          # Get weekly leaderboard
GET  /api/gamification/summary              # Get gamification overview

POST /api/gamification/xp/award             # Award XP to user
POST /api/gamification/streak/freeze        # Use streak freeze
POST /api/gamification/lives/deduct         # Deduct life/heart
```

### Response Times
All API endpoints optimized for:
- Database queries: < 200ms
- Simple GET requests: < 100ms
- Complex aggregations: < 500ms

## 🎨 Frontend Components

### Key Components

#### WorkoutRoadmap
**File**: `client/src/components/ui/workout-roadmap.tsx`

Duolingo-style visual progression system featuring:
- Connected workout nodes with SVG paths
- Different workout types with unique icons
- Boss challenges and bonus unlocks
- Interactive node selection with details
- Progress tracking and completion percentage

**Props**:
```typescript
interface WorkoutRoadmapProps {
  userLevel: number;
  completedWorkouts: string[];
  currentStreak: number;
  onStartWorkout: (workoutId: string) => void;
}
```

#### GamificationDashboard
**File**: `client/src/components/gamification-dashboard.tsx`

Comprehensive gamification interface with tabs:
- **Overview**: Progress commitment and recent achievements
- **Roadmap**: Visual workout progression (NEW)
- **Achievements**: Badge collection and progress
- **Leaderboard**: Weekly competition standings
- **Streak**: Daily streak management and protection

#### Progress Animations
**File**: `client/src/components/ui/progress-animations.tsx`

Psychological engagement through visual feedback:
- **LevelUpAnimation**: Celebration with confetti effects
- **XPGainAnimation**: Floating XP numbers with smooth transitions
- **AchievementPopup**: Badge unlock notifications
- **StreakAnimation**: Fire effects for streak milestones

#### Loss Aversion Warnings
**File**: `client/src/components/ui/loss-aversion-warnings.tsx`

Motivational system using loss aversion psychology:
- **StreakWarning**: Urgent notifications for streak protection
- **LivesWarning**: Heart loss alerts and recovery timers
- Character-based messaging (otter coach)

## 🧪 Testing & Optimization

### Comprehensive Testing Suite
**File**: `complete-app-testing-suite.js`

Automated testing covering:
- Database connectivity and performance
- API endpoint functionality and response times
- Gamification system integrity
- Frontend accessibility
- Error handling and edge cases

**Run Tests**:
```bash
node complete-app-testing-suite.js
```

### Performance Optimization

#### Database Optimization
- **Indexes**: Strategic indexes on frequently queried columns
- **Connection Pooling**: Neon serverless with automatic scaling
- **Query Optimization**: Efficient joins and aggregations

#### Frontend Optimization
- **Code Splitting**: Dynamic imports for large components
- **Image Optimization**: SVG icons and optimized assets
- **Bundle Size**: Tree shaking and production builds

### Performance Benchmarks
- API Response Times: 69-120ms average
- Database Queries: < 200ms for complex operations
- Frontend Load Time: < 2 seconds initial load
- Bundle Size: Optimized for mobile-first experience

## 🚀 Deployment Guide

### Environment Setup
Required environment variables:
```bash
DATABASE_URL=postgresql://...     # PostgreSQL connection
SESSION_SECRET=...               # Session encryption key
REPLIT_DOMAINS=...               # Authentication domains
```

### Build Process
```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

### Platform Compatibility
The application is configured for deployment on:
- **Replit**: Native integration with authentication
- **Vercel**: Serverless deployment
- **Railway**: Container-based deployment
- **Heroku**: Traditional dyno deployment
- **Local Development**: Full feature support

### Migration Scripts
**Directory**: `migration-scripts/`

Platform-specific deployment scripts:
- `migrate-to-replit.sh`
- `migrate-to-vercel.sh`
- `migrate-to-railway.sh`
- `migrate-to-heroku.sh`

## 🔧 Common Issues & Solutions

### Database Connection Issues
**Problem**: Connection timeouts or pool exhaustion
**Solution**: 
```typescript
// Use connection pooling in db.ts
export const db = drizzle(
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 30000
  })
);
```

### Authentication Problems
**Problem**: Session not persisting
**Solution**: Verify session configuration and cookie settings in `replitAuth.ts`

### Frontend Build Issues
**Problem**: Import path resolution
**Solution**: Check Vite configuration and path aliases in `vite.config.ts`

### Performance Slow-downs
**Problem**: High response times
**Solution**: 
1. Check database indexes
2. Review query efficiency
3. Monitor connection pool usage
4. Use testing suite to identify bottlenecks

### Gamification Data Inconsistency
**Problem**: XP/level calculation errors
**Solution**: 
1. Validate XP calculations in `gamification.ts`
2. Check database triggers and constraints
3. Use transaction isolation for critical operations

## 📈 Monitoring & Analytics

### Built-in Analytics
- User progress tracking
- Workout completion rates
- Streak maintenance statistics
- Performance metrics collection

### Logging System
- Structured error logging
- Performance monitoring
- User interaction tracking
- Database query logging

## 🔄 Development Workflow

### Local Development
1. Start database: Ensure PostgreSQL is running
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`
4. Access application: `http://localhost:5000`

### Code Quality
- **TypeScript**: Strict type checking throughout
- **ESLint**: Code linting and formatting
- **Comments**: Comprehensive code documentation
- **Testing**: Automated test suite coverage

### Contributing Guidelines
- Follow existing code structure
- Add comments for complex logic
- Update tests for new features
- Maintain database schema documentation

---

## 📞 Support & Contact

For technical support or questions about OtterSport development:
- Review this documentation first
- Check the automated testing suite results
- Examine error logs in the console
- Refer to the `replit.md` file for project-specific context

**Last Updated**: July 20, 2025
**Version**: 2.0.0 (with Duolingo-style roadmap)
**Status**: Production Ready ✅