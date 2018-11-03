const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const app = express();
const Hospital = require('../models/hospital');
const Medico = require('../models/medico');
const Usuario = require('../models/usuario');

app.use(fileUpload());

app.put('/:tipo/:id', (req, res, next) => {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //Collection Types
    let tiposValidos = ['usuarios', 'hospitales', 'medicos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no válida',
            errors: {message: 'El tipo de colección no es válido'}
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No seleccionó un archivo',
            errors: {message: 'Debe seleccionar una imagen'}
        });
    }

    //Get filename
    let archivo = req.files.imagen;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //Accepted Extensions
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    //Extension Validation
    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida ',
            errors: {message: `Las extensiones válidas son: ${extensionesValidas.join(', ')}`}
        })
    }

    //Personalized filename
    //109281091839012-123.png
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    //Move temporal file to source path
    let path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar archivo',
                errors: err
            })
        }

        subirPorTipo(tipo, id, nombreArchivo, res);

        // res.status(200).json({
        //     ok: true,
        //     mensaje: 'Archivo movido'
        // })
    });

});

let subirPorTipo = (tipo, id, nombreArchivo, res) => {

    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (err, usuario) => {

                if (!usuario) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: `El usuario con el id ${id} no existe`,
                        errors: {message: 'El usuario con ese id no existe'}
                    });
                }

                let pathViejo = `./uploads/usuarios/${usuario.img}`;

                //If exists deletes old image
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                usuario.img = nombreArchivo;

                usuario.save((err, user) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al guardar imagen',
                            errors: err
                        });
                    }

                    user.password = ':)';

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: user
                    })
                });
            });
            break;
        case 'hospitales':
            Hospital.findById(id, (err, hospital) => {

                if (!hospital) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: `El hospital con el id ${id} no existe`,
                        errors: {message: 'El hospital con ese id no existe'}
                    });
                }

                let pathViejo = `./uploads/hospitales/${hospital.img}`;

                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                hospital.img = nombreArchivo;

                hospital.save((err, hospitalUpdated) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al guardar imagen',
                            errors: err
                        })
                    }

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de Hospital actualizada',
                        hospital: hospitalUpdated
                    })
                })
            });
            break;
        case 'medicos':
            Medico.findById(id, (err, medico) => {

                if (!medico) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: `El medico con el id ${id} no existe`,
                        errors: {message: 'El medico con ese id no existe'}
                    });
                }

                let pathViejo = `./uploads/medicos/${medico.img}`;

                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                medico.img = nombreArchivo;

                medico.save((err, medic) => {

                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error al guardar imagen',
                            errors: err
                        })
                    }

                    return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de medico actualizada',
                        medico: medic
                    });
                });
            });
            break;
    }
};

module.exports = app;