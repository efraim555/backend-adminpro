const express = require('express');
const app = express();
const mdAutentication = require('../middlewares/autentication');
const Medico = require('../models/medico');

app.get('/', (req, res, next) => {

    let skip = req.query.desde;
    let limit = req.query.hasta;

    skip = Number(skip) || 0;
    limit = Number(limit) || 5;

    Medico.find({})
        .populate('usuario', 'nombre email')
        .populate('hospital', 'nombre')
        .skip(skip)
        .limit(limit)
        .exec((err, medicos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error buscando medicos',
                    errors: err
                })
            }

            Medico.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos,
                    total: conteo
                });
            });
        });
});

app.post('/', mdAutentication.verificaToken, (req, res, next) => {

    let body = req.body;

    let medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medic) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear el medico',
                errors: err
            });
        }

        res.status(200).json({
            ok: true,
            medico: medic
        });
    });
});

app.put('/:id', mdAutentication.verificaToken, (req, res, next) => {

    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: {message: 'El medico con ese id no existe'}
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medic) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medic
            });
        });
    });

});

app.delete('/:id', mdAutentication.verificaToken, (req, res, next) => {

    let id = req.params.id;

    Medico.findOneAndDelete({_id: id}, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: `El medico con el id ${id} no existe`,
                errors: {message: 'El medico con ese id no existe'}
            });
        }

        res.status(200).json({
            ok: true,
            medico
        });
    });
});

module.exports = app;