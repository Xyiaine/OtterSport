# OtterSport - Fitness Card Game

A minimalist, card-based fitness game that helps users build consistent daily workout habits through gamification and adaptive progression.

## 🎯 Features

- **Card-Based Workouts**: Exercise decks with randomized, progressive workouts
- **Adaptive Difficulty**: AI-powered system that adjusts difficulty based on user feedback
- **Streak Tracking**: Gamified progress tracking with achievements
- **Custom Decks**: Create your own workout combinations
- **Replit Authentication**: Secure login with Replit OAuth
- **Mobile-First Design**: Responsive interface optimized for mobile devices

## 🏗️ Architecture

### Frontend (Client)
- **React + TypeScript**: Modern UI with type safety
- **TanStack Query**: Server state management and caching
- **Tailwind CSS**: Utility-first styling with custom OtterSport theme
- **Radix UI + shadcn/ui**: Accessible component library
- **Wouter**: Lightweight client-side routing

### Backend (Server)
- **Node.js + Express**: RESTful API server
- **PostgreSQL**: Database with connection pooling
- **Drizzle ORM**: Type-safe database queries
- **Replit Auth**: OpenID Connect authentication
- **Express Sessions**: Secure session management

## 🗃️ Database Schema

```sql
-- Core tables
users          -- User profiles and fitness data
exercises      -- Exercise library with categories
decks          -- Workout collections
deck_exercises -- Links exercises to decks
workouts       -- Individual workout sessions
achievements   -- Gamification system
sessions       -- Authentication sessions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database
- Replit environment variables

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up database**
   ```bash
   npm run db:push
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the app**
   - Frontend: `http://localhost:5000`
   - API: `http://localhost:5000/api`

## 🔧 Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Authentication (provided by Replit)
REPLIT_DOMAINS=your-domain.replit.dev
REPL_ID=your-repl-id
ISSUER_URL=https://replit.com/oidc
SESSION_SECRET=your-session-secret (optional)
```

## 📁 Project Structure

```
├── client/src/          # React frontend
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities and configurations
│   └── pages/           # Route components
├── server/              # Express backend
│   ├── db.ts           # Database connection
│   ├── storage.ts      # Database operations
│   ├── routes.ts       # API endpoints
│   └── replitAuth.ts   # Authentication setup
├── shared/              # Shared types and schemas
│   └── schema.ts       # Database schema and types
└── game-assets/        # Exercise images and icons
```

## 🎮 How It Works

### User Flow
1. **Login**: Authenticate with Replit OAuth
2. **Onboarding**: Set fitness goals and preferences
3. **Workout Selection**: Choose from system or custom decks
4. **Exercise Execution**: Complete exercises with timers
5. **Feedback**: Rate workout difficulty
6. **Progress Tracking**: View stats and achievements

### Adaptive System
- Tracks user feedback after each workout
- Adjusts exercise difficulty multipliers
- Maintains optimal challenge level
- Prevents plateaus and burnout

## 🔌 API Endpoints

### Authentication
- `GET /api/auth/user` - Get current user
- `GET /api/login` - Start login flow
- `GET /api/logout` - End session

### Users
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/stats` - Get user statistics

### Exercises
- `GET /api/exercises` - List exercises
- `POST /api/exercises` - Create exercise

### Decks
- `GET /api/decks` - List workout decks
- `GET /api/decks/:id` - Get deck with exercises
- `POST /api/decks` - Create custom deck

### Workouts
- `POST /api/workouts` - Start workout
- `PATCH /api/workouts/:id` - Complete workout

## 🎨 Customization

### Colors
The app uses a custom teal-based color scheme defined in `client/src/index.css`:

```css
:root {
  --otter-teal: #4A90A4;
  --otter-neutral: #F5F5F5;
  --otter-accent: #F39C12;
}
```

### Adding Exercises
1. Use the admin interface or API to add exercises
2. Specify category, difficulty, and default parameters
3. Exercises automatically appear in deck creation

## 🧪 Development

### Database Operations
```bash
# Push schema changes
npm run db:push

# Generate migrations (if using migrate)
npm run db:generate

# View database
npm run db:studio
```

### Code Quality
- TypeScript for type safety
- Zod for runtime validation
- Drizzle for type-safe queries
- ESLint for code quality

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📜 License

MIT License - feel free to use this project for your own fitness applications!

## 🆘 Support

For issues or questions:
1. Check the logs in the Replit console
2. Review the API endpoints in `server/routes.ts`
3. Verify database schema in `shared/schema.ts`
4. Test authentication flow in `server/replitAuth.ts`

---

Built with ❤️ for a healthier lifestyle through consistent exercise habits.