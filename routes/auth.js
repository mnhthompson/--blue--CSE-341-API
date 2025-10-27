const router = require('express').Router();
const passport = require('passport');

// Login with Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback after Google login
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/tasks'); // redirect to your app page
  }
);

// Logout
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
