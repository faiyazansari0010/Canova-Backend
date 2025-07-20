const express = require("express");
const {signup} = require("../controllers/UserController")

const router = express.Router();

router.post("/signup", signup);

module.exports = router