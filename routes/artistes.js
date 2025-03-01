const express = require('express');
const ArtisteController = require('../controllers/artisteController');
const router = express.Router();
const multer = require('multer');
const upload = require('../utils/multer'); // Make sure this file exists and is properly set up



// Route pour créer un artiste avec upload de photo et photo de couverture
router.post(
  '/',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'photoCouverture', maxCount: 1 },
  ]),
  ArtisteController.createArtiste
);

// Route pour mettre à jour un artiste avec upload de photo et photo de couverture
router.put(
  '/:id',
  upload.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'photoCouverture', maxCount: 1 },
  ]),
  ArtisteController.updateArtiste
);

// Route to create an artiste with image upload

// Route to get all artistes
router.get('/', ArtisteController.getAllArtistes);

// Route to get an artiste by ID
router.get('/:id', ArtisteController.getArtisteById);

// Route to get an artiste with their chansons
router.get('/:id/chansons', ArtisteController.getArtisteWithChansons);

// Route to update an artiste with image upload
router.get("/:id/details", ArtisteController.getArtisteWithAlbumsAndChansons);

// Route to delete an artiste
router.delete('/:id', ArtisteController.deleteArtiste);

module.exports = router;
