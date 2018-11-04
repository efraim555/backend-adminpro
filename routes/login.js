//Express
const express = require('express');
const app = express();

//Local
const bcrypt = require('bcryptjs');
const SEED = require('../config/config').SEED;
const jwt = require('jsonwebtoken');

//Google
const GOOGLE_CLIENT_ID = require('../config/config').GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = require('../config/config').GOOGLE_CLIENT_ID;
const {OAuth2Client} = require('google-auth-library');
const oAuth2Client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_SECRET);

//Models
const Usuario = require('../models/usuario');

// =========================================
// Google Verification
// =========================================
let verify = async token => {

    let ticket = await oAuth2Client.verifyIdToken({
        idToken: token
    });

    let payload = ticket.payload;

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture
    };
};

// =========================================
// Local Authentication
// =========================================
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

// =========================================
// Google Authentication
// =========================================
app.post('/google', async (req, res, next) => {

    let token = req.body.token;

    verify(token).then(googleUser => {
        // res.status(200).json({
        //     ok: true,
        //     googleUser
        // })

        Usuario.findOne({email: googleUser.email}, (err, usuario) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuario',
                    errors: err
                });
            }

            if (usuario) {

                if (!usuario.google) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Debe usar su autenticación normal'
                    });
                } else {
                    let token = jwt.sign({usuario}, SEED, {expiresIn: 14400});
                    res.status(200).json({
                        ok: true,
                        usuario,
                        token,
                        id: usuario._id
                    });
                }
            } else {

                let usuario = new Usuario();

                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.img;
                usuario.google = true;
                usuario.password = ':)';

                usuario.save((err, usuarioDB) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al buscar usuario',
                            errors: err
                        });
                    }

                    let token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400});
                    res.status(200).json({
                        ok: true,
                        usuario: usuarioDB,
                        token,
                        id: usuarioDB._id
                    });
                });
            }
        });
    }).catch(e => {
        return res.status(403).json({
            ok: false,
            mensaje: 'Token inválido'
        });
    });
});

module.exports = app;