/*****************************************/
//Connexion à la base de données Mongoose/
/*****************************************/
// On appelle les constantes express, mongoose, path et helmet
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require("helmet");

// On déclare les routes à utiliser
const saucesRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

// On utilise le lien de la base de données pour s'y connecter
mongoose.connect('mongodb+srv://tipsy:tipsy@piquante.gspaxsq.mongodb.net/test',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// On créé l'application express
const app = express();

//On définit les en-têtes http pour les fichiers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// On créé les middleware express et helmet
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// On créé les middleware des routes pour les sauces, l'utilisateur et l'image uploadé
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//On exporte l'app pour t accéder depuis le serveur node
module.exports = app;