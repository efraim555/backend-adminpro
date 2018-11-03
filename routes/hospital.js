const express = require('express');
const app = express();
const mdAutentication = require('../middlewares/autentication');
const Hospital = require('../models/hospital');

app.get('/', (req, res, next) => {

    let skip = req.query.desde;
    let limit = req.query.hasta;

    skip = Number(skip) || 0;
    limit = Number(limit) || 5;

    Hospital.find({})
        .skip(skip)
        .limit(limit)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando hospitales',
                    errors: err
                });
            }

            Hospital.count({}, (err, count) => {
                res.status(200).json({
                    ok: true,
                    hospitales,
                    total: count
                });
            });
        });
});

app.post('/', mdAutentication.verificaToken, (req, res, next) => {

    let body = req.body;

    let hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    hospital.save((err, user) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: user
        });
    });
});

app.put('/:id', mdAutentication.verificaToken, (req, res, next) => {

    let id = req.params.id;
    let body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `El hospital con el id ${id} no existe`,
                errors: {message: 'No existe un usuario con ese id'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalDB
            })
        });
    })

});

app.delete('/:id', mdAutentication.verificaToken, (req, res, next) => {

    let id = req.params.id;

    Hospital.findOneAndDelete({_id: id}, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: `No existe un hospital con el id ${id}`,
                errors: {message: 'No existe un hospital con ese id'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital
        });
    });
});

module.exports = app;