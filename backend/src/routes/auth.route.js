import dotenv from 'dotenv';
import express from 'express';
import passport from 'passport';

// Load environment variables
dotenv.config();

const router = express.Router();

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Redirect user to Google OAuth for login
 *     tags:
 *       - Authentication
 *     responses:
 *       302:
 *         description: Initiates Google OAuth login (Pop-up based). This redirect flow works only in a browser, not via Swagger "Try it out".
 */
router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    prompt: 'select_account',
  }),
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback url for login
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Successful login, send user data back via postMessage
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<script>window.opener.postMessage(...)</script>"
 *       302:
 *         description: Redirect if login fails
 */
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    console.log('Google callback - User:', req.user);
    console.log('Google callback - Session:', req.session);
    console.log('Google callback - Session ID:', req.sessionID);
    console.log('Google callback - Cookies:', req.cookies);

    res.send(`
      <html>
        <body>
          <script>
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

/**
 * @swagger
 * /auth/status:
 *   get:
 *     summary: Check the current authentication status
 *     description: Returns whether the user is currently authenticated and includes user profile if logged in
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Returns auth status and user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     displayName:
 *                       type: string
 *                       example: James Phillip De Guzman
 *                     emails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           value:
 *                             type: string
 *                             example: jamesphillipdeguzman@gmail.com
 */
router.get('/auth/status', (req, res) => {
  res.json({
    authenticated: req.isAuthenticated(),
    user: req.user || null,
  });
});

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
 */
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

/**
 * @swagger
 * /set-cookie:
 *   get:
 *     summary: Set a secure, test cookie
 *     description: Useful for debugging cookie behavior (e.g., Secure + SameSite=None)
 *     tags:
 *       - Development
 *     responses:
 *       200:
 *         description: Cookie set successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Cookie set
 */
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
