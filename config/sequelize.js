const { Sequelize } = require('sequelize');
require('dotenv').config(); // Charger les variables d'environnement

const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USER,
    process.env.MYSQL_PASSWORD,
    {
        host: process.env.MYSQL_HOST,
        dialect: 'mysql',
        logging: false, // Désactiver les logs SQL pour plus de clarté
    }
);

sequelize.authenticate()
    .then(() => console.log('✅ Connecté à la base de données MySQL'))
    .catch((err) => console.error('❌ Erreur de connexion à MySQL :', err));

module.exports = sequelize;
