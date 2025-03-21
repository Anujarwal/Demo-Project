const express = require("express");
const {
  registerUser,
  loginUser,
  protectedResponse,
  forgotPassword,
  resetPassword,
  getAllUser,
  singleUser,
  updateUser,
  deleteUser,
  getCountries,
  getStates,
  getCities,
  posts,
  getUsers,
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
// const multer = require("multer");
// const multer = require("multer");

// File Upload

// // multer

// const uploadDir = path.join(__dirname, "/backend/uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "../uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage });

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "./backend/uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null,  (file.originalname));
//   },
// });

// const upload = multer({ storage });
// // console.log(upload)

const router = express.Router();
router.get("/countries", getCountries);
router.get("/states", getStates);
router.get("/cities", getCities);
router.get("/getAllUser", getAllUser);
router.get("/users", getUsers);
router.get("/post", posts);
router.get("/:id", singleUser);
router.put("/updateUser", updateUser);
router.delete("/:id", deleteUser);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/protected", protect, protectedResponse);

module.exports = router;
