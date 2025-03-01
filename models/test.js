const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
    photo: [{ // Champ pour les photos
        type: String,
        default: '', // Défaut : chaîne vide
      }],
  artistes: [
    {
      type: mongoose.Schema.Types.ObjectId, // Relation avec le modèle Artiste
      ref: "Artiste", // Référence au modèle `Artiste`
    },
  ],
});

module.exports = mongoose.model("Test", TestSchema);
