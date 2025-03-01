const mongoose = require("mongoose");

const backgroundImageSchema = new mongoose.Schema(
  {
    images: [
      {
        type: String, // URL ou chemin des images
        required: true, // Obligatoire pour chaque image
      },
    ],
    description: {
      type: String, // Description globale de cet ensemble d'images
      required: false,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId, // Référence vers un utilisateur ou un administrateur qui a créé ce slider
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BackgroundImage", backgroundImageSchema);
