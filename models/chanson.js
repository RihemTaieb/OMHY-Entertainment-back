const mongoose = require('mongoose');


const chansonSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
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
  anneeDeCreation: {
    type: Date,
    required: false,
  },
  groupes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Groupe', 
    required: false,

  }],
  artistes: [{
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Artiste', 
     required: false,

   }],
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album', // Album is optional
    required: false,

  },
  photo: [{ // New field to store image URL or file path
        type: String,
        default: '', // Default is an empty string, but you can change this based on your requirements
      }]
}, {
    timestamps: true,
    toJSON: { virtuals: false }, // Prevents `id` from being added
    toObject: { virtuals: false } // For plain objects as well
  });


// Export the model
module.exports = mongoose.model('Chanson', chansonSchema);
