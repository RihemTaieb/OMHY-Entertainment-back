// routes/settings.js (Backend - Node.js avec Express)
const express = require('express');
const router = express.Router();
const Settings = require('../models/Settings'); // Importer le modèle

// Route pour récupérer les paramètres
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.findOne(); // Récupère les paramètres existants
    if (!settings) {
      // Si aucun paramètre n'existe, en créer un par défaut
      const newSettings = new Settings();
      await newSettings.save();
      return res.json(newSettings);
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la récupération des paramètres." });
  }
});

// Route pour mettre à jour les paramètres
router.put('/', async (req, res) => {
  const { isCastingActive, adminMessage } = req.body;
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ error: "Paramètres introuvables." });
    }
    settings.isCastingActive = isCastingActive !== undefined ? isCastingActive : settings.isCastingActive;
    settings.adminMessage = adminMessage !== undefined ? adminMessage : settings.adminMessage;

    await settings.save();
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la mise à jour des paramètres." });
  }
});

module.exports = router;
