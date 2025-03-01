const mongoose = require('mongoose');

const albumSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true,
  },
  text: {
    type: String,
    required: false,
    trim: true,
  },
    anneeDeSortie: {
    type: Number,
    required: false,
  },
  linkyoutube: {
    type: String,
    required: false,
    trim: true,
  },
  spotify: {
    type: String,
    required: false,
    trim: true,
    
  },
  groupes:[ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groupe', // Assurez-vous que le modèle Groupe existe
    required: false,
  }],
  artistes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artiste', // Assurez-vous que le modèle Artiste existe
    required: false,
  }],
  chansons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chanson',
    required: false,
    // Assurez-vous que le modèle Chanson existe
  }],
  photo: [{ // Champ pour stocker l'image de l'album
    type: String,
    default: '',

  }],
}, {
  timestamps: true,
  toJSON: { virtuals: false },
  toObject: { virtuals: false },
});

module.exports = mongoose.model('Album', albumSchema);
