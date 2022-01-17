// Importation des différents éléments nécessaires
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');

// Importation des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Connexion a la base de données
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.sjrfk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Ajout d'un middleware pour éviter les erreurs CORS
app.use((req, res, next) => {
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
next();
});

// Récupération du contenu json dans les requêtes
app.use(express.json());
app.use(helmet());

app.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
});

// On indique a Express qu'à chaque requête vers la route /images il faut gérer la ressource de manière statique dans le dossier
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app;