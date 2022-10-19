/***************************************/
//Fonction vérification des identifiants/
/***************************************/
// On déclare le module pour le token du mdp
const jwt = require('jsonwebtoken');
 // On appelle le module
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
       const userId = decodedToken.userId;
       // Si l'id ne correspond pas on affiche un message d'erreur
       if (req.body.userId && req.body.userId !== userId) {
        throw 'ID non autorisé';
        // Sinon on continu le déroulé du code avec "next"
      } else {
        next();
      }
   } catch(error) {
       res.status(401).json({ error });
   }
};