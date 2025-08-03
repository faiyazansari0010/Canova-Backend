const express = require("express");
const upload = require("../middlewares/multer");
const { signup } = require("../controllers/UserController");
const {
  login,
  sendOtp,
  verifyOtp,
  resetPassword,
  uploadFile,
  publishForm,
  getUser,
  updateUserData,
  saveForm,
  logout,
} = require("../controllers/UserController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);
router.post(
  "/upload",
  (req, res, next) => {
    console.log("➡️  Upload route middleware hit");
    next();
  },
  upload.single("file"),
  uploadFile
);
router.post("/publish-form", publishForm);
router.get("/get-user/:email", getUser);
router.post("/updateUserData", updateUserData);
router.post("/saveForm", saveForm);
router.post("/logout", logout);

module.exports = router;
