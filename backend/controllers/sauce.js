const Sauce = require("../models/sauce");
const fs = require("fs");

exports.create = (req, res, next) => {
    const sauceObj = JSON.parse(req.body.sauce);
    delete sauceObj._id;
    const sauce = new Sauce({
        ...sauceObj,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: `Sauce ${sauce.name} enregistrée` }))
      .catch(e => res.status(400).json({ error: e }));
};

exports.get = (req, res, next) => {
    Sauce.findById(req.params.id)
      .then(sauce => res.status(200).json(sauce))
      .catch(e => res.satus(404).json({
          error: e
      }));
};

exports.getAll = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(e => res.status(400).json({ error: e }));
};

// TODO: supprimer les images inutiles
exports.modify = (req, res, next) => {
    const sauceObj = req.file ?
      {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      } : { ...req.body };
      console.log(sauceObj);
    Sauce.findByIdAndUpdate(req.params.id, { ...sauceObj, _id: req.params.id }, { new: true, upsert: true })
      .then(() => res.status(200).json({ message: `${sauceObj.name} modifié` }))
      .catch(e => res.status(400).json({ error: e }));
};

exports.del = (req, res, next) => {
    Sauce.findById(req.params.id)
      .then(sauce => {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.findByIdAndDelete(req.params.id)
                .then(() => res.status(200).json({ message: "Supprimé" }))
                .catch(e => res.status(400).json({ error: e }));
          });
      })
      .catch(e => res.status(500).json({ error: e }));
};

// TODO: améliorer
exports.recordLikes = (req, res, next) => {
  const update = {};
  if (req.body.like > 0) {
    update.likes++;
    update.usersLiked.push(req.body.userId);
  } else if (req.body.like < 0) {
    update.dislikes++;
    update.usersDisliked.push(req.body.userId);
  } else {

  }
  Sauce.findByIdAndUpdate(req.params.id, { }, { new: true })
};

exports.cancelLike = (req, res, next) => {
  
};