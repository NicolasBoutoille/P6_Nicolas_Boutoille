const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création d'un modèle d'utilisateur
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// On vérifie que les adresses mails sont uniques
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);