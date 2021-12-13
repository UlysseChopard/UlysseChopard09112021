const {
  hashPassword,
  checkPassword,
  generateUserToken,
} = require("../services/user");

const User = require("../models/user");

exports.signup = (req, res) => {
  hashPassword(req.body.password)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      return user.save();
    })
    .then((user) =>
      res.status(200).json({ message: `Utilisateur ${user.email} créé !` })
    )
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user)
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      checkPassword(req.body.password, user.password).then((valid) => {
        if (!valid)
          return res.status(401).json({ error: "Mot de passe incorrect !" });
        res.status(200).json({
          userId: user._id,
          token: generateUserToken(user._id, process.env.SECRET, "24h"),
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
