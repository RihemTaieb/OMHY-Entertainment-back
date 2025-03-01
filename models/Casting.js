const mongoose = require('mongoose');

const CastingSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true},
    phone: { type: String, required: true },
    address: { type: String, required: true },
     social: { type: String },
    age: { type: Number, required: true },
    parentName: { type: String },
    parentContact: { type: String },
    profile: { type: String,required: true  },
    video: { type: String }, // Chemin du fichier vidéo
    isSelected: { type: Boolean, default: false }, // Nouveau champ
    text: { type: String, default: false }, // Nouveau champ

}, { timestamps: true });

module.exports = mongoose.model('Casting', CastingSchema);
