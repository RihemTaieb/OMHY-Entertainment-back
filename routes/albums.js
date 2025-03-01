const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = require('../utils/multer'); // Make sure this file exists and is properly set up
const path = require("path");
const AlbumController = require("../controllers/albumController");

router.post("/", upload.fields([{ name: "photo", maxCount: 1 }]), AlbumController.createAlbum);

// Route pour mettre à jour un album
router.put("/:id", upload.fields([{ name: "photo", maxCount: 1 }]), AlbumController.updateAlbum);


// Supprimer un album
router.delete("/:id", AlbumController.deleteAlbum);

// Récupérer tous les albums
router.get("/", AlbumController.getAllAlbums);

// Récupérer un album par ID
router.get("/:id", AlbumController.getAllAlbums);

module.exports = router;
