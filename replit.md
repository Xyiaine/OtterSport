# OtterSport - Fitness Card Game Application

## Overview

OtterSport is a minimalist, card-based fitness game that helps users build consistent daily workout habits. The application features a React frontend with TypeScript, an Express.js backend, and uses Drizzle ORM with PostgreSQL for data persistence. The system includes user authentication via Replit's OAuth, adaptive workout progression, and comprehensive fitness tracking.

## User Preferences

- **Communication Style**: Simple, everyday language
- **Code Style**: Clear comments and documentation for human developers
- **Priority**: Code readability and maintainability over brevity

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom OtterSport theme (teal-based color scheme)
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL via Neon serverless with connection pooling
- **ORM**: Drizzle ORM with type-safe queries
- **Authentication**: Replit OAuth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage

### Database Schema
The application uses a comprehensive schema with the following key entities:
- **Users**: Stores user profiles, fitness goals, progress tracking, and adaptive difficulty settings
- **Exercises**: Library of workout exercises with categories, difficulty levels, and default parameters
- **Decks**: Collections of exercises that form complete workouts
- **Workouts**: Individual workout sessions with completion tracking and feedback
- **Achievements**: Gamification system with user achievement tracking
- **Sessions**: Secure session storage for authentication

## Key Components

### Authentication System
- **Problem**: Secure user authentication and session management
- **Solution**: Replit OAuth integration with OpenID Connect
- **Implementation**: Passport.js strategy with PostgreSQL session storage
- **Benefits**: Seamless integration with Replit environment, secure token handling

### Adaptive Progression Engine
- **Problem**: Personalized workout difficulty adjustment
- **Solution**: Feedback-based adaptive algorithm that adjusts exercise difficulty
- **Implementation**: Real-time difficulty calculation based on user feedback (too easy, just right, too hard)
- **Benefits**: Maintains optimal challenge level, prevents plateaus and burnout

### Card-Based Workout System
- **Problem**: Structured yet flexible workout delivery
- **Solution**: Deck-based exercise cards with randomization and progression
- **Implementation**: Exercise cards with reps/duration calculations based on user difficulty level
- **Benefits**: Gamified experience, variety in workouts, progressive overload

### Responsive UI Components
- **Problem**: Mobile-first fitness application needs
- **Solution**: Custom React components with mobile-optimized design
- **Implementation**: Tailwind CSS with responsive breakpoints, touch-friendly interactions
- **Benefits**: Excellent mobile experience, consistent design system

## Data Flow

### User Onboarding Flow
1. User authenticates via Replit OAuth
2. Onboarding process captures fitness goals, experience level, and frequency preferences
3. System generates personalized base difficulty level
4. User completes starter workout for initial calibration
5. Adaptive engine adjusts difficulty based on initial feedback

### Workout Execution Flow
1. User selects or is recommended a workout deck
2. System calculates exercise parameters based on current difficulty level
3. User completes exercises one by one with real-time timers
4. Post-workout feedback collection for adaptive adjustment
5. Progress tracking and achievement updates

### Adaptive Progression Loop
1. User provides workout feedback (too easy/just right/too hard)
2. Adaptive engine processes feedback with historical patterns
3. Difficulty level adjustment calculation
4. Next workout parameters updated automatically
5. Long-term progress tracking and goal reassessment

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries and migrations
- **express**: Web server framework
- **passport**: Authentication middleware
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Authentication Dependencies
- **openid-client**: OpenID Connect implementation
- **connect-pg-simple**: PostgreSQL session store
- **express-session**: Session management middleware

### Development Dependencies
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **tsx**: TypeScript execution for Node.js

## Deployment Strategy

### Development Environment
- **Server**: Node.js with tsx for TypeScript execution
- **Client**: Vite development server with HMR
- **Database**: Neon PostgreSQL with connection pooling
- **Authentication**: Replit OAuth in development mode

### Production Build
- **Backend**: Compiled TypeScript to ES modules with esbuild
- **Frontend**: Vite production build with optimization
- **Assets**: Static file serving via Express
- **Database**: Drizzle migrations for schema updates

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **Authentication**: `REPLIT_DOMAINS`, `ISSUER_URL`, `SESSION_SECRET`
- **Deployment**: Automatic build and deployment on Replit

The architecture prioritizes user experience with fast, responsive interactions while maintaining data consistency and security. The adaptive progression system ensures users remain engaged with appropriately challenging workouts, while the card-based system provides structure and gamification elements.

## Recent Changes

### July 18, 2025
- **Migration to Replit**: Successfully migrated project from Replit Agent to full Replit environment
- **Database Setup**: Created PostgreSQL database with proper connection configuration
- **React Component Fixes**: Fixed critical EditableImage component errors causing runtime crashes
- **TypeScript Compatibility**: Resolved React Query v5 compatibility issues and type safety problems
- **API Testing**: Comprehensive testing of all endpoints - exercises, decks, achievements, analytics
- **Development Environment**: All hot-reloading, development tools, and monitoring fully operational

### Migration Status
- ✅ PostgreSQL database successfully configured and migrated
- ✅ Server running on port 5000 with proper authentication
- ✅ Frontend hot-reloading working correctly
- ✅ All dependencies installed and configured
- ✅ React runtime errors fixed - application loads without crashes
- ✅ Database seeded with comprehensive default data (13 exercises, 4 decks, 8 achievements)
- ✅ API endpoints verified and working correctly
- ✅ Development monitoring tools and analytics endpoints operational
- ✅ TypeScript errors reduced from 118 to manageable non-critical issues
- ✅ Core application functionality verified and working

### January 17, 2025
- **Code Refactoring**: Simplified and documented entire codebase for better maintainability
- **Database Schema**: Added comprehensive comments explaining all tables and relationships
- **Server Architecture**: Improved API routes with clear documentation and error handling
- **Authentication**: Enhanced Replit OAuth integration with proper session management
- **Frontend Structure**: Simplified React components with clear comments and better organization
- **Developer Experience**: Added comprehensive README and improved project documentation

## Development Notes

### Key Improvements Made
1. **Database Layer**: Added clear comments to all schema definitions and storage operations
2. **API Routes**: Organized routes by feature with comprehensive documentation
3. **Frontend**: Simplified component structure with explanatory comments
4. **Authentication**: Enhanced session management with proper error handling
5. **Type Safety**: Maintained strong TypeScript typing throughout the application

### For Future Development
- The codebase is now fully documented and ready for human developers
- All major components have explanatory comments
- Database schema is clearly defined with relationships
- API endpoints are well-documented with expected inputs/outputs
- Authentication flow is simplified and secure