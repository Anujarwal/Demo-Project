// const passport = require("passport");
// const GoogleUser = require("../schema/googleAuthSchema");
// const OAuth2Strategy = require("passport-google-oauth20").Strategy;

// module.exports = passport.use(
//   new OAuth2Strategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:8000/api/google-login", // Corrected callback URL
//     },
//     async (accessToken, refreshToken, profile, done) => {
//       console.log("Google Profile:", profile); // Debug Google profile
//       try {
//         let user = await GoogleUser.findOne({ googleId: profile.id });
//         if (!user) {
//           user = new GoogleUser({
//             googleId: profile.id,
//             displayName: profile.displayName,
//             email: profile.emails[0].value,
//             image: profile.photos[0].value,
//           });
//           await user.save();
//         }
//         return done(null, user);
//       } catch (error) {
//         return done(error, null);
//       }
//     }
//   )
// );

// passport.serializeUser((user, done) => {
//   done(null, user);
// });

// passport.deserializeUser((user, done) => {
//   done(null, user);
// });

// // module.exports = passport;
