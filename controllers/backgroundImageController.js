const BackgroundImage = require("../models/BackgroundImage");

class BackgroundImageController {
  /**
   * Créer un nouveau slider avec plusieurs images
   */
  static async createSlider(req, res) {
    const { description, createdBy } = req.body;

    // Récupérer les fichiers uploadés
    const images = req.files.map((file) =>
      file.path.replace(/\\/g, "/").replace("uploads/", "/uploads/")
    );

    try {
      const slider = new BackgroundImage({
        images,
        description,
        createdBy,
      });

      await slider.save();
      res.status(201).json(slider);
    } catch (err) {
      console.error("Erreur lors de la création du slider :", err.message);
      res.status(500).json({ message: "Erreur lors de la création du slider." });
    }
  }

  /**
   * Récupérer tous les sliders
   */
  static async getAllSliders(req, res) {
    try {
      const sliders = await BackgroundImage.find();
      res.status(200).json(sliders);
    } catch (err) {
      console.error("Erreur lors de la récupération des sliders :", err.message);
      res.status(500).json({ message: "Erreur lors de la récupération des sliders." });
    }
  }

  /**
   * Ajouter des images à un slider existant
   */
  static async addImagesToSlider(req, res) {
    const { id } = req.params;

    // Récupérer les nouvelles images
    const newImages = req.files.map((file) =>
      file.path.replace(/\\/g, "/").replace("uploads/", "/uploads/")
    );

    try {
      const slider = await BackgroundImage.findByIdAndUpdate(
        id,
        { $push: { images: { $each: newImages } } },
        { new: true, runValidators: true }
      );

      if (!slider) return res.status(404).json({ message: "Slider non trouvé." });

      res.status(200).json(slider);
    } catch (err) {
      console.error("Erreur lors de l'ajout des images :", err.message);
      res.status(500).json({ message: "Erreur lors de l'ajout des images." });
    }
  }

  /**
   * Supprimer un slider entier
   */
  static async deleteSlider(req, res) {
    const { id } = req.params;

    try {
      const slider = await BackgroundImage.findByIdAndDelete(id);

      if (!slider) return res.status(404).json({ message: "Slider non trouvé." });

      res.status(200).json({ message: "Slider supprimé avec succès." });
    } catch (err) {
      console.error("Erreur lors de la suppression du slider :", err.message);
      res.status(500).json({ message: "Erreur lors de la suppression du slider." });
    }
  }

  /**
   * Supprimer une image spécifique d'un slider
   */
  static async deleteImageFromSlider(req, res) {
    const { id } = req.params;
    const { imageUrl } = req.body;

    try {
      const slider = await BackgroundImage.findByIdAndUpdate(
        id,
        { $pull: { images: imageUrl } },
        { new: true }
      );

      if (!slider) return res.status(404).json({ message: "Slider non trouvé." });

      res.status(200).json(slider);
    } catch (err) {
      console.error("Erreur lors de la suppression de l'image :", err.message);
      res.status(500).json({ message: "Erreur lors de la suppression de l'image." });
    }
  }
}

module.exports = BackgroundImageController;
