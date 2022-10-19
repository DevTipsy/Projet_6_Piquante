// On définit le chemin des sauces
const Sauce = require('../models/Sauce');
// On utilise le module nodejs pour créer et gérer des fichiers dans un programme node
const fs = require('fs');

/*****************************/
//Fonction création de sauces//
/*****************************/
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: []
  });

  sauce.save()
  .then(() => {res.status(201).json({message: 'Sauce ajoutée!'});
  })
  .catch((error) => {res.status(400).json({error: error});
  });
};

/********************************************/
//Fonction récupération de toutes les sauces//
/********************************************/
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {res.status(200).json(sauces);
    })
    .catch((error) => {res.status(400).json({error: error});
    });
};

/***********************************/
//Fonction récupération d'une sauce//
/***********************************/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {res.status(200).json(sauce);
    })
    .catch((error) => {res.status(404).json({error: error});
    });
};

/************************************/
//Fonction modification d'une sauce*//
/************************************/
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
} : {...req.body };
Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: "Sauce modifiée" }))
    .catch(error => res.status(400).json({ error }))
};

/**********************************/
//Fonction suppression d'une sauce//
/**********************************/
exports.deleteSauce = (req, res, next) => {
  const userId = req.body.userId;
  Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        // Comparaison des id
        if (userId !== process.userId)  {
          return res.status(403).json({message : 'Non autorisé'});
        } else{
          const filename = sauce.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
              Sauce.deleteOne({_id: req.params.id})
                  .then(res.status(200).json({message: 'Objet supprimé !'}))
                  .catch(error => res.status(400).json({error}));
          })
      }
    })
      .catch(error => res.status(500).json({error}))
};  

/**********************************/
//Fonction like/dislike des sauces//
/**********************************/
exports.Liked = (req, res, next) => {
  switch (req.body.like) {
    // Dans le cas d'un like
      case 1:
          Sauce.updateOne({ _id: req.params.id }, {
              $push: { usersLiked: req.body.userId },
              $inc: { likes: 1 }
          })
              .then(() => res.status(200).json({ message: 'Objet modifié !' }))
              .catch(error => res.status(400).json({ error }))
          break
    // Dans le cas d'un dislike
      case -1:
          Sauce.updateOne({ _id: req.params.id }, {
              $push: { usersDisliked: req.body.userId },
              $inc: { dislikes: 1 }
          })
              .then(() => res.status(200).json({ message: 'Objet modifié !' }))
              .catch(error => res.status(400).json({ error }))
          break
    // Dans le cas où l'utilisateur re-clique sur like alors qu'il l'a déjà like
      case 0:
          Sauce.findOne({ _id: req.params.id })
              .then((sauce) => {
                  if (sauce.usersLiked.includes(req.body.userId)) {
                      Sauce.updateOne({ _id: req.params.id }, {
                          $pull: { usersLiked: req.body.userId },
                          $inc: { likes: -1 }
                      })
                          .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                          .catch(error => res.status(400).json({ error }))
                // Dans le cas où l'utilisateur re-clique sur dislike alors qu'il l'a déjà dislike
                  } else if (sauce.usersDisliked.includes(req.body.userId)) {
                      Sauce.updateOne({ _id: req.params.id }, {
                          $pull: { usersDisliked: req.body.userId },
                          $inc: { dislikes: -1 }
                      })
                          .then(() => res.status(200).json({ message: 'Objet modifié !' }))
                          .catch(error => res.status(400).json({ error }))
                // Sinon rien ne se passe=erreur
                  } else {
                      res.status(400).json({ message: 'erreur' })
                  }
              })
          break
      default:
          res.status(400).json({ message: 'erreur !' })
  }
};