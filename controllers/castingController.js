const fs = require("fs");
const path = require("path");
const Casting = require("../models/Casting");

class CastingController {
  /**
   * 📌 Récupérer tous les castings
   */
  static async getAllCastings(req, res) {
    try {
      const castings = await Casting.find();
      res.status(200).json(castings);
    } catch (err) {
      console.error("Erreur lors de la récupération des castings :", err.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * 📌 Récupérer un casting par ID
   */
  static async getCastingById(req, res) {
    try {
      const casting = await Casting.findById(req.params.id);
      if (!casting) {
        return res.status(404).json({ message: "Casting non trouvé" });
      }
      res.status(200).json(casting);
    } catch (err) {
      console.error("Erreur lors de la récupération du casting :", err.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * 📌 Créer un casting
   */
  static async createCasting(req, res) {
    const { fullName, email, phone, address, social, age, parentName, parentContact,profile ,isSelected,text} = req.body;

    let videoPath = "";
    if (req.file) {
      videoPath = `${req.protocol}://${req.get("host")}/uploads/videos/${req.file.filename}`;
    }

    try {
      const casting = new Casting({
        fullName,
        email,
        phone,
        address,
        social,
        age,
        parentName: parentName || null,
        parentContact: parentContact || null,
        profile,
        video: videoPath,  // 🔹 Stockage de l'URL publique
        isSelected,
        text,
      });

      await casting.save();
      res.status(201).json({ message: "Candidature enregistrée avec succès", casting });
    } catch (err) {
      console.error("Erreur lors de la création du casting :", err.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * 📌 Mettre à jour un casting
   */
  static async updateCasting(req, res) {
    const { fullName, email, phone, address, social, age, parentName, parentContact,profile ,isSelected,text} = req.body;

    let updatedData = { fullName, email, phone, address, social, age, parentName, parentContact,profile ,isSelected,};

    try {
      const casting = await Casting.findById(req.params.id);
      if (!casting) {
        return res.status(404).json({ message: "Casting non trouvé" });
      }

      // Supprimer l'ancienne vidéo si une nouvelle est uploadée
      if (req.file) {
        if (casting.video) {
          const oldVideoPath = path.join(__dirname, "..", "uploads/videos", path.basename(casting.video));
          if (fs.existsSync(oldVideoPath)) {
            fs.unlinkSync(oldVideoPath);
          }
        }
        updatedData.video = `${req.protocol}://${req.get("host")}/uploads/videos/${req.file.filename}`;
      }

      const updatedCasting = await Casting.findByIdAndUpdate(req.params.id, updatedData, {
        new: true,
        runValidators: true,
      });

      res.status(200).json({ message: "Casting mis à jour avec succès", updatedCasting });
    } catch (err) {
      console.error("Erreur lors de la mise à jour du casting :", err.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }

  /**
   * 📌 Supprimer un casting
   */
  static async deleteCasting(req, res) {
    try {
      const casting = await Casting.findById(req.params.id);
      if (!casting) {
        return res.status(404).json({ message: "Casting non trouvé" });
      }

      // Supprimer la vidéo associée
      if (casting.video) {
        const videoPath = path.join(__dirname, "..", "uploads/videos", path.basename(casting.video));
        if (fs.existsSync(videoPath)) {
          fs.unlinkSync(videoPath);
        }
      }

      await Casting.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Casting supprimé avec succès" });
    } catch (err) {
      console.error("Erreur lors de la suppression du casting :", err.message);
      res.status(500).json({ message: "Erreur serveur" });
    }
  }
}

module.exports = CastingController;
