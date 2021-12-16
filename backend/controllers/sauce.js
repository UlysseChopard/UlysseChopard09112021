const fs = require("fs");
const Sauce = require("../models/sauce");

exports.create = (req, res, next) => {
  const sauceObj = JSON.parse(req.body.sauce);
  delete sauceObj._id;
  const sauce = new Sauce({
    ...sauceObj,
    // likes: 0,
    // dislikes: 0,
    // usersLiked: [],
    // usersDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  sauce
    .save()
    .then(() =>
      res.status(201).json({ message: `Sauce ${sauce.name} enregistrée` })
    )
    .catch((error) => res.status(400).json({ error: error}));
};

exports.get = (req, res, next) => {
  Sauce.findById(req.params.id)
    .exec()
    .then((sauce) => res.status(200).json(sauce))
    .catch((e) =>
      res.satus(404).json({
        error: e,
      })
    );
};

exports.getAll = (req, res, next) => {
  Sauce.find()
    .exec()
    .then((sauces) => res.status(200).json(sauces))
    .catch((e) => res.status(400).json({ error: e }));
};

exports.modify = (req, res, next) => {
  const modifiedSauce = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  console.log("modified:", modifiedSauce);

  const deletePreviousImage = (sauce) => {
    const filename = sauce.imageUrl.split("/images/")[1];
    console.log("sauce", sauce);
    console.log("filename", filename);
    fs.unlink(`/app/images/${filename}`, (err) => {
      if (err) throw err;
    });
  };

  Sauce.findByIdAndUpdate(
    req.params.id,
    { ...modifiedSauce, _id: req.params.id },
    (err, sauce) => {
      if (err) return res.status(400).json({ error: err });
      if (req.file) deletePreviousImage(sauce);
      res.status(200).json({ message: `Sauce ${sauce.name} modifiée` });
    }
  );
};

exports.del = (req, res, next) => {
  Sauce.findById(req.params.id)
    .exec()
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        const deleteQuery = Sauce.findByIdAndDelete(req.params.id);
        deleteQuery
          .exec()
          .then((deletedSauce) =>
            res
              .status(200)
              .json({ message: `Sauce ${deletedSauce.name} supprimée` })
          )
          .catch((e) => res.status(400).json({ error: e }));
      });
    })
    .catch((e) => res.status(500).json({ error: e }));
};

exports.recordLikes = (req, res, next) => {
  const sauceId = req.params.id;
  const { userId, like } = req.body;

  const previousOpinion = (sauce, user) => {
    if (sauce.usersLiked.includes(user)) return 1;
    if (sauce.usersDisliked.includes(user)) return -1;
    return 0;
  };

  const manageSauceLikesState = (sauce, user, liked, modify) => {
    if (modify && liked === 1) {
      sauce.dislikes--;
      sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== user);
    } else if (modify && liked === -1) {
      sauce.likes--;
      sauce.usersLiked = sauce.usersLiked.filter((id) => id !== user);
    } else if (!liked && modify === 1) {
      sauce.usersLiked = sauce.usersLiked.filter((id) => id !== user);
      sauce.likes--;
      return sauce;
    } else if (!liked && modify === -1) {
      sauce.usersDisliked = sauce.usersDisliked.filter((id) => id !== user);
      sauce.dislikes--;
      return sauce;
    }

    if (liked === 1) {
      sauce.likes++;
      sauce.usersLiked.push(user);
      return sauce;
    } else if (liked === -1) {
      sauce.dislikes++;
      sauce.usersDisliked.push(user);
      return sauce;
    } else {
      return sauce;
    }
  };

  const updateSauce = (sauce, user, likeVal) => {
    const prevOpinion = previousOpinion(sauce, user);

    if (prevOpinion === likeVal) return sauce;

    return manageSauceLikesState(sauce, user, likeVal, prevOpinion);
  };

  Sauce.findById(sauceId, (err, sauce) => {
    if (err) return res.status(500).json({ error: err });

    const updatedSauce = updateSauce(sauce, userId, like);

    updatedSauce
      .save()
      .then((newSauce) => {
        if (newSauce !== updatedSauce)
          throw new Error(
            "Problème à la sauvegarde de la modification des likes"
          );
        res
          .status(200)
          .json({ message: `Sauce ${newSauce.name} : likes modifiés` });
      })
      .catch((e) => res.status(400).json({ error: e }));
  });
};
