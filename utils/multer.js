const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = './uploads/'; // Default folder

    if (req.body.type === 'artist') {
      folder = './uploads/artists/';
    } else if (req.body.type === 'news') {
      folder = './uploads/news/';
    }

    
    else if (req.body.type === 'chansons') {
      folder = './uploads/chansons/';
    }

    // Ensure the folder exists
    fs.mkdirSync(folder, { recursive: true }); // Create folder if it doesn't exist
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique filename with original name
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/; // Formats autorisés
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Seuls les fichiers image sont autorisés"));
  },
});


// Export the upload object
module.exports = upload;
