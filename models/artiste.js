const mongoose = require('mongoose');

const artisteSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  prenom: {
    type: String,
    required: true,
    trim: true,
  },
  age: {
    type: Number,
    required: false,
    min: 0, // Âge minimal
  },
  profile: {
    type: String,
    required: true,
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
    required: true,
    trim: true,
  },
  dateAnniversaire: { 
    type: Date,
    required: true 
  }, // Birthday
  dateDeJoindre: { 
    type: Date, 
    required: true
  },  // Joining date
  decriptionsousimage: { 
    type: String,
    required: false,
  },
  bol: { type: Boolean, default: true } ,// Ajout de la variable booléenne avec une valeur par défaut

  chansons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chanson', // Référence au modèle Chanson
  }],
  albums: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album', // Relation : un artiste peut avoir plusieurs albums
  }],
  photo: [{ // Champ pour les photos
    type: String,
    default: '', // Défaut : chaîne vide
  }],
  photoCouverture: [{ // Nouveau champ pour la photo de couverture
    type: String,
    default: '', // Défaut : chaîne vide
  }],
  groupes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groupe', // Référence au modèle Groupe
  }],
}, {
  timestamps: true,
  toJSON: { virtuals: false }, // Empêche `id` d'être ajouté
  toObject: { virtuals: false } // Pour les objets "plats" également
});

module.exports = mongoose.model('Artiste', artisteSchema);
