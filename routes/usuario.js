const express = require('express');
const bcrypt = require('bcryptjs');
const mdAutentication = require('../middlewares/autentication');
const app = express();
const Usuario = require('../models/usuario');

//Get Users
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email img role').exec((err, usuarios) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando usuarios',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            usuarios
        });
    });
});

//Create User
app.post('/', mdAutentication.verificaToken, (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        img: body.img,
        role: body.role,
        password: bcrypt.hashSync(body.password, 10)
    });

    usuario.save((err, user) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: user
        });
    });
});

//Update User
app.put('/:id', mdAutentication.verificaToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario) => {

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
                mensaje: `El usuario con el id ${id} no existe`,
                errors: {message: 'No existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, user) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            user.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: user
            });
        });
    });
});

//Delete user
app.delete('/:id', mdAutentication.verificaToken, (req, res) => {

    let id = req.params.id;

    Usuario.findOneAndDelete({_id: id}, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: `No existe el usuario con el id ${id}`,
                errors: {message: 'No existe un usuario con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            usuario
        });
    });
});

module.exports = app;