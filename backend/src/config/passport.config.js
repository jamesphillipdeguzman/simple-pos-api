import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// Load environment variables first
dotenv.config();

// Configure GoogleStrategy using environment variables (e.g for Google OAuth Login)
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      // Find or create user in DB
      return done(null, profile);
    },
  ),
);

console.log('ENVIRON:', {
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN,
  SESSION_SECRET: !!process.env.SESSION_SECRET,
  NODE_ENV: process.env.NODE_ENV,
});

//Serialize the user to store user data in the session (usually user ID)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user from the session using the stored data (e.g., user ID)
passport.deserializeUser((user, done) => {
  done(null, user);
});

export default passport;
