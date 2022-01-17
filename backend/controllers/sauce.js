const Sauce = require('../models/Sauce');
const fs = require('fs');

// Affichage de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// Affichage d'une sauce via son id
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Création de sauce
exports.createSauce = (req, res, next) => {
    // On récupère l'objet de la requête en le transformant en objet JSON
    const sauceObject = JSON.parse(req.body.sauce);
    // On créé ensuite la sauce a partir du model
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    // Et on le sauvegarde dans la base de données
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

// Modification d'une sauce
exports.modifySauce = (req, res, next) => {
    // On vérifie si il y a une nouvelle image dans la requête
    const sauceObject = req.file ?
    // Si c'est le cas on récupère l'objet et on modifie l'imageUrl
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // Sinon on récupère le corps de la requête
     } : { ...req.body };
     // Et on modifie son id pour qu'il corresponde a l'id des paramètres de requête
     Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json({ error }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    // On recherche l'objet via son id
    Sauce.findOne({ _id: req.params.id })
    .then( sauce => { 
        // On récupère le nom du fichier présent dans l'url via split
        const filename = sauce.imageUrl.split('/images/')[1];
        // On supprime le fichier du dossier images
        fs.unlink(`images/${filename}`, () => {
            // On supprime ensuite le fichier de la base de données
            Sauce.deleteOne({ _id: req.params.id })
                .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
                .catch(error => res.status(400).json({ error }));
        });
    })
    .catch(error => res.status(500).json({ error }));
}

// Like/Dislike d'une sauce
exports.likeSauce = (req, res, next) => {
    // On recherche l'objet via son id
    Sauce.findOne({ _id: req.params.id })
    .then( sauce => {
        const like = req.body.like;
        const userId = req.token.userId;
        const sauceId = req.params.id
        // Si l'utilisateur ajoute un like
        if( like === 1){
            // On modifie la sauce en ajoutant la valeur 1 a "likes" et le userId dans le tableau "usersLiked"
            Sauce.updateOne({ _id: sauceId }, { $inc:{ likes: 1 },$push:{ usersLiked: userId}, _id: sauceId })
            .then(() => res.status(200).json({ message: 'Like ajouté !'}))
            .catch(error => res.status(400).json({ error }));
        // Sinon si l'utilisateur change d'avis et retire son like/dislike
        }else if( like === 0){
            // Si l'userId est déjà présent dans le tableau "usersLiked"
            if(sauce.usersLiked.includes(userId)){
                // On retire 1 à "likes" et on supprime le userId dans le tableau
                Sauce.updateOne({ _id: sauceId }, { $inc:{ likes: -1 }, $pull:{ usersLiked: userId }, _id: sauceId})
                .then(() => res.status(200).json({ message: 'Like retiré !'}))
                .catch(error => res.status(400).json({ error }));
            }
            // Si l'userId est déjà présent dans le tableau "usersDisliked"
            if(sauce.usersDisliked.includes(userId)){
                // On retire 1 à "Dislikes" et on supprime le userId dans le tableau
                Sauce.updateOne({ _id: sauceId}, { $inc:{ dislikes: -1}, $pull:{ usersDisliked: userId }, _id: sauceId})
                .then(() => res.status(200).json({ message: 'Dislike retiré !'}))
                .catch(errror => res.status(400).json({ error }));
            }
        // Sinon si l'utilisateur ajoute un dislike
        }else if(like === -1){
            // On modifie la sauce en ajoutant la valeur 1 a "dislikes" et le userId dans le tableau "usersDisliked"
            Sauce.updateOne({ _id: sauceId }, { $inc:{ dislikes: 1 },$push:{ usersDisliked: userId }, _id: sauceId})
            .then(() => res.status(200).json({ message: 'Dislike ajouté !'}))
            .catch(error => res.status(400).json({ error }));
        }
    })
    .catch(error => res.status(500).json({ error }));
}