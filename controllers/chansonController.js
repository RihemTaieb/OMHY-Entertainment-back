const path = require("path");
const Chanson = require("../models/chanson");
const Artiste = require("../models/artiste");
const Album = require("../models/album");
const Groupe= require("../models/groupe");
const chanson = require("../models/chanson");

/**
 * Contrôleur pour gérer les chansons
 */
class ChansonController {
  /**
   * Récupérer toutes les chansons avec artistes et albums associés
   */
  static async getAllChansons(req, res) {
    try {
      const chansons = await Chanson.find()
        .populate("artistes", "nom prenom") // Inclure les noms et prénoms des artistes
        .populate("album", "nom anneeDeSortie") // Inclure le nom et l'année de l'album
        .populate("groupes");
      res.status(200).json(chansons);
    } catch (err) {
      console.error("Erreur lors de la récupération des chansons :", err.message);
      res.status(500).json({ message: "Erreur lors de la récupération des chansons." });
    }
  }

  /**
   * Récupérer une chanson par ID avec artistes et album associés
   */
  static async getChansonById(req, res) {
    try {
      const chanson = await Chanson.findById(req.params.id)
        .populate("artistes") // Inclure les artistes
        .populate("album") // Inclure l'album
        .populate("groupes");

      if (!chanson) {
        return res.status(404).json({ message: "Chanson non trouvée." });
      }

      res.status(200).json(chanson);
    } catch (err) {
      console.error("Erreur lors de la récupération de la chanson :", err.message);
      res.status(500).json({ message: "Erreur lors de la récupération de la chanson." });
    }
  }

  /**
   * Créer une chanson
   */
  static async createChanson(req, res) {
    const { nom, type,linkyoutube, anneeDeCreation, artistesIds, albumId, spotify, groupes } = req.body;
  
    let photo = "";
  
    // Vérifier si un fichier a été uploadé
    if (req.files && req.files.photo) {
      photo = req.files.photo[0].path.replace(/\\/g, "/").replace("uploads/", "/uploads/");
    }
  
    try {
      // Gestion des artistesIds optionnels
      let artistesArray = [];
      if (artistesIds) {
        artistesArray = Array.isArray(artistesIds) ? artistesIds : [artistesIds];
  
        const validArtistes = await Artiste.find({ _id: { $in: artistesArray } });
        if (validArtistes.length !== artistesArray.length) {
          return res.status(400).json({ message: "Un ou plusieurs artistes sont introuvables." });
        }
      }
  
      // Gestion des groupes optionnels
      let groupesArray = [];
      if (groupes) {
        groupesArray = Array.isArray(groupes) ? groupes : [groupes];
  
        const validGroupes = await Groupe.find({ _id: { $in: groupesArray } });
        if (validGroupes.length !== groupesArray.length) {
          return res.status(400).json({ message: "Un ou plusieurs groupes sont introuvables." });
        }
      }
  
      // Vérification de l'album optionnel
      if (albumId) {
        const albumExists = await Album.findById(albumId);
        if (!albumExists) {
          return res.status(400).json({ message: "L'album spécifié est introuvable." });
        }
      }
  
      // Création de la chanson
      const chanson = new Chanson({
        nom,
        type,
        linkyoutube,
        anneeDeCreation,
        artistes: artistesArray, // Tableau vide si aucun artiste
        groupes: groupesArray, // Tableau vide si aucun groupe
        album: albumId || null, // Null si aucun album
        spotify,
        photo, // Chemin de la photo (peut être vide)
      });
  
      // Sauvegarde de la chanson
      await chanson.save();
  
      // Mise à jour des artistes associés (seulement si artistesArray contient des données)
      if (artistesArray.length > 0) {
        await Artiste.updateMany(
          { _id: { $in: artistesArray } },
          { $push: { chansons: chanson._id } }
        );
      }
  
      // Mise à jour des groupes associés (seulement si groupesArray contient des données)
      if (groupesArray.length > 0) {
        await Groupe.updateMany(
          { _id: { $in: groupesArray } },
          { $push: { chansons: chanson._id } }
        );
      }
  
      res.status(201).json(chanson);
    } catch (err) {
      console.error("Erreur lors de la création de la chanson :", err.message);
      res.status(500).json({ message: "Erreur lors de la création de la chanson." });
    }
  }
  
  

