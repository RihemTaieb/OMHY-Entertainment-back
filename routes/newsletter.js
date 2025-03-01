const express = require('express');
const router = express.Router();
const NewsletterSubscriber = require('../models/NewsletterSubscriber');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurer le transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // false pour STARTTLS et true pour SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Route pour gérer les inscriptions à la newsletter
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  try {
    // Vérifier si l'email est déjà inscrit
    const existingSubscriber = await NewsletterSubscriber.findOne({ email });
    if (existingSubscriber) {
      return res.status(400).json({ error: 'This email is already subscribed.' });
    }

    // Ajouter un nouvel abonné
    const newSubscriber = new NewsletterSubscriber({ email });
    await newSubscriber.save();

    // Envoyer un email de confirmation
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Subscription Confirmation',
      text: `Hello, \n\nThank you for subscribing to our newsletter! Stay tuned for updates. \n\nBest regards,\nYour Team`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: 'Thank you for subscribing! A confirmation email has been sent.' });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});
router.get('/', async (req, res) => {
    try {
      const subscribers = await NewsletterSubscriber.find();
      res.status(200).json(subscribers);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      res.status(500).json({ error: 'Something went wrong.' });
    }
  });
  
  // Route pour supprimer un abonné
  router.delete('/:id', async (req, res) => {
    try {
      await NewsletterSubscriber.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Subscriber removed successfully" });
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      res.status(500).json({ error: "Couldn't delete subscriber." });
    }
  });
  
module.exports = router;
