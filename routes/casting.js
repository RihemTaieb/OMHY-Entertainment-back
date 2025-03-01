const express = require('express');
const multer = require('multer');
const path = require('path');
const CastingController = require('../controllers/castingController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/videos/'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /mp4|mov|avi|mkv/; // Formats autorisés
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Seuls les fichiers vidéo sont autorisés'), false);
  }
});


router.get('/', CastingController.getAllCastings);
router.get('/:id', CastingController.getCastingById);
router.post('/', upload.single('video'), CastingController.createCasting);
router.put('/:id', upload.single('video'), CastingController.updateCasting);
router.delete('/:id', CastingController.deleteCasting);

module.exports = router;
