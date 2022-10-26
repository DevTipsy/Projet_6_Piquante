// On déclare la constante bcrypt User et jwt pour la sécurisation
const bcrypt = require ('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require("validator");

/***********************************************************/
//Fonction création d'utilisateur avec hash du mot de passe//
/***********************************************************/
exports.signup = (req, res, next) => {
    if (!validator.isEmail(req.body.email))
    return res
      .status(403)
      .json({ message: "Le format du mail est incorrect." });
  // Validator pour vérifier le format du mdp attendu
  if (validator.isStrongPassword(req.body.password)) {
    // Cryptage du mdp en une chaine de caractère
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        // Sauvegarde de l'utilisateur
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
    } else
    return res.status(403).json({
      message:
        "Votre mot de passe doit contenir 8 caractères minimum. Une lettre majuscule. Une lettre minuscule. Un chiffre. Un caractère spécial.",
    });
};

/************************************************/
//Fonction connexion au compte créé précédemment//
/************************************************/
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        // Vérification que l'utilisateur existe
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparaison des mdp avant la connexion
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };