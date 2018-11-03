const express = require('express');
const app = express();
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

//General Search
app.get('/todo/:busqueda', (req, res, next) => {

    let busqueda = req.params.busqueda;
    let regex = new RegExp(busqueda, 'i');

    Promise.all([buscarHospitales(busqueda, regex), buscarMedicos(busqueda, regex), buscarUsuarios(busqueda, regex)])
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });
        });
});

//Search specifically
app.get('/coleccion/:tabla/:busqueda', (req, res, next) => {

    let tabla = req.params.tabla;
    let busqueda = req.params.busqueda;
    let regex = RegExp(busqueda, 'i');

    let promesa;

    switch (tabla) {
        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de busqueda sólo son: usuarios, medicos y hospitales',
                error: {message: 'Tipo de tabla/colección no válida'}
            });
    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        })
    });
});

let buscarHospitales = (busqueda, regex) => {

    return new Promise((resolve, reject) => {

        Hospital.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {

                if (err) {
                    reject('Error al cargar hospitales');
                } else {
                    resolve(hospitales);
                }

            });
    });
};

let buscarMedicos = (busqueda, regex) => {

    return new Promise((resolve, reject) => {

        Medico.find({nombre: regex})
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec((err, medicos) => {

                if (err) {
                    reject('Error al cargar medicos');
                } else {
                    resolve(medicos);
                }
            });
    });
};

let buscarUsuarios = (busqueda, regex) => {

    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role')
            .or([{'nombre': regex}, {'email': regex}])
            .exec((err, usuarios) => {

                if (err) {
                    reject('Error al cargar usuarios');
                } else {
                    resolve(usuarios);
                }
            });
    });
};

module.exports = app;