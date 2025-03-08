const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const NewsletterSubscriber = require('../models/NewsletterSubscriber'); // Assurez-vous que le modèle est bien importé

dotenv.config(); // Charger les variables d'environnement

const router = express.Router();

// 🔹 Configurer le transporteur SMTP pour IONOS
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ionos.fr", // Serveur SMTP de IONOS
  port: parseInt(process.env.SMTP_PORT, 10) || 465, // Utiliser 465 (SSL) ou 587 (TLS)
  secure: process.env.SMTP_PORT == "465", // true pour SSL/TLS, false pour STARTTLS
  auth: {
    user: process.env.IONOS_EMAIL, // Adresse email IONOS
    pass: process.env.IONOS_PASSWORD, // Mot de passe IONOS
  },
});

// 🔹 Route POST : Inscription à la newsletter
router.post('/', async (req, res) => {
  const { email } = req.body;

  // Vérifier si l'email est valide
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Veuillez entrer une adresse email valide.' });
  }

  try {
    // Vérifier si l'email est déjà inscrit
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: 'Cet email est déjà abonné.' });
    }

    // Ajouter un nouvel abonné
    const newSubscriber = new NewsletterSubscriber({ email });
    await newSubscriber.save();

    // Configurer l'email de confirmation
    const mailOptions = {
      from: `"OMHY FAMILY" <${process.env.IONOS_EMAIL}>`, // Nom affiché + email
      to: email,
      subject: 'Confirmation d\'inscription à la newsletter',
      text: `Bonjour,\n\nMerci de vous être inscrit à notre newsletter ! Restez informé de nos dernières actualités.\n\nCordialement,\nOMHY FAMILY`,
      html: `
        <p><strong>Bonjour,</strong></p>
        <p>Merci de vous être inscrit à notre newsletter ! Restez informé de nos dernières actualités.</p>
        <p>Cordialement,</p>
        <p><strong>OMHY FAMILY</strong></p>
      `,
    };

    // Envoyer l'email de confirmation
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Merci pour votre inscription ! Un email de confirmation a été envoyé.' });
  } catch (error) {
    console.error('Erreur lors de l\'inscription à la newsletter :', error);
    res.status(500).json({ error: 'Une erreur est survenue. Veuillez réessayer plus tard.' });
  }
});

// 🔹 Route GET : Récupérer la liste des abonnés
router.get('/', async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find();
    res.status(200).json(subscribers);
  } catch (error) {
    console.error('Erreur lors de la récupération des abonnés :', error);
    res.status(500).json({ error: 'Une erreur est survenue.' });
  }
});

// 🔹 Route DELETE : Supprimer un abonné par ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedSubscriber = await NewsletterSubscriber.findByIdAndDelete(req.params.id);
    if (!deletedSubscriber) {
      return res.status(404).json({ error: "Abonné introuvable." });
    }
    res.status(200).json({ message: "Abonné supprimé avec succès." });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'abonné :', error);
    res.status(500).json({ error: "Impossible de supprimer l'abonné." });
  }
});

module.exports = router;
