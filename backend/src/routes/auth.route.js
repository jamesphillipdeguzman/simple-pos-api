import express from 'express';
import passport from 'passport';

const router = express.Router();

// Redirect user to Google for login
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Handle the OAuth callback
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful login
    // res.redirect('/protected-or-dashboard');
    // req.user contain Google profile
    res
      .status(200)
      .json({ message: 'Login successful', user: req.user.displayName });
  },
);

// Logout user and go back to Welcome message for my backend API
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
