const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const Owner = require("../models/owner");
const dotenv = require("dotenv");
dotenv.config();

const backendBaseUrl = process.env.BACKEND_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
const googleCallbackUrl = new URL("/auth/google/callback", backendBaseUrl).toString();

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleCallbackUrl
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value?.toLowerCase();

        if (!email) {
          return done(new Error("Google account did not return an email address"));
        }

        let owner = await Owner.findOne({ $or: [{ googleId }, { email }] });

        if (!owner) {
          owner = await Owner.create({
            name: profile.displayName || email.split("@")[0],
            email,
            googleId,
            provider: "google",
            phone_no: null,
            password: null,
            isEmailVerified: true
          });
        } else {
          let changed = false;

          if (!owner.googleId) {
            owner.googleId = googleId;
            changed = true;
          }

          if (!owner.provider) {
            owner.provider = "local";
            changed = true;
          }

          if (!owner.isEmailVerified) {
            owner.isEmailVerified = true;
            changed = true;
          }

          if (!owner.name && profile.displayName) {
            owner.name = profile.displayName;
            changed = true;
          }

          if (changed) {
            await owner.save();
          }
        }

        return done(null, owner);
      } catch (error) {
        return done(error);
      }
    }
  )
);
