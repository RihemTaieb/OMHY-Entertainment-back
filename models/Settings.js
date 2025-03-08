// models/Settings.js (Backend - Node.js avec Mongoose)
const mongoose = require('mongoose');

const SettingsSchema = new mongoose.Schema({
  isCastingActive: {
    type: Boolean,
    default: false, // Par défaut, le casting est désactivé
  },
  adminMessage: {
    type: String,
    default: "", // Par défaut, pas de message
  },
});

module.exports = mongoose.model('Settings', SettingsSchema);
