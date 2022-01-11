const jwt = require('jsonwebtoken');

// Vérification de l'authentification
module.exports = (req, res, next) => {
    try{
        // On récupère le token dans les headers
        const token = req.headers.authorization.split(' ')[1];
        // On décode le token via jsonwebtoken et on le stock dans une variable req pour pouvoir le réutiliser ailleurs
        req.token = jwt.verify(token, process.env.TOKEN);
        // On vérifie donc que l'id du token correspond a l'id de la requête
        if (req.body.userId && req.body.userId !== req.token.userId) {
            throw '403: unauthorized request';
        } else {
            next();
        }
    } catch (error) {
        res.status(401).json({ error: ' Requête non authentifiée !' });
    }
};
