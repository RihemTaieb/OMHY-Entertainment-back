const mongoose = require('mongoose');

const groupeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
profile: {
    type: String,
    required: false,
    trim: true,
  },
  instag: {
    type: String,
    required: false,
    trim: true,
  },
  Facebook: {
    type: String,
    required: false,
    trim: true,
  },
  lienvideo: {
    type: String,
    required: false,
    trim: true,
  },
 
  dateDeJoindre: { 
    type: Date, 
    required: false
  },  // Joining date
  decriptionsousimage: { 
    type: String,
    required: false,
  },
  bol: { type: Boolean, default: true } ,// Ajout de la variable booléenne avec une valeur par défaut

  artistes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste', 
    required: false,

  }],
  chansons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chanson', // Référence au modèle Chanson
    required: false,

  }],
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album', // Relation : un artiste peut avoir plusieurs albums
    required: false,

  }],
  photo: [{ // Champ pour les photos
    type: String,
    default: '', // Défaut : chaîne vide
  }],
  photoCouverture: [{ // Nouveau champ pour la photo de couverture
    type: String,
    default: '', // Défaut : chaîne vide
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: false }, // Empêche `id` d'être ajouté
  toObject: { virtuals: false } // Pour les objets "plats" également
});

module.exports = mongoose.model('Groupe', groupeSchema);
