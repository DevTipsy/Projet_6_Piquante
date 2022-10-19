const express = require('express');
const router = express.Router();
//On déclare le chemin du controller "user"
const userCtrl = require('../controllers/user');

//On définit le chemin pour la conexion et l'inscription
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;