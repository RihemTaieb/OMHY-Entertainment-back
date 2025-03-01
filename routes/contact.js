const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Route POST pour traiter les messages du formulaire
router.post('/', async (req, res) => {
  const { name, email, subject, message,interest } = req.body;

  // Vérifie que tous les champs nécessaires sont remplis
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  try {
    // Configuration de Nodemailer pour envoyer l'email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Utilise Gmail ou un autre service
      auth: {
        user: 'rihemtaieb9@gmail.com',
        pass: 'okjc imzg kfvo vwnl', // Utilise un mot de passe d'application sécurisé
      },
    });

    const mailOptions = {
        from: 'rihemtaieb9@gmail.com', // Utilise ton email authentifié
        replyTo: email, // Répondra à l'email de l'utilisateur
        to: 'rihemtaieb9@gmail.com', // Ton email de réception
        subject: `${subject}-${name}-Interested in ${interest}`, // Sujet
        text: `Vous avez reçu un message de ${name} (${email}):\n\n${message}`, // Corps du message
      };

    // Envoi de l'email
    await transporter.sendMail(mailOptions);

    // Réponse de succès
    res.status(200).json({ success: 'Message envoyé avec succès !' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message.' });
  }
});

module.exports = router;
