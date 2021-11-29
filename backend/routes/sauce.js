const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const sauceCtrl = require("../controllers/sauce");

router.use(auth);

router.get("/", sauceCtrl.getAll);
router.get("/:id", sauceCtrl.get);
router.post("/", multer, sauceCtrl.create);
router.put("/:id", multer, sauceCtrl.modify);
router.delete("/:id", sauceCtrl.del);
router.post("/:id/like", sauceCtrl.recordLikes);

module.exports = router;