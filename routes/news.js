const express = require('express');
const multer = require('multer');
const AdminNews = require('../models/news');
const NewsletterSubscriber = require('../models/NewsletterSubscriber'); // Importer les abonnés
const nodemailer = require('nodemailer');

const router = express.Router();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
// Configuration de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où les images seront enregistrées
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Nom unique pour chaque fichier
  },
});

const upload = multer({ storage });

// CREATE - Ajouter une nouvelle actualité avec image
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Enregistrement de la news dans MongoDB
    const newNews = new AdminNews({
      titre: req.body.titre,
      contenu: req.body.contenu,
      date: req.body.date,
      lien: req.body.lien,
      image: req.file ? req.file.path : null, // Enregistrer le chemin de l'image
    });

    const savedNews = await newNews.save();

    // 📩 Récupérer les emails des abonnés
    const subscribers = await NewsletterSubscriber.find();
    const emailList = subscribers.map((sub) => sub.email);

    if (emailList.length > 0) {
      const mailOptions = {
        from: process.env.SMTP_USER,
        to: emailList, // Envoyer à tous les abonnés
        subject: `📰 NEW UPDATE: ${savedNews.titre.toUpperCase()}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
            
            <!-- HEADER -->
            <div style="background:rgb(0, 0, 0); padding: 15px; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 22px;">LATEST NEWS UPDATE</h1>
            </div>
    
            <!-- IMAGE (si disponible) -->
            ${savedNews.image ? `
              <div style="text-align: center; padding: 10px;">
                <img src="http://localhost:5000/${savedNews.image}" alt="News Image"
                     style="width: 100%; max-height: 250px; object-fit: cover; border-bottom: 4px solidrgb(0, 0, 0);">
              </div>` : ''}
            
            <!-- CONTENT -->
            <div style="padding: 20px; color: #333;">
              <h2 style="color:rgb(0, 0, 0);">${savedNews.titre.toUpperCase()}</h2>
              <p style="font-size: 16px; line-height: 1.6;">
                ${savedNews.contenu}
              </p>
              
              <!-- CTA BUTTON -->
              <div style="text-align: center; margin-top: 20px;">
                <a href="${savedNews.lien}" 
                   style="display: inline-block; background:rgb(0, 0, 0); color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
                   🔗 READ MORE
                </a>
              </div>
            </div>
    
            <!-- FOOTER -->
            <div style="background: #f8f9fa; text-align: center; padding: 15px; font-size: 14px; color: #666;">
              <p>Thank you for staying updated with us!</p>
              <p style="margin: 0;">📩 <a href="mailto:contact@omhyentertainment.com" style="color:rgb(0, 0, 0); text-decoration: none;">Contact Us</a></p>
            </div>
            
          </div>
        `,
      };
    
      // Envoyer l'email
      await transporter.sendMail(mailOptions);
    }

    res.status(201).json(savedNews);
  } catch (error) {
    console.error('Erreur lors de l’ajout de la news:', error);
    res.status(400).json({ message: error.message });
  }
});

// READ - Récupérer toutes les actualités
router.get('/', async (req, res) => {
  try {
    const news = await AdminNews.find();
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ - Récupérer une actualité par ID
router.get('/:id', async (req, res) => {
  try {
    const news = await AdminNews.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'Actualité non trouvée' });
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE - Modifier une actualité avec image
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const updatedData = {
      titre: req.body.titre,
      contenu: req.body.contenu,
      date: req.body.date,
      lien: req.body.lien,


    };
    if (req.file) updatedData.image = req.file.path; // Mettre à jour l'image si présente

    const updatedNews = await AdminNews.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });
    if (!updatedNews) return res.status(404).json({ message: 'Actualité non trouvée' });
    res.status(200).json(updatedNews);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE - Supprimer une actualité
router.delete('/:id', async (req, res) => {
  try {
    const deletedNews = await AdminNews.findByIdAndDelete(req.params.id);
    if (!deletedNews) return res.status(404).json({ message: 'Actualité non trouvée' });
    res.status(200).json({ message: 'Actualité supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
