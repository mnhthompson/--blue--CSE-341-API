const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongodb = require('./connect');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://blue-cse-341-api.onrender.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const db = mongodb.getDb();
      let user = await db.collection('users').findOne({ oauthId: profile.id });

      if (!user) {
        // Create new user in DB
        const newUser = {
          oauthId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
        };
        const result = await db.collection('users').insertOne(newUser);
        user = result.ops[0];
      }

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = mongodb.getDb();
    const user = await db.collection('users').findOne({ _id: new mongodb.ObjectId(id) });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
