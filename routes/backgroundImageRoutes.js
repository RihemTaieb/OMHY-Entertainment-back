const express = require("express");
const router = express.Router();
const multer = require("multer");
const BackgroundImageController = require("../controllers/backgroundImageController");

// Configuration de multer pour gérer les fichiers uploadés
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads"); // Dossier où enregistrer les fichiers
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Nom unique pour chaque fichier
  },
});
const upload = multer({ storage });

// Routes
router.post(
  "/",
  upload.array("images", 10), // Autoriser jusqu'à 10 images
  BackgroundImageController.createSlider
);

router.get("/", BackgroundImageController.getAllSliders);

router.put(
  "/:id",
  upload.array("images", 10), // Ajouter de nouvelles images
  BackgroundImageController.addImagesToSlider
);

router.delete("/:id", BackgroundImageController.deleteSlider);

router.delete("/:id/image", BackgroundImageController.deleteImageFromSlider);

module.exports = router;
