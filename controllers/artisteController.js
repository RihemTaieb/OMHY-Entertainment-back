const Artiste = require('../models/artiste');
const multer = require('multer');
const path = require('path');

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/'); // Directory to store uploaded images
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Store the file with a unique name
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'), false);
  }
});

class ArtisteController {
  // Create an artiste with image and cover photo upload
  static async createArtiste(req, res) {
    const { nom, prenom, age, profile,instag,Facebook,lienvideo, dateAnniversaire, dateDeJoindre,decriptionsousimage,bol } = req.body;
    let photo = '';
    let photoCouverture = '';

    // Extract uploaded files
    if (req.files) {
      if (req.files.photo) {
        photo = req.files.photo[0].path.replace("\\", "/").replace('uploads\\', '/uploads/');
      }
      if (req.files.photoCouverture) {
        photoCouverture = req.files.photoCouverture[0].path.replace("\\", "/").replace('uploads\\', '/uploads/');
      }
    }

    try {
      const artiste = new Artiste({
        nom,
        prenom,
        age,
        profile,
        instag,Facebook,lienvideo,
        dateAnniversaire,
        dateDeJoindre,
        decriptionsousimage,
        bol,
        photo,
        photoCouverture,
      });
      await artiste.save();
      res.status(201).json(artiste);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Get all artistes
  static async getAllArtistes(req, res) {
    try {
      const artistes = await Artiste.find();
      res.status(200).json(artistes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  static async getArtisteWithAlbumsAndChansons(req, res) {
    try {
      const artiste = await Artiste.findById(req.params.id)
        .populate({
          path: "albums", // Charger les albums
          populate: {
            path: "chansons", // Charger les chansons des albums
            select: "nom type anneeDeCreation photo", // Sélectionner les champs spécifiques
          },
        })
        .populate({
          path: "chansons", // Charger les albums
          
        });
  
      if (!artiste) {
        return res.status(404).json({ message: "Artiste non trouvé" });
      }
  
      res.status(200).json(artiste);
    } catch (err) {
      console.error("Erreur lors de la récupération de l'artiste :", err.message);
      res.status(500).json({ message: err.message });
    }
  }
  

  // Get an artiste by ID
  static async getArtisteById(req, res) {
    try {
      const artiste = await Artiste.findById(req.params.id)
      .populate("chansons") // Charger les informations des chansons associées
      .populate("albums");  // Charger les informations des albums associés
          if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
      res.status(200).json(artiste);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Get an artiste with their chansons
  static async getArtisteWithChansons(req, res) {
    try {
      const artiste = await Artiste.findById(req.params.id).populate('chansons');
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
      res.status(200).json(artiste);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Update an artiste, including the image and cover photo
  static async updateArtiste(req, res) {
    const { nom, prenom, age, profile,instag,Facebook,lienvideo, dateAnniversaire, dateDeJoindre ,decriptionsousimage,bol} = req.body;
    let photo = req.body.photo;
    let photoCouverture = req.body.photoCouverture;

    // Update uploaded files
    if (req.files) {
      if (req.files.photo) {
        photo = req.files.photo[0].path.replace("\\", "/").replace('uploads\\', '/uploads/');
      }
      if (req.files.photoCouverture) {
        photoCouverture = req.files.photoCouverture[0].path.replace("\\", "/").replace('uploads\\', '/uploads/');
      }
    }

    try {
      const artiste = await Artiste.findByIdAndUpdate(
        req.params.id,
        { nom, prenom, age, profile,instag,Facebook,lienvideo, dateAnniversaire, dateDeJoindre,decriptionsousimage, photo, photoCouverture,bol },
        { new: true }
      );
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
      res.status(200).json(artiste);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Delete an artiste
  static async deleteArtiste(req, res) {
    try {
      const artiste = await Artiste.findByIdAndDelete(req.params.id);
      if (!artiste) {
        return res.status(404).json({ message: 'Artiste non trouvé' });
      }
      res.status(200).json({ message: 'Artiste supprimé' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ArtisteController;