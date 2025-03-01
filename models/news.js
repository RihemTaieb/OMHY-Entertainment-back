const mongoose = require('mongoose');

const adminNewsSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  contenu: { type: String, required: true },
  date: { type: Date,required: false},
  image: { type: String }, // URL ou chemin de l'image
  lien: {
    type: String,
    required: false,
    trim: true,
  },
});

module.exports = mongoose.model('AdminNews', adminNewsSchema);