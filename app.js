const dotenv = require("dotenv");
dotenv.config(); // Charger les variables d'environnement

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path"); // Import the 'path' module

console.log(process.env); // Print all environment variables
console.log(process.env.JWT_SECRET); // Specifically check if JWT_SECRET is loaded

// Import des routes
const authRoutes = require("./routes/auth");
const artistRoutes = require("./routes/artistes");
const adminRoutes = require("./routes/admin");
const chansonRoutes = require("./routes/chansons");
const albumRoutes = require("./routes/albums");
const adminNewsRoutes = require("./routes/news");
const castingRoutes = require("./routes/casting");
const groupeRoutes = require("./routes/groupe");
const testRoutes = require("./routes/test");
const contactRoutes = require("./routes/contact"); // Import de la route "contact"
const newsletterRoutes = require("./routes/newsletter");
const sliders = require("./routes/backgroundImageRoutes");
const settings = require("./routes/settings");

const app = express();
app.set("trust proxy", 1);

// Serve static files from the 'uploads' folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(
  "/uploads/videos",
  express.static(path.join(__dirname, "uploads/videos"))
);

// Middleware global
const allowlist = [
  process.env.FRONT_APP_URL,
  process.env.DNS,
  process.env.CNAME,
]; // Liste des domaines autorisés

const corsOptionsDelegate = function (req, callback) {
  const origin = req.header("Origin");
  console.log("Origin de la requête:", origin); // Debugging origin

  let corsOptions;
  if (allowlist.includes(origin)) {
    corsOptions = {
      origin: true,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
    }; // Autoriser l'origine
  } else {
    corsOptions = { origin: false }; // Bloquer l'origine
  }
  callback(null, corsOptions);
};

// Enable CORS with dynamic origin check
app.use(cors(corsOptionsDelegate));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Définition des routes
app.use("/api/auth", authRoutes);
app.use("/api/artistes", artistRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/chansons", chansonRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/news", adminNewsRoutes);
app.use("/api/casting", castingRoutes);
app.use("/api/groupes", groupeRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/contact", contactRoutes); // Ajout de la route "contact"
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/sliders", sliders);
app.use("/api/settings", settings);

// Connecter à MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  // Listen on all interfaces, useful for Docker containers
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
