const rateLimit = require('express-rate-limit');

// Limite le nombre de tentatives de connexion par adresse IP, réglé sur 5 minutes et 5 essais
module.exports = rateLimit ({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: "Try again in 5 minutes",
});