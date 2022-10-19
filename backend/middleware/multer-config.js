const multer = require('multer');

// On définit les formats de fichiers acceptés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};
// On définit l'emplacement de stockage des fichiers uploadés
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // Le nom du fichier est converti en une chaine de caractère avec son extension image
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});
// On exporte l'image dans le stockage
module.exports = multer({storage: storage}).single('image');