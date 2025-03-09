const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Charge les variables d'environnement

const router = express.Router();

// Route POST pour traiter les messages du formulaire
router.post('/', async (req, res) => {
  const { name, email, subject, message, interest } = req.body;

  // Vérification des champs obligatoires
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  try {
    // Configuration du transporteur SMTP pour IONOS
    const transporter = nodemailer.createTransport({
      host: "smtp.ionos.fr", // Serveur SMTP de IONOS
      port: 465, // Port sécurisé
      secure: true, // Utilise SSL/TLS
      auth: {
        user: process.env.IONOS_EMAIL, // Email stocké en variable d'environnement
        pass: process.env.IONOS_PASSWORD, // Mot de passe sécurisé en variable d'environnement
      },
    });

    const mailOptions = {
      from: process.env.IONOS_EMAIL, // Adresse email expéditrice
      replyTo: email, // Répondre à l'expéditeur
      to: process.env.IONOS_EMAIL, // Destinataire (toi-même)
      subject: `${subject} - ${name} - Interested in ${interest}`, // Sujet
      text: `Vous avez reçu un message de ${name} (${email}):\n\n${message}`, // Version texte
      html: `<p><strong>Nom:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Intérêt:</strong> ${interest}</p>
             <p><strong>Message:</strong></p>
             <p>${message.replace(/\n/g, '<br>')}</p>`, // Version HTML
    };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
});

module.exports = router;
