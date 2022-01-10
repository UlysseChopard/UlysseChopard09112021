const express = require("express");
const router = express.Router();

const { userPOST } = require("../middleware/input-schemas");
const validateInput = require("../middleware/input-validation");
const { createAccountLimiter } = require("../middleware/rate-limit");
const maskEmail = require("../middleware/mask-email");

const userCtrl = require("../controllers/user");

router.use(maskEmail);

router.post(
  "/signup",
  createAccountLimiter,
  validateInput(userPOST, "body"),
  userCtrl.signup
);

router.post("/login", userCtrl.login);

module.exports = router;
