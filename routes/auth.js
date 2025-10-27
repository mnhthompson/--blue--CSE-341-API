const jwt = require('jsonwebtoken');
const router = require('express').Router();
const passport = require('passport');

const JWT_SECRET = 'carrot';

// google login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, name: req.user.displayName, email: req.user.emails[0].value },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Redirect with token in query
     res.json({ token });
  }
);


router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
