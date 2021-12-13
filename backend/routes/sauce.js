const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const validateInput = require("../middleware/input-validation");

const { saucePOST } = require("../middleware/input-schemas");
const sauceCtrl = require("../controllers/sauce");

router.use(auth);

router.get("/", sauceCtrl.getAll);
router.get("/:id", sauceCtrl.get);
router.post(
  "/",
  validateInput(saucePOST, "body.sauce"),
  multer,
  sauceCtrl.create
);
router.put(
  "/:id",
  validateInput(saucePOST, "body.sauce"),
  multer,
  sauceCtrl.modify
);
router.delete("/:id", sauceCtrl.del);
router.post("/:id/like", sauceCtrl.recordLikes);

module.exports = router;
