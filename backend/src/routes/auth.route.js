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
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account' // Force Google to show account selector
  }),
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
    console.log('Google callback - User:', req.user);
    console.log('Google callback - Session:', req.session);
    console.log('Google callback - Session ID:', req.sessionID);
    console.log('Google callback - Cookies:', req.cookies);

    // Send HTML that will communicate with the opener window
    res.send(`
      <html>
        <body>
          <script>
            // Send message to opener window
            if (window.opener) {
              window.opener.postMessage({
                type: 'GOOGLE_AUTH_SUCCESS',
                user: ${JSON.stringify(req.user)}
              }, '${process.env.CLIENT_ORIGIN}');
              window.close();
            } else {
              window.location.href = '${process.env.CLIENT_ORIGIN}';
            }
          </script>
        </body>
      </html>
    `);
  },
);

// Add a route to check authentication status
router.get('/auth/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null
  });
});

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

router.get('/set-cookie', (req, res) => {
  res.cookie('test', 'cookie-value', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 60000,
  });
  res.send('Cookie set');
});

export default router;
