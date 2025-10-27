const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { getDb, ObjectId } = require('./connect');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://blue-cse-341-api.onrender.com/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const db = getDb();

      // Find user by Google ID
      let user = await db.collection('users').findOne({ oauthId: profile.id });

      if (!user) {
        // Create new user in DB
        const newUser = {
          oauthId: profile.id,
          name: profile.displayName,
          email: profile.emails?.[0]?.value || null,
        };
        const result = await db.collection('users').insertOne(newUser);
        user = await db.collection('users').findOne({ _id: result.insertedId });
      }

      done(null, user);
    } catch (err) {
      console.error('Error in GoogleStrategy:', err);
      done(err, null); // prevents server crash
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user._id.toString()); // store string ID in session
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (err) {
    console.error('Error deserializing user:', err);
    done(err, null);
  }
});

module.exports = passport;
