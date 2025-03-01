const mongoose = require('mongoose');

const Casting1Schema = new mongoose.Schema({
    bol: { type: Boolean, default: true } ,// Ajout de la variable booléenne avec une valeur par défaut

}, { timestamps: true });

module.exports = mongoose.model('Casting1', Casting1Schema);
