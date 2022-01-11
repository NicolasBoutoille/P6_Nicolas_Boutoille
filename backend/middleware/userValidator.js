const { body, validationResult } = require('express-validator');

module.exports= [
    body('email').isEmail().withMessage('Email non valide'),
    body('password')
    .trim()
    .escape()
    .isLength({ min: 5}).withMessage('Le mot de passe doit contenir au moins 5 caractères')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une minuscule')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une majuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre'),

    (req, res, next) => {
        const errors = validationResult(req);
        errors.isEmpty() ? next() : res.status(400).json( errors.arrray())
    }
]