const express = require("express");
const upload = require("../middlewares/multer");
const { signup } = require("../controllers/UserController");
const {
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  getUserOnRefresh,
  uploadFile
} = require("../controllers/UserController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", getUserOnRefresh);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

router.post("/upload", upload.single("file"), uploadFile);

module.exports = router;
