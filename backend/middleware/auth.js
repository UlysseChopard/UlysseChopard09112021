const jwt = require("jsonwebtoken");
const sauce = require("../models/sauce");
const Sauce = require("../models/sauce");

const auth = (req, res, next) => {
  const token = req?.headers?.authorization.split(" ")[1];
  if (token) {
    jwt.verify(
      token,
      process.env.SECRET || "RANDOM_TOKEN_SECRET",
      (err, user) => {
        if (err) {
          return res.status(403).json({ message: "User not authorized" });
        }
        req.token = user;
        next();
      }
    );
  } else {
    res.status(401).json({ message: "Authentication needed" });
  }
};

const isOwner = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    console.log("ici");
    return Sauce.findById(req.params.id)
      .exec()
      .then((sauce) => {
        console.log(sauce);
        if (sauce.userId !== req.token.userId) {
          return res.status(403).json({ message: "Ownership required" });
        }
        next();
      })
      .catch((e) => req.status(500).json({ error: e }));
  }

  if (req.body.userId !== req.token.userId) {
    console.log("là");
    return res.status(403).json({ message: "Ownership required" });
  }
  next();
};

module.exports = {
  auth,
  isOwner,
};
