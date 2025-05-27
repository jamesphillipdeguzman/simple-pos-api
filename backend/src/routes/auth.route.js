import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';

// Load environment variables
dotenv.config();

const router = express.Router();

// Redirect user to Google for login
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirect user to Google OAuth for login
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Initiates Google OAuth login. This redirect flow works only in a browser, not via Swagger "Try it out".
 */
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

// Handle the OAuth callback
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback url for login
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successful login, returns user profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: string
 *                   example: James Phillip De Guzman
 *       302:
 *         description: Redirect if login fails
 *
 */
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Instead of immediate redirect, send a simple HTML page that triggers redirect after a brief pause
    // This gives browser time to process the set-cookie header

    res.send(`
      <html>
        <body>
          <script>
            // Redirect to frontend after a slight delay
            setTimeout(() => {
              window.location.href = "${process.env.CLIENT_ORIGIN}";
            }, 100);
          </script>
          <p>Login successful, redirecting...</p>
        </body>
      </html>
    `);
  },
);

// Logout user and go back to Welcome message for my backend API
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Logs out the current user and redirects to home
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Redirects to homepage after logout
 *
 */
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

export default router;
