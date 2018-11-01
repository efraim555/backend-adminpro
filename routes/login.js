const express = require('express');
const bcrypt = require('bcryptjs');
const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');
let app = express();
let Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: {message: 'Credenciales incorrectas - email'}
            });
        }

        if (!bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas',
                errors: {message: 'Credenciales incorrectas - password'}
            });
        }

        //Create token
        usuario.password = ':)';
        let token = jwt.sign({usuario}, SEED, {expiresIn: 14400});

        res.status(200).json({
            ok: true,
            usuario,
            token,
            id: usuario._id
        });
    });
});

module.exports = app;