-- OtterSport Database Backup
-- Generated: 2025-07-18T14:54:55.555Z

-- Table: exercises
CREATE TABLE IF NOT EXISTS exercises (
  id integer NOT NULL DEFAULT nextval('exercises_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  category character varying NOT NULL,
  difficulty real NOT NULL,
  default_reps integer,
  default_duration integer,
  instructions text,
  icon character varying DEFAULT 'fas fa-dumbbell'::character varying,
  created_at timestamp without time zone DEFAULT now()
);

-- Error backing up data for exercises: syntax error at or near "$1"

-- Table: user_achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id integer NOT NULL DEFAULT nextval('user_achievements_id_seq'::regclass),
  user_id character varying NOT NULL,
  achievement_id integer NOT NULL,
  unlocked_at timestamp without time zone DEFAULT now()
);

-- Error backing up data for user_achievements: syntax error at or near "$1"

-- Table: sessions
CREATE TABLE IF NOT EXISTS sessions (
  sid character varying NOT NULL,
  sess jsonb NOT NULL,
  expire timestamp without time zone NOT NULL
);

-- Error backing up data for sessions: syntax error at or near "$1"

-- Table: workouts
CREATE TABLE IF NOT EXISTS workouts (
  id integer NOT NULL DEFAULT nextval('workouts_id_seq'::regclass),
  user_id character varying NOT NULL,
  deck_id integer NOT NULL,
  started_at timestamp without time zone NOT NULL,
  completed_at timestamp without time zone,
  duration integer,
  cards_completed integer DEFAULT 0,
  total_cards integer NOT NULL,
  feedback character varying,
  calories integer
);

-- Error backing up data for workouts: syntax error at or near "$1"

-- Table: achievements
CREATE TABLE IF NOT EXISTS achievements (
  id integer NOT NULL DEFAULT nextval('achievements_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  icon character varying NOT NULL,
  requirement jsonb,
  created_at timestamp without time zone DEFAULT now()
);

-- Error backing up data for achievements: syntax error at or near "$1"

-- Table: decks
CREATE TABLE IF NOT EXISTS decks (
  id integer NOT NULL DEFAULT nextval('decks_id_seq'::regclass),
  name character varying NOT NULL,
  description text,
  category character varying NOT NULL,
  difficulty real NOT NULL,
  estimated_minutes integer,
  is_custom boolean DEFAULT false,
  created_by character varying,
  created_at timestamp without time zone DEFAULT now()
);

-- Error backing up data for decks: syntax error at or near "$1"

-- Table: deck_exercises
CREATE TABLE IF NOT EXISTS deck_exercises (
  id integer NOT NULL DEFAULT nextval('deck_exercises_id_seq'::regclass),
  deck_id integer NOT NULL,
  exercise_id integer NOT NULL,
  order integer NOT NULL,
  custom_reps integer,
  custom_duration integer
);

-- Error backing up data for deck_exercises: syntax error at or near "$1"

-- Table: users
CREATE TABLE IF NOT EXISTS users (
  id character varying NOT NULL,
  email character varying,
  first_name character varying,
  last_name character varying,
  profile_image_url character varying,
  created_at timestamp without time zone DEFAULT now(),
  updated_at timestamp without time zone DEFAULT now(),
  fitness_goal character varying,
  fitness_level character varying,
  workout_frequency character varying,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  total_workouts integer DEFAULT 0,
  total_minutes integer DEFAULT 0,
  current_difficulty_level real DEFAULT 1,
  last_workout_feedback character varying
);

-- Error backing up data for users: syntax error at or near "$1"

