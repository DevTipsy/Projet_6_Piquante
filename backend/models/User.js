const mongoose = require('mongoose');
// On utilise le plugin suivant pour ajouter une pré-validation pour des champs uniques à mongoose schema
const uniqueValidator = require('mongoose-unique-validator');

// On définit les champs qui doivent être uniques
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);