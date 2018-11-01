const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;

exports.verificaToken = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token no válido',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
};