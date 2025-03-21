const express = require("express");
const colors = require("colors");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db_config");
require("dotenv").config();
const session = require("express-session");
const passport = require("passport");
const GoogleUser = require("./schema/googleAuthSchema");
const OAuth2Strategy = require("passport-google-oauth20").Strategy;
const path = require("path");
const fileUpload = require("express-fileupload");

// Initialize Express
const app = express();

app.use(express.static("public"));

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true })); // Allow frontend requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// // Setup session
app.use(
  session({
    secret: "abcdefghijklmnopqrstuvwxyz1322131331",
    resave: false,
    saveUninitialized: false, // Prevent empty sessions
    cookie: {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/google/callback", // Corrected callback URL
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Google Profile:", profile); // Debug Google profile
      try {
        let user = await GoogleUser.findOne({ googleId: profile.id });
        if (!user) {
          user = new GoogleUser({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            image: profile.photos[0].value,
          });
          await user.save();
          console.log("user:", user);
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id); // Only store user ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await GoogleUser.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// // Routes
app.get(
  "/api/googleLogin",
  passport.authenticate("google", {
    scope: ["profile", "email"], // Define scope here
    prompt: "select_account",
  })
);

// Route to check user profile and email address for success and failure
app.get("/api/auth/me", (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Not logged in" });
  }
});

// Logout user account
app.get("/api/auth/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid"); // Clear session cookie
      res.json({ message: "Logged out successfully" });
    });
  });
});

app.get(
  "/api/google/callback", // Callback route for Google
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/",
    failureRedirect: "http://localhost:5173/login", // Redirect to login page if failed
  })
);

// Connect to Database
connectDB();

// app.use("/uploads", express.static("/uploads"));

// file upload

app.use(fileUpload({
  useTempFiles: true
}));

// Routes
app.get("/api", (req, res) => {
  res.json({ message: "Hello World" });
});

// User Routes
app.use("/api", require("./routes/userRoutes"));

// Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at PORT : ${PORT}`.bgWhite.black);
});
