const express = require("express");
const ChansonController = require("../controllers/chansonController");
const multer = require('multer');
const upload = require('../utils/multer'); 
const router = express.Router();

// Récupérer toutes les chansons
router.get("/", ChansonController.getAllChansons);

// Récupérer une chanson par ID
router.get("/:id", ChansonController.getChansonById);

// Créer une chanson avec upload de photo
router.post(
  "/",
  upload.fields([{ name: "photo", maxCount: 1 }]), // Gestion des fichiers photo
  ChansonController.createChanson
);

// Mettre à jour une chanson avec upload de photo
router.put(
  "/:id",
  upload.fields([{ name: "photo", maxCount: 1 }]), // Gestion des fichiers photo
  ChansonController.updateChanson
);

// Supprimer une chanson
router.delete("/:id", ChansonController.deleteChanson);

module.exports = router;
