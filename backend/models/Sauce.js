// On créé l'app mongoose
const mongoose = require('mongoose');
// On définit les paramètres utilisés pour les produits
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true, },
  name: { type: String, required: true, },
  manufacturer: { type: String, required: true  },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: String, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true}
});

module.exports = mongoose.model('Sauce', sauceSchema);