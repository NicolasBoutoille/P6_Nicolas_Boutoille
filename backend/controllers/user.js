const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config()

exports.signup = (req, res, next) => {
    // Hachage du mot de passe avec bcrypt
    bcrypt.hash(req.body.password, 10)
    // La fonction nous renvoie une promise avec le mot de passe haché
    .then(hash => {
        // Création d'un utilisateur a partir du model
      const user = new User({
          email: req.body.email,
          password: hash
      });
      // Sauvegarde de l'utilisateur
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch(error => res.status(400).json({ error }));  
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    // On récupère l'utilisateur de la base avec le mail correspondant
    User.findOne({ email: req.body.email })
        .then(user => {
            // Si l'adresse mail n'existe pas, on retourne une erreur
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Comparaison du mot de passe de la requête avec celui de base de données
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // Si la comparaison n'est pas bonne on retourne une erreur
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect ' });
                    }
                    // Si la comparaison est valide on renvoie un userID et un token d'authentification
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id},
                            process.env.TOKEN,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error}));
        })
        .catch(error => res.status(500).json({ error}));
};