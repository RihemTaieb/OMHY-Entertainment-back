const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import des routes
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors()); // Gère les requêtes Cross-Origin (React ↔ Node.js)
app.use(bodyParser.json()); // Parse les requêtes JSON

// Routes
app.use('/contact', contactRoutes);

// Lancement du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
