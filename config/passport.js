const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GithubStrategy = require("passport-github2").Strategy;
const User = require("../models/user.model");

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// ── Google Strategy ──
passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  "https://talenthub-6f38.onrender.com/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (user) return done(null, user);

        // Check if email already registered manually
        const existingEmail = await User.findOne({ 
            email: profile.emails[0].value 
        });

        if (existingEmail) {
            // Link Google ID to existing account
            existingEmail.googleId = profile.id;
            existingEmail.photoUrl = existingEmail.photoUrl || profile.photos[0]?.value;
            await existingEmail.save();
            return done(null, existingEmail);
        }

        // Create brand new user
        user = await User.create({
            googleId:  profile.id,
            firstName: profile.name.givenName,
            lastName:  profile.name.familyName || "",
            email:     profile.emails[0].value,
            photoUrl:  profile.photos[0]?.value || "",
            password:  "oauth_no_password",
            role:      "user"
        });

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

// ── GitHub Strategy ──
passport.use(new GithubStrategy({
    clientID:     process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL:  "https://talenthub-6f38.onrender.com/auth/github/callback",
    scope:        ["user:email"]
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

        let user = await User.findOne({ githubId: profile.id });
        if (user) return done(null, user);

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            existingEmail.githubId = profile.id;
            existingEmail.photoUrl = existingEmail.photoUrl || profile.photos[0]?.value;
            await existingEmail.save();
            return done(null, existingEmail);
        }

        // Split GitHub display name into first/last
        const nameParts  = (profile.displayName || profile.username || "").split(" ");
        const firstName  = nameParts[0] || profile.username;
        const lastName   = nameParts.slice(1).join(" ") || "";

        user = await User.create({
            githubId:  profile.id,
            firstName,
            lastName,
            email,
            photoUrl:  profile.photos[0]?.value || "",
            password:  "oauth_no_password",
            role:      "user"
        });

        return done(null, user);
    } catch (err) {
        return done(err, null);
    }
}));

module.exports = passport;