  /**
   * Mettre à jour une chanson
   */
  static async updateChanson(req, res) {
    const { nom, type,linkyoutube, anneeDeCreation, artistesIds, albumId, spotify, groupes } = req.body;
  
    // Préparer les données pour la mise à jour
    let updatedData = {
      nom,
      type,
      linkyoutube,
      anneeDeCreation,
      artistes: artistesIds || [], // Si artistesIds est undefined ou null, remplacez-le par []
      groupes: groupes || [], // Si groupes est undefined ou null, remplacez-le par []
      album: albumId || null,
      spotify,
    };
  
    // Gestion de la photo (si uploadée)
    if (req.files && req.files.photo) {
      updatedData.photo = req.files.photo[0].path.replace(/\\/g, "/").replace("uploads/", "/uploads/");
    }
  
    try {
      // Récupérer l'ancienne chanson pour gérer les relations
      const ancienneChanson = await Chanson.findById(req.params.id);
  
      if (!ancienneChanson) {
        return res.status(404).json({ message: "Chanson non trouvée." });
      }
  
      // Supprimer l'ID de la chanson des anciens artistes
      if (ancienneChanson.artistes && ancienneChanson.artistes.length > 0) {
        await Artiste.updateMany(
          { _id: { $in: ancienneChanson.artistes } },
          { $pull: { chansons: ancienneChanson._id } }
        );
      }
  
      // Supprimer l'ID de la chanson des anciens groupes
      if (ancienneChanson.groupes && ancienneChanson.groupes.length > 0) {
        await Groupe.updateMany(
          { _id: { $in: ancienneChanson.groupes } },
          { $pull: { chansons: ancienneChanson._id } }
        );
      }
  
      // Mettre à jour la chanson
      const chansonMiseAJour = await Chanson.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true,
      });
  
      if (!chansonMiseAJour) {
        return res.status(404).json({ message: "Chanson non trouvée après mise à jour." });
      }
  
      // Ajouter l'ID de la chanson aux nouveaux artistes (si des artistes sont sélectionnés)
      if (artistesIds && artistesIds.length > 0) {
        await Artiste.updateMany(
          { _id: { $in: artistesIds } },
          { $push: { chansons: chansonMiseAJour._id } }
        );
      }
  
      // Ajouter l'ID de la chanson aux nouveaux groupes (si des groupes sont sélectionnés)
      if (groupes && groupes.length > 0) {
        await Groupe.updateMany(
          { _id: { $in: groupes } },
          { $push: { chansons: chansonMiseAJour._id } }
        );
      }
  
      res.status(200).json(chansonMiseAJour);
    } catch (err) {
      console.error("Erreur lors de la mise à jour de la chanson :", err.message);
      res.status(500).json({ message: "Erreur lors de la mise à jour de la chanson." });
    }
  }
  

  /**
   * Supprimer une chanson
   */
  static async deleteChanson(req, res) {
    try {
          const chanson = await Chanson.findByIdAndDelete(req.params.id);
    
          if (!chanson) {
            return res.status(404).json({ message: "Chanson non trouvée." });
          }
    
          // Supprimer l'ID de la chanson des artistes associés
          await Artiste.updateMany(
            { _id: { $in: chanson.artistes } },
            { $pull: { chansons: chanson._id } }
          );
          await Groupe.updateMany(
            { _id: { $in: chanson.groupes } },
            { $pull: { chansons: chanson._id } }
          );
    
          // Supprimer la chanson de l'album associé
          if (chanson.album) {
            await Album.findByIdAndUpdate(chanson.album, { $pull: { chansons: chanson._id } });
          }
    
          res.status(200).json({ message: "Chanson supprimée avec succès." });
        } catch (err) {
          console.error("Erreur lors de la suppression de la chanson :", err.message);
          res.status(500).json({ message: "Erreur lors de la suppression de la chanson." });
        }
      }
}

module.exports = ChansonController;
