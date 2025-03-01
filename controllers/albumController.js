const Album = require("../models/album");
const Artiste = require("../models/artiste");
const Groupe = require("../models/groupe");

class AlbumController {
  /**
   * Créer un album et synchroniser avec les artistes et groupes
   */
  static async createAlbum(req, res) {
    const { titre, anneeDeSortie, linkyoutube, spotify, groupes, artistes, chansons, text } = req.body;

    let photo = '';
    if (req.files && req.files.photo) {
        photo = req.files.photo[0].path.replace(/\\/g, "/").replace("uploads/", "/uploads/");
    }

    try {
      // Création de l'album
      const album = new Album({
        titre,
        anneeDeSortie,
        linkyoutube,
        spotify,
        groupes: groupes || [], // Ajout des groupes
        artistes: artistes || [], // Ajout des artistes
        chansons: chansons || [],
        photo,
        text,
      });

      await album.save();

      // Synchronisation avec les artistes
      if (artistes && artistes.length > 0) {
        await Artiste.updateMany(
          { _id: { $in: artistes } }, 
          { $push: { albums: album._id } }
        );
      }

      // Synchronisation avec les groupes
      if (groupes && groupes.length > 0) {
        await Groupe.updateMany(
          { _id: { $in: groupes } }, 
          { $push: { albums: album._id } }
        );
      }
       if (groupes && groupes.length > 0) {
        await Groupe.updateMany(
          { _id: { $in: groupes } }, 
          { $push: { albums: album._id } }
        );
      }

      res.status(201).json(album);
    } catch (err) {
      console.error("Erreur lors de la création de l'album :", err.message);
      res.status(500).json({ message: "Erreur lors de la création de l'album." });
    }
  }

  /**
   * Mettre à jour un album et synchroniser avec les artistes et groupes
   */
  static async updateAlbum(req, res) {
    const { titre, anneeDeSortie, linkyoutube, spotify, groupes, artistes, chansons, text } = req.body;

    let updatedData = {
      titre,
      anneeDeSortie,
      linkyoutube,
      spotify,
      groupes: groupes || [], // Ajout des groupes
      artistes: artistes || [], // Ajout des artistes
      chansons: chansons || [],
      text,
    };

    // Gestion de la photo
    if (req.files && req.files.photo) {
      updatedData.photo = req.files.photo[0].path.replace(/\\/g, "/").replace("uploads/", "/uploads/");
    }

    try {
      // Trouver l'album avant la mise à jour
      const oldAlbum = await Album.findById(req.params.id);

      if (!oldAlbum) {
        return res.status(404).json({ message: "Album non trouvé." });
      }

      // Retirer l'album des anciens artistes
      if (oldAlbum.artistes.length > 0) {
        await Artiste.updateMany(
          { _id: { $in: oldAlbum.artistes } },
          { $pull: { albums: oldAlbum._id } }
        );
      }

      // Retirer l'album des anciens groupes
      if (oldAlbum.groupes.length > 0) {
        await Groupe.updateMany(
          { _id: { $in: oldAlbum.groupes } },
          { $pull: { albums: oldAlbum._id } }
        );
      }

      // Mettre à jour l'album
      const album = await Album.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true,
      });

      // Ajouter l'album aux nouveaux artistes
      if (artistes && artistes.length > 0) {
        await Artiste.updateMany(
          { _id: { $in: artistes } },
          { $push: { albums: album._id } }
        );
      }

      // Ajouter l'album aux nouveaux groupes
      if (groupes && groupes.length > 0) {
        await Groupe.updateMany(
          { _id: { $in: groupes } },
          { $push: { albums: album._id } }
        );
      }

      res.status(200).json(album);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de l'album :", err.message);
      res.status(500).json({ message: "Erreur lors de la mise à jour de l'album." });
    }
  }

  /**
   * Supprimer un album et synchroniser avec les artistes et groupes
   */
  static async deleteAlbum(req, res) {
    try {
      const album = await Album.findByIdAndDelete(req.params.id);

      if (!album) {
        return res.status(404).json({ message: "Album non trouvé." });
      }

      // Supprimer l'album des artistes associés
      if (album.artistes && album.artistes.length > 0) {
        await Artiste.updateMany(
          { _id: { $in: album.artistes } },
          { $pull: { albums: album._id } }
        );
      }

      // Supprimer l'album des groupes associés
      if (album.groupes && album.groupes.length > 0) {
        await Groupe.updateMany(
          { _id: { $in: album.groupes } },
          { $pull: { albums: album._id } }
        );
      }

      res.status(200).json({ message: "Album supprimé avec succès." });
    } catch (err) {
      console.error("Erreur lors de la suppression de l'album :", err.message);
      res.status(500).json({ message: "Erreur lors de la suppression de l'album." });
    }
  }

  /**
   * Récupérer tous les albums avec artistes et groupes
   */
  static async getAllAlbums(req, res) {
    try {
      const albums = await Album.find()
        .populate("groupes") // Inclure les groupes
        .populate("artistes") // Inclure les artistes
        .populate({
          path: "chansons",
          populate: { path: "artistes" } // Peupler les artistes de chaque chanson
        });

      res.status(200).json(albums);
    } catch (err) {
      console.error("Erreur lors de la récupération des albums :", err.message);
      res.status(500).json({ message: "Erreur lors de la récupération des albums." });
    }
  }
}

module.exports = AlbumController;
