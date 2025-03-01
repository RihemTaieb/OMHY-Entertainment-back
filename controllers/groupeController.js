const Groupe = require('../models/groupe'); // Modèle Groupe
const Artiste = require('../models/artiste'); // Modèle Artiste
const Album = require('../models/album'); // Modèle Album
const Chanson = require('../models/chanson'); // Modèle Chanson

class GroupeController {
  /**
   * Obtenir tous les groupes
   */
  static async getAllGroupe(req, res) {
    try {
      const groupes = await Groupe.find()
        .populate('artistes') // Inclure les artistes associés
        .populate('albums') // Inclure les albums associés
        .populate('chansons'); // Inclure les chansons associées

      res.status(200).json(groupes); // Retourner les groupes
    } catch (err) {
      console.error("Erreur lors de la récupération des groupes :", err.message);
      res.status(500).json({ message: "Erreur lors de la récupération des groupes." });
    }
  }

  /**
   * Créer un nouveau groupe
   */
  static async createGroupe(req, res) {
    const {
      name,
      profile,
      instag,
      Facebook,
      lienvideo,
      dateAnniversaire,
      dateDeJoindre,
      decriptionsousimage,
      bol,
      artistes, // IDs des artistes associés
      albums, // IDs des albums associés
      chansons, // IDs des chansons associées
    } = req.body;

    let photo = '';
    let photoCouverture = '';

    // Gérer les fichiers uploadés
    if (req.files) {
      if (req.files.photo) {
        photo = req.files.photo[0].path.replace(/\\/g, "/").replace("uploads/", "/uploads/");
      }
      if (req.files.photoCouverture) {
        photoCouverture = req.files.photoCouverture[0].path.replace(/\\/g, "/").replace("uploads/", "/uploads/");
      }
    }

    try {
      // Vérification des artistes
      if (artistes && artistes.length > 0) {
        const validArtistes = await Artiste.find({ _id: { $in: artistes } });
        if (validArtistes.length !== artistes.length) {
          return res.status(400).json({ message: "Un ou plusieurs artistes sont introuvables." });
        }
      }

      // Vérification des albums
      if (albums && albums.length > 0) {
        const validAlbums = await Album.find({ _id: { $in: albums } });
        if (validAlbums.length !== albums.length) {
          return res.status(400).json({ message: "Un ou plusieurs albums sont introuvables." });
        }
      }

      // Vérification des chansons
      if (chansons && chansons.length > 0) {
        const validChansons = await Chanson.find({ _id: { $in: chansons } });
        if (validChansons.length !== chansons.length) {
          return res.status(400).json({ message: "Une ou plusieurs chansons sont introuvables." });
        }
      }

      // Création du groupe
      const groupe = new Groupe({
        name,
        profile,
        instag,
        Facebook,
        lienvideo,
        dateAnniversaire,
        dateDeJoindre,
        decriptionsousimage,
        bol,
        photo,
        photoCouverture,
        artistes: artistes || [],
        albums: albums || [],
        chansons: chansons || [],
      });

      await groupe.save();
      res.status(201).json(groupe);
    } catch (err) {
      console.error("Erreur lors de la création du groupe :", err.message);
      res.status(500).json({ message: "Erreur lors de la création du groupe." });
    }
  }

  /**
   * Obtenir un groupe par ID
   */
  static async getGroupeById(req, res) {
    try {
      const groupe = await Groupe.findById(req.params.id)
        .populate('artistes') // Inclure les artistes associés
        .populate('albums') // Inclure les albums associés
        .populate('chansons') // Inclure les chansons associées
        .populate({
            path: "albums",
            populate: { path: "chansons" } // Peupler les artistes de chaque chanson
          });
      if (!groupe) {
        return res.status(404).json({ message: "Groupe non trouvé." });
      }

      res.status(200).json(groupe);
    } catch (err) {
      console.error("Erreur lors de la récupération du groupe :", err.message);
      res.status(500).json({ message: "Erreur lors de la récupération du groupe." });
    }
  }

  /**
   * Mettre à jour un groupe
   */
  static async updateGroupe(req, res) {
    const {
      name,
      profile,
      instag,
      Facebook,
      lienvideo,
      dateAnniversaire,
      dateDeJoindre,
      decriptionsousimage,
      bol,
      artistes,
      albums,
      chansons,
    } = req.body;

    let updatedData = {
      name,
      profile,
      instag,
      Facebook,
      lienvideo,
      dateAnniversaire,
      dateDeJoindre,
      decriptionsousimage,
      bol,
      artistes,
      albums,
      chansons,
    };

    // Gérer les fichiers uploadés
    if (req.files) {
      if (req.files.photo) {
        updatedData.photo = req.files.photo[0].path.replace(/\\/g, "/").replace("uploads/", "/uploads/");
      }
      if (req.files.photoCouverture) {
        updatedData.photoCouverture = req.files.photoCouverture[0].path.replace(/\\/g, "/").replace("uploads/", "/uploads/");
      }
    }

    try {
      const groupe = await Groupe.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true,
      })
        .populate('artistes')
        .populate('albums')
        .populate('chansons');

      if (!groupe) {
        return res.status(404).json({ message: "Groupe non trouvé." });
      }

      res.status(200).json(groupe);
    } catch (err) {
      console.error("Erreur lors de la mise à jour du groupe :", err.message);
      res.status(500).json({ message: "Erreur lors de la mise à jour du groupe." });
    }
  }

  /**
   * Supprimer un groupe
   */
  static async deleteGroupe(req, res) {
    try {
      const groupe = await Groupe.findByIdAndDelete(req.params.id);

      if (!groupe) {
        return res.status(404).json({ message: "Groupe non trouvé." });
      }

      res.status(200).json({ message: "Groupe supprimé avec succès." });
    } catch (err) {
      console.error("Erreur lors de la suppression du groupe :", err.message);
      res.status(500).json({ message: "Erreur lors de la suppression du groupe." });
    }
  }
}

module.exports = GroupeController;
