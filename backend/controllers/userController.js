const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Countries = require("../schema/countriesSchema");
const States = require("../schema/statesSchema");
const Cities = require("../schema/citiesSchema");
const User = require("../schema/userSchema");
const cloudinary = require("cloudinary").v2;
// abcdefghijklmnopqrstuvwxyz1322131331
cloudinary.config({
  cloud_name: "dxcwvleuy",
  api_key: "732956723883276",
  api_secret: "s_khwhyn4qhybkitKWSv6COfxos",
});

// Get countries List

const getCountries = asyncHandler(async (req, res) => {
  const countries = await Countries.find({});

  if (!countries) {
    res.status(400);
    throw new Error("Countries Not Found");
  }
  res.status(200).json(countries);
});

// Get States By Country

const getStates = asyncHandler(async (req, res) => {
  const states = await States.find({});
  // console.log("states", states);
  if (!states) {
    res.status(400);
    throw new Error("States Not Found");
  }
  res.status(200).json(states);
});

//  Get Cities By States

const getCities = asyncHandler(async (req, res) => {
  const cities = await Cities.find({});
  if (!cities) {
    res, status(400);
    throw new Erorr("Cities Not Found");
  }
  res.status(200).json(cities);
});

// Register User
const registerUser = asyncHandler(async (req, res) => {
  // console.log("req.body{registerUSer}", req.body);
  // console.log("req.file{registerUSer}", req);

  const {
    firstName,
    lastName,
    gender,
    email,
    password,
    city,
    state,
    zip,
    country,
    interests,
    profilePicture,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !gender ||
    !email ||
    !password ||
    !city ||
    !state ||
    !zip ||
    !country ||
    !interests
  ) {
    res.status(400);
    throw new Error("Please Fill All Details");
  }

  //   Find if User already exits

  const userExit = await User.findOne({ email });
  if (userExit) {
    res.status(409);
    throw new Error("User Already Exits");
  }

  //   Password Hash

  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(password, salt);

  const profilePicturePath = req.file ? req.file.path : null;

  // console.log("req.file");

  //   Create User

  // console.log(req.body);
  const file = req.files.file;
  cloudinary.uploader.upload(file.tempFilePath, async (err, result) => {
    // console.log("result", result);
    const user = await User.create({
      firstName,
      lastName,
      gender,
      email,
      password: hashedPassword,
      city,
      state,
      zip,
      country,
      interests,
      profilePicture: result.url,
    });

    // console.log("req_file", req.file);

    // console.log("user", user);
    // console.log("profilePicture", user.profilePicture);

    if (user) {
      res.status(200).json({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender,
        email: user.email,
        city: user.city,
        state: user.state,
        zip: user.zip,
        country: user.country,
        interests: user.interests,
        profilePicture: user.profilePicture,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid User Data");
    }
  });
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // fill deletais
  if (!email || !password) {
    res.status(400);
    throw new Error("Please Fill All Details");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("Invalid Email or password");
  }

  // Check password
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user._id,
      email: user.email,
      password: user.password,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid Credentials");
  }
});

// Forgot Password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  // console.log("forgot password", req.body.email);

  if (!email) {
    res.status(400);
    throw new Error("Please provide an email");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // generate reset Token
  const resetToken = crypto.randomBytes(20).toString("hex");
  console.log("reset token", resetToken);

  // Hash and set to resetPasswordToken field in user model
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiration (e.g., 10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
  console.log("user.resetPasswordExpire", user.resetPasswordExpire);

  // Token Object

  const tokenObject = {
    expireToken: user.resetPasswordExpire,
    resetToken: user.resetPasswordToken,
    userId: user._id,
  };

  await user.save();

  // Here you should send an email or any method to communicate the reset token to the user

  // Example: console.log the resetToken
  res.status(200).json({
    success: true,
    tokenObject,
    message: `${resetToken}`,
  });
});

// Reset Password

const resetPassword = asyncHandler(async (req, res) => {
  // const { token } = req.body;
  // console.log("reset token", req.body);
  // console.log("reset password", req.body.password);
  const { token, password } = req.body;

  if (!password) {
    res.status(400);
    throw new Error("Please provide a new password");
  }

  // Hash the token and check in database
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }, // Ensure token has not expired
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  // Clear reset token fields
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
  });
});

// Get All User

const getAllUser = asyncHandler(async (req, res) => {
  const user = await User.find({ user: req.user });

  if (!user) {
    res.status(400);
    throw new Error("User Not Found");
  }
  res.status(200).json(user);
});

//  Get User
const getUsers = asyncHandler(async (req, res) => {
  const user = await User.find({});
  if (!user) {
    res.status(400);
    throw new Error("Users Not Found");
  }
  res.status(200).json(user);
});

// Get Single User

const singleUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("This User Not Found");
  }
  res.status(200).json(user);
});

// Updated User

const updateUser = asyncHandler(async (req, res) => {
  // console.log("req [UpdateUser]", req.body);
  const user = await User.findById(req.body.id);
  // console.log("user [UpdateUser]", user);
  if (!user) {
    res.status(400);
    throw new Error("User Not Found");
  }

  const updatedUser = await User.findByIdAndUpdate(req.body.id, req.body, {
    new: true,
  });
  res.status(200).json({
    updatedUser,
    success: true,
    message: "User Updated has been successfully",
  });
});

// User By Id And Delete

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Erorr("User Not Found");
  }

  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "User successfully Deleted",
  });
});

// Protected Respose
const protectedResponse = (req, res) => {
  res.status(200).json(req.user);
};

// Generate Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_TOKEN, {
    expiresIn: "30d",
  });
};

// Pagination

const posts = asyncHandler(async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1); // Ensure page is at least 1
    const perPage = Math.max(1, parseInt(req.query.limit) || 10); // Default to 10 if not provided
    const totalPosts = await User.countDocuments(); // Count total users
    const totalPages = Math.ceil(totalPosts / perPage);

    // If no users exist, return empty array
    if (totalPosts === 0) {
      return res.status(200).json({
        success: true,
        total: 0, // Ensure total is included
        totalPages: 0,
        posts: [],
        message: "No users found",
      });
    }

    // Ensure page doesn't exceed totalPages
    if (page > totalPages) {
      return res.status(404).json({ message: "Page not found" });
    }

    const posts = await User.find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json({
      success: true,
      total: totalPosts, // Ensure correct key name for frontend
      totalPages,
      currentPage: page,
      perPage,
      posts,
      message: "Paginated user list",
    });
  } catch (error) {
    console.error("Pagination error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// //////////////////////////////////////////////////////////////////////////

module.exports = {
  registerUser,
  loginUser,
  protectedResponse,
  resetPassword,
  forgotPassword,
  getAllUser,
  singleUser,
  updateUser,
  deleteUser,
  getCountries,
  getStates,
  getCities,
  posts,
  getUsers,
};
