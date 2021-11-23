const Sauce = require("../models/sauce");
const fs = require("fs");

exports.create = (req, res, next) => {
    const sauceObj = JSON.parse(req.body.sauce);
    delete sauceObj._id;
    const sauce = new Sauce({
        ...sauceObj,
        imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    });
    sauce.save()
      .then(() => res.status(201).json({ message: "Enregistré" }))
      .catch(next);
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
      .catch(next);
};

exports.modify = (req, res, next) => {
    const sauceObj = req.file ?
      {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      } : { ...JSON.parse(req.body) };
    Sauce.findByIdAndUpdate(req.params.id, { ...sauceObj, _id: req.params.id })
      .then(() => res.status(200).json({ message: "Modifié" }))
      .catch(next);
};

exports.remove = (req, res, next) => {
    Sauce.findById(req.params.id)
      .then(sauce => {
          const filename = sauce.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.findByIdAndDelete(req.params.id)
                .then(() => res.status(200).json({ message: "Supprimé" }))
                .catch(next);
          });
      })
      .catch(e => res.status(500).json({ error: e }));
};

exports.recordLikes = (req, res, next) => {

};