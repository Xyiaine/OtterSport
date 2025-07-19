CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_fitness_profile ON users (fitnessGoal, fitnessLevel);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_users_active_tracking ON users (currentStreak, totalWorkouts);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_exercises_category_difficulty ON exercises (category, defaultDifficulty);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workouts_user_timeline ON workouts (userId, completedAt);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_workouts_analytics ON workouts (completedAt, duration, feedback);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deck_exercises_lookup ON deckExercises (deckId, exerciseId);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_achievements_progress ON userAchievements (userId, unlockedAt);