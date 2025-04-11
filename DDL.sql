CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  fullname VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(100),
  is_logged_in BOOLEAN DEFAULT FALSE
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  location VARCHAR(255),
  date DATE,
  time TIME,
  organizer VARCHAR(100),
  category VARCHAR(50),
  image VARCHAR(255)
);

CREATE TABLE registrations (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(100),
  event_id INTEGER,
  UNIQUE (user_email, event_id)
);
