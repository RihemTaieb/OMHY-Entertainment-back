const Test = require("../models/test"); // Modèle Test
const Artiste = require("../models/artiste"); // Modèle Artiste
const multer = require("multer");
const path = require("path");

// Configuration Multer pour gérer les uploads de fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads/")); // Répertoire des fichiers uploadés
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Générer un nom unique pour chaque fichier
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Types de fichiers autorisés
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Seuls les fichiers image sont autorisés"), false);
  },
});

class TestController {
  /**
   * Récupérer tous les tests avec leurs artistes associés
   */
  static async getAllTests(req, res) {
    try {
      const tests = await Test.find().populate("artistes"); // Peupler les artistes associés
      res.status(200).json(tests); // Retourner la liste des tests
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  /**
   * Créer un test avec des images et des artistes associés
   */
  static async createTest(req, res) {
    const { artistes } = req.body; // Récupérer les artistes associés
    const photos = [];

    // Ajouter les chemins des photos uploadées
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        photos.push(file.path.replace(/\\/g, "/").replace("uploads/", "/uploads/"));
      });
    }

    try {
      // Vérifier que les artistes existent
      if (artistes && artistes.length > 0) {
        const validArtistes = await Artiste.find({ _id: { $in: artistes } });
        if (validArtistes.length !== artistes.length) {
          return res.status(404).json({ message: "Un ou plusieurs artistes sont introuvables" });
        }
      }

      // Créer un nouveau test
      const test = new Test({
        photo: photos, // Ajout des photos uploadées
        artistes, // Liste des IDs des artistes
      });

      // Sauvegarder le test
      await test.save();

      // Peupler les artistes pour la réponse
      const testAvecArtistes = await Test.findById(test._id).populate("artistes");

      res.status(201).json(testAvecArtistes); // Retourner le test créé
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  /**
   * Récupérer un test par ID
   */
  static async getTestById(req, res) {
    try {
      const test = await Test.findById(req.params.id).populate("artistes"); // Inclure les artistes dans la réponse
      if (!test) {
        return res.status(404).json({ message: "Test non trouvé" });
      }
      res.status(200).json(test);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  /**
   * Mettre à jour un test
   */
  static async updateTest(req, res) {
    const { artistes } = req.body; // Nouveaux artistes associés
    let photos = req.body.photo || []; // Chemins des photos existantes

    // Ajouter les nouvelles photos uploadées
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        photos.push(file.path.replace(/\\/g, "/").replace("uploads/", "/uploads/"));
      });
    }

    try {
      // Vérifier que les artistes existent
      if (artistes && artistes.length > 0) {
        const validArtistes = await Artiste.find({ _id: { $in: artistes } });
        if (validArtistes.length !== artistes.length) {
          return res.status(404).json({ message: "Un ou plusieurs artistes sont introuvables" });
        }
      }

      // Mettre à jour le test
      const test = await Test.findByIdAndUpdate(
        req.params.id,
        { photo: photos, artistes },
        { new: true, runValidators: true } // Renvoie l'objet mis à jour
      ).populate("artistes"); // Inclure les artistes mis à jour

      if (!test) {
        return res.status(404).json({ message: "Test non trouvé" });
      }

      res.status(200).json(test);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  /**
   * Supprimer un test par ID
   */
  static async deleteTest(req, res) {
    try {
      const test = await Test.findByIdAndDelete(req.params.id);
      if (!test) {
        return res.status(404).json({ message: "Test non trouvé" });
      }
      res.status(200).json({ message: "Test supprimé avec succès" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = {
  TestController,
  upload, // Exporter le middleware d'upload pour l'utiliser dans les routes
};